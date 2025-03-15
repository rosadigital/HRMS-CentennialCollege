from flask import Blueprint, request, jsonify
from ..models import JobGrade
from .. import db

job_grade_bp = Blueprint('job_grade', __name__)

@job_grade_bp.route('/', methods=['GET'])
def get_job_grades():
    """Get all job grades."""
    job_grades = JobGrade.query.all()
    return jsonify({
        'success': True,
        'job_grades': [jg.to_dict() for jg in job_grades]
    }), 200

@job_grade_bp.route('/<string:grade_level>', methods=['GET'])
def get_job_grade(grade_level):
    """Get a single job grade by level."""
    job_grade = JobGrade.query.get_or_404(grade_level)
    return jsonify({
        'success': True,
        'job_grade': job_grade.to_dict()
    }), 200

@job_grade_bp.route('/', methods=['POST'])
def create_job_grade():
    """Create a new job grade."""
    data = request.get_json()
    
    # Map request fields to Oracle column names
    oracle_data = {}
    field_mapping = {
        'grade_level': 'GRADE_LEVEL',
        'lowest_salary': 'LOWEST_SAL',
        'highest_salary': 'HIGHEST_SAL'
    }
    
    for key, value in data.items():
        if key in field_mapping:
            oracle_data[field_mapping[key]] = value
    
    try:
        new_job_grade = JobGrade(**oracle_data)
        db.session.add(new_job_grade)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Job grade created successfully',
            'job_grade': new_job_grade.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@job_grade_bp.route('/<string:grade_level>', methods=['PUT'])
def update_job_grade(grade_level):
    """Update an existing job grade."""
    job_grade = JobGrade.query.get_or_404(grade_level)
    data = request.get_json()
    
    # Map request fields to Oracle column names
    field_mapping = {
        'lowest_salary': 'LOWEST_SAL',
        'highest_salary': 'HIGHEST_SAL'
    }
    
    try:
        for key, value in data.items():
            if key in field_mapping:
                setattr(job_grade, field_mapping[key], value)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Job grade updated successfully',
            'job_grade': job_grade.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@job_grade_bp.route('/<string:grade_level>', methods=['DELETE'])
def delete_job_grade(grade_level):
    """Delete a job grade."""
    job_grade = JobGrade.query.get_or_404(grade_level)
    
    try:
        db.session.delete(job_grade)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Job grade deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to delete job grade: {str(e)}'
        }), 500 