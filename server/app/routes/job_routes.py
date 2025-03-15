from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from marshmallow import Schema, fields, validate, ValidationError
from ..models import Job, Employee
from .. import db

job_bp = Blueprint('job', __name__)

# Schema for request validation
class JobSchema(Schema):
    title = fields.String(required=True, validate=validate.Length(min=1, max=100))
    description = fields.String()
    min_salary = fields.Float(validate=validate.Range(min=0))
    max_salary = fields.Float(validate=validate.Range(min=0))

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

@job_bp.route('/<int:job_id>', methods=['GET'])
@jwt_required()
def get_job(job_id):
    """Get a single job by ID."""
    job = Job.query.get_or_404(job_id)
    
    # Get employees with this job
    employees = Employee.query.filter_by(job_id=job_id).all()
    
    result = job.to_dict()
    result['employees'] = [employee.to_dict() for employee in employees]
    
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
    
    # Validate min_salary <= max_salary if both are provided
    if 'min_salary' in validated_data and 'max_salary' in validated_data:
        if validated_data['min_salary'] > validated_data['max_salary']:
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

@job_bp.route('/<int:job_id>', methods=['PUT'])
@jwt_required()
def update_job(job_id):
    """Update an existing job."""
    job = Job.query.get_or_404(job_id)
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
    
    # Validate min_salary <= max_salary if either is being updated
    if 'min_salary' in validated_data or 'max_salary' in validated_data:
        min_salary = validated_data.get('min_salary', job.min_salary)
        max_salary = validated_data.get('max_salary', job.max_salary)
        
        if min_salary > max_salary:
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

@job_bp.route('/<int:job_id>', methods=['DELETE'])
@jwt_required()
def delete_job(job_id):
    """Delete a job."""
    job = Job.query.get_or_404(job_id)
    
    # Check if there are employees with this job
    employees = Employee.query.filter_by(job_id=job_id).first()
    if employees:
        return jsonify({
            'success': False,
            'message': 'Cannot delete job that has employees. Reassign employees first.'
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