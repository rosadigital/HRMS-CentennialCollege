from flask import Blueprint, request, jsonify
from ..utils.db_utils import get_departments, get_department, get_department_options

department_bp = Blueprint('department', __name__)

@department_bp.route('/', methods=['GET'])
def get_departments_route():
    """Get all departments using direct connection approach."""
    try:
        departments_data = get_departments()
        return jsonify({
            'success': True,
            'departments': departments_data
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500

@department_bp.route('/<int:department_id>', methods=['GET'])
def get_department_route(department_id):
    """Get a single department by ID using direct connection approach."""
    try:
        department_data = get_department(department_id)
        if not department_data:
            return jsonify({
                'success': False,
                'message': f'Department with ID {department_id} not found',
                'error': 404
            }), 404
        
        return jsonify({
            'success': True,
            'department': department_data
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500

@department_bp.route('/options', methods=['GET'])
def get_department_options_route():
    """Get all departments as options for dropdown."""
    try:
        options = get_department_options()
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