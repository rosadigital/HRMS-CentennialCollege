from flask import Blueprint, request, jsonify
from ..utils.db_utils import get_jobs, get_job, get_job_options

job_bp = Blueprint('job', __name__)

@job_bp.route('/', methods=['GET'])
def get_jobs_route():
    """Get all jobs using direct connection approach."""
    try:
        jobs_data = get_jobs()
        return jsonify({
            'success': True,
            'jobs': jobs_data
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500

@job_bp.route('/<string:job_id>', methods=['GET'])
def get_job_route(job_id):
    """Get a single job by ID using direct connection approach."""
    try:
        job_data = get_job(job_id)
        if not job_data:
            return jsonify({
                'success': False,
                'message': f'Job with ID {job_id} not found',
                'error': 404
            }), 404
        
        return jsonify({
            'success': True,
            'job': job_data
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500

@job_bp.route('/options', methods=['GET'])
def get_job_options_route():
    """Get all jobs as options for dropdown."""
    try:
        options = get_job_options()
        return jsonify({
            'success': True,
            'options': options
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500 