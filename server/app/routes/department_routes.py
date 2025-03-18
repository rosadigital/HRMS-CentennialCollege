from flask import Blueprint, request, jsonify
from ..utils.db_utils import get_departments, get_department, get_department_options, create_department, update_department, delete_department

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
        
        
@department_bp.route('/', methods=['POST'])
def create_department_route():
    """Create a new deparment using direct connection approach."""
    try:
        data = request.get_json()
        
        # Basic validation
        required_fields = ['department_id', 'department_name', 'location_id', 'manager_id']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    'success': False,
                    'message': f"Field '{field}' is required",
                    'error': 400
                }), 400

        department_data = create_department(data)
        print(department_data)
        return jsonify({
            'success': True,
            'message': 'Department created successfully',
            'department': department_data
        }), 201
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500

@department_bp.route('/<int:department_id>', methods=['PUT'])
def update_employee_route(department_id):
    """Update an existing department using direct connection approach."""
    try:
        data = request.get_json()
        
        # Check if department exists
        department_data = get_department(department_id)
        if not department_data:
            return jsonify({
                'success': False,
                'message': f'Department with ID {department_id} not found',
                'error': 404
            }), 404
        
        updated_department = update_department(department_id, data)
        return jsonify({
            'success': True,
            'message': 'Employee updated successfully',
            'department': updated_department
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500

@department_bp.route('/<int:department_id>', methods=['DELETE'])
def delete_employee_route(department_id):
    """Delete an department using direct connection approach."""
    try:
        # Check if employee exists
        department_data = get_department(department_id)
        if not department_data:
            return jsonify({
                'success': False,
                'message': f'Department with ID {department_id} not found',
                'error': 404
            }), 404
        
        success = delete_department(department_id)
        if success:
            return jsonify({
                'success': True,
                'message': 'Department deleted successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to delete department',
                'error': 500
            }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500 