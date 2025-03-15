from flask import Blueprint, request, jsonify
from ..models import Job, Employee
from .. import db

job_bp = Blueprint('job', __name__)

@job_bp.route('/', methods=['GET'])
def get_jobs():
    """Get all jobs."""
    jobs = Job.query.all()
    return jsonify({
        'success': True,
        'jobs': [job.to_dict() for job in jobs]
    }), 200

@job_bp.route('/<string:job_id>', methods=['GET'])
def get_job(job_id):
    """Get a single job by ID."""
    job = Job.query.get_or_404(job_id)
    
    # Get employees with this job
    employees = Employee.query.filter_by(JOB_ID=job_id).all()
    
    result = job.to_dict()
    result['employees'] = [employee.to_dict() for employee in employees]
    
    return jsonify({
        'success': True,
        'job': result
    }), 200

@job_bp.route('/', methods=['POST'])
def create_job():
    """Create a new job."""
    data = request.get_json()
    
    # Map request fields to Oracle column names
    oracle_data = {}
    field_mapping = {
        'job_id': 'JOB_ID',
        'job_title': 'JOB_TITLE',
        'min_salary': 'MIN_SALARY',
        'max_salary': 'MAX_SALARY'
    }
    
    for key, value in data.items():
        if key in field_mapping:
            oracle_data[field_mapping[key]] = value
    
    try:
        new_job = Job(**oracle_data)
        db.session.add(new_job)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Job created successfully',
            'job': new_job.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@job_bp.route('/<string:job_id>', methods=['PUT'])
def update_job(job_id):
    """Update an existing job."""
    job = Job.query.get_or_404(job_id)
    data = request.get_json()
    
    # Map request fields to Oracle column names
    field_mapping = {
        'job_title': 'JOB_TITLE',
        'min_salary': 'MIN_SALARY',
        'max_salary': 'MAX_SALARY'
    }
    
    try:
        for key, value in data.items():
            if key in field_mapping:
                setattr(job, field_mapping[key], value)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Job updated successfully',
            'job': job.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@job_bp.route('/<string:job_id>', methods=['DELETE'])
def delete_job(job_id):
    """Delete a job."""
    job = Job.query.get_or_404(job_id)
    
    # Check if there are employees with this job
    employees = Employee.query.filter_by(JOB_ID=job_id).first()
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
            'message': f'Failed to delete job: {str(e)}'
        }), 500 