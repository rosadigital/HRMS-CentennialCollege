from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, validate, ValidationError
from ..models import Job, Employee
from .. import db

job_bp = Blueprint('job', __name__)

# Schema for request validation
class JobSchema(Schema):
    job_id = fields.String(required=True, validate=validate.Length(min=1, max=10))
    job_title = fields.String(required=True, validate=validate.Length(min=1, max=35))
    min_salary = fields.Integer()
    max_salary = fields.Integer()

job_schema = JobSchema()

@job_bp.route('/', methods=['GET'])
@jwt_required()
def get_jobs():
    """Get all jobs."""
    jobs = Job.query.all()
    return jsonify({
        'success': True,
        'jobs': [job.to_dict() for job in jobs]
    }), 200

@job_bp.route('/<string:job_id>', methods=['GET'])
@jwt_required()
def get_job(job_id):
    """Get a single job by ID."""
    job = Job.query.filter_by(job_id=job_id).first_or_404()
    
    # Get employees with this job
    employees = Employee.query.filter_by(job_id=job_id).all()
    
    result = job.to_dict()
    result['employees'] = [
        {
            'employee_id': employee.employee_id,
            'name': f"{employee.first_name} {employee.last_name}",
            'email': employee.email,
            'department': employee.department.department_name if employee.department else None
        } for employee in employees
    ]
    
    return jsonify({
        'success': True,
        'job': result
    }), 200

@job_bp.route('/', methods=['POST'])
@jwt_required()
def create_job():
    """Create a new job."""
    data = request.get_json()
    
    # Validate input
    try:
        validated_data = job_schema.load(data)
    except ValidationError as err:
        return jsonify({
            'success': False,
            'message': 'Validation error',
            'errors': err.messages
        }), 400
    
    # Check if job_id already exists
    existing_job = Job.query.filter_by(job_id=validated_data['job_id']).first()
    if existing_job:
        return jsonify({
            'success': False,
            'message': f"Job with ID {validated_data['job_id']} already exists"
        }), 400
    
    # Validate salary range
    if ('min_salary' in validated_data and 'max_salary' in validated_data and 
            validated_data['min_salary'] and validated_data['max_salary'] and 
            validated_data['min_salary'] > validated_data['max_salary']):
        return jsonify({
            'success': False,
            'message': 'Minimum salary cannot be greater than maximum salary'
        }), 400
    
    # Create the job
    new_job = Job(**validated_data)
    db.session.add(new_job)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Job created successfully',
        'job': new_job.to_dict()
    }), 201

@job_bp.route('/<string:job_id>', methods=['PUT'])
@jwt_required()
def update_job(job_id):
    """Update an existing job."""
    job = Job.query.filter_by(job_id=job_id).first_or_404()
    data = request.get_json()
    
    # Validate input
    try:
        validated_data = job_schema.load(data, partial=True)
    except ValidationError as err:
        return jsonify({
            'success': False,
            'message': 'Validation error',
            'errors': err.messages
        }), 400
    
    # If job_id is being changed, check if new job_id already exists
    if 'job_id' in validated_data and validated_data['job_id'] != job_id:
        existing_job = Job.query.filter_by(job_id=validated_data['job_id']).first()
        if existing_job:
            return jsonify({
                'success': False,
                'message': f"Job with ID {validated_data['job_id']} already exists"
            }), 400
    
    # Validate salary range
    min_salary = validated_data.get('min_salary', job.min_salary)
    max_salary = validated_data.get('max_salary', job.max_salary)
    
    if min_salary and max_salary and min_salary > max_salary:
        return jsonify({
            'success': False,
            'message': 'Minimum salary cannot be greater than maximum salary'
        }), 400
    
    # Update the job
    for key, value in validated_data.items():
        setattr(job, key, value)
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Job updated successfully',
        'job': job.to_dict()
    }), 200

@job_bp.route('/<string:job_id>', methods=['DELETE'])
@jwt_required()
def delete_job(job_id):
    """Delete a job."""
    job = Job.query.filter_by(job_id=job_id).first_or_404()
    
    # Check if there are employees with this job
    employees = Employee.query.filter_by(job_id=job_id).first()
    if employees:
        return jsonify({
            'success': False,
            'message': 'Cannot delete job that has employees assigned. Reassign employees first.'
        }), 400
    
    try:
        db.session.delete(job)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Job deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Failed to delete job',
            'error': str(e)
        }), 500 