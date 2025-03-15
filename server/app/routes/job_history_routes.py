from flask import Blueprint, request, jsonify
from datetime import datetime
from ..models import JobHistory, Employee, Job, Department
from .. import db

job_history_bp = Blueprint('job_history', __name__)

@job_history_bp.route('/', methods=['GET'])
def get_job_histories():
    """Get all job histories."""
    job_histories = JobHistory.query.all()
    return jsonify({
        'success': True,
        'job_histories': [jh.to_dict() for jh in job_histories]
    }), 200

@job_history_bp.route('/employee/<int:employee_id>', methods=['GET'])
def get_employee_job_history(employee_id):
    """Get job history for a specific employee."""
    # Verify employee exists
    employee = Employee.query.get_or_404(employee_id)
    
    # Get job history for this employee
    job_histories = JobHistory.query.filter_by(EMPLOYEE_ID=employee_id).order_by(JobHistory.START_DATE).all()
    
    return jsonify({
        'success': True,
        'employee': {
            'employee_id': employee.EMPLOYEE_ID,
            'name': f"{employee.FIRST_NAME} {employee.LAST_NAME}",
            'email': employee.EMAIL
        },
        'job_histories': [jh.to_dict() for jh in job_histories]
    }), 200

@job_history_bp.route('/', methods=['POST'])
def create_job_history():
    """Create a new job history entry."""
    data = request.get_json()
    
    # Map request fields to Oracle column names
    oracle_data = {}
    field_mapping = {
        'employee_id': 'EMPLOYEE_ID',
        'start_date': 'START_DATE',
        'end_date': 'END_DATE',
        'job_id': 'JOB_ID',
        'department_id': 'DEPARTMENT_ID'
    }
    
    for key, value in data.items():
        if key in field_mapping:
            # Parse dates if needed
            if key in ['start_date', 'end_date'] and value:
                try:
                    oracle_data[field_mapping[key]] = datetime.fromisoformat(value)
                except ValueError:
                    return jsonify({
                        'success': False,
                        'message': f'Invalid date format for {key}. Use ISO format (YYYY-MM-DD).'
                    }), 400
            else:
                oracle_data[field_mapping[key]] = value
    
    try:
        # Verify dependencies
        if 'EMPLOYEE_ID' in oracle_data:
            employee = Employee.query.get(oracle_data['EMPLOYEE_ID'])
            if not employee:
                return jsonify({
                    'success': False,
                    'message': f'Employee with ID {oracle_data["EMPLOYEE_ID"]} not found'
                }), 404
        
        if 'JOB_ID' in oracle_data:
            job = Job.query.get(oracle_data['JOB_ID'])
            if not job:
                return jsonify({
                    'success': False,
                    'message': f'Job with ID {oracle_data["JOB_ID"]} not found'
                }), 404
        
        if 'DEPARTMENT_ID' in oracle_data:
            department = Department.query.get(oracle_data['DEPARTMENT_ID'])
            if not department:
                return jsonify({
                    'success': False,
                    'message': f'Department with ID {oracle_data["DEPARTMENT_ID"]} not found'
                }), 404
        
        new_job_history = JobHistory(**oracle_data)
        db.session.add(new_job_history)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Job history created successfully',
            'job_history': new_job_history.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@job_history_bp.route('/<int:employee_id>/<start_date>', methods=['PUT'])
def update_job_history(employee_id, start_date):
    """Update an existing job history entry."""
    try:
        # Parse start_date from URL
        start_date_obj = datetime.fromisoformat(start_date)
        
        # Find the job history entry
        job_history = JobHistory.query.filter_by(
            EMPLOYEE_ID=employee_id, 
            START_DATE=start_date_obj
        ).first_or_404()
        
        data = request.get_json()
        
        # Map request fields to Oracle column names
        field_mapping = {
            'end_date': 'END_DATE',
            'job_id': 'JOB_ID',
            'department_id': 'DEPARTMENT_ID'
        }
        
        for key, value in data.items():
            if key in field_mapping:
                # Parse dates if needed
                if key == 'end_date' and value:
                    try:
                        setattr(job_history, field_mapping[key], datetime.fromisoformat(value))
                    except ValueError:
                        return jsonify({
                            'success': False,
                            'message': f'Invalid date format for {key}. Use ISO format (YYYY-MM-DD).'
                        }), 400
                else:
                    setattr(job_history, field_mapping[key], value)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Job history updated successfully',
            'job_history': job_history.to_dict()
        }), 200
    except ValueError:
        return jsonify({
            'success': False,
            'message': 'Invalid date format in URL. Use ISO format (YYYY-MM-DD).'
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@job_history_bp.route('/<int:employee_id>/<start_date>', methods=['DELETE'])
def delete_job_history(employee_id, start_date):
    """Delete a job history entry."""
    try:
        # Parse start_date from URL
        start_date_obj = datetime.fromisoformat(start_date)
        
        # Find the job history entry
        job_history = JobHistory.query.filter_by(
            EMPLOYEE_ID=employee_id, 
            START_DATE=start_date_obj
        ).first_or_404()
        
        db.session.delete(job_history)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Job history deleted successfully'
        }), 200
    except ValueError:
        return jsonify({
            'success': False,
            'message': 'Invalid date format in URL. Use ISO format (YYYY-MM-DD).'
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to delete job history: {str(e)}'
        }), 500 