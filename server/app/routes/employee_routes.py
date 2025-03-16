from flask import Blueprint, request, jsonify
from ..utils.db_utils import (
    get_employees,
    get_employee,
    create_employee,
    update_employee,
    delete_employee
)

employee_bp = Blueprint('employee', __name__)

@employee_bp.route('/', methods=['GET'])
def get_employees_route():
    """Get all employees using direct connection approach."""
    try:
        employees_data = get_employees()
        return jsonify({
            'success': True,
            'employees': employees_data
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500

@employee_bp.route('/<int:employee_id>', methods=['GET'])
def get_employee_route(employee_id):
    """Get a single employee by ID using direct connection approach."""
    try:
        employee_data = get_employee(employee_id)
        if not employee_data:
            return jsonify({
                'success': False,
                'message': f'Employee with ID {employee_id} not found',
                'error': 404
            }), 404
        
        return jsonify({
            'success': True,
            'employee': employee_data
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500

@employee_bp.route('/', methods=['POST'])
def create_employee_route():
    """Create a new employee using direct connection approach."""
    try:
        data = request.get_json()
        
        # Basic validation
        required_fields = ['first_name', 'last_name', 'email', 'job_id']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    'success': False,
                    'message': f"Field '{field}' is required",
                    'error': 400
                }), 400

        employee_data = create_employee(data)
        print(employee_data)
        return jsonify({
            'success': True,
            'message': 'Employee created successfully',
            'employee': employee_data
        }), 201
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500

@employee_bp.route('/<int:employee_id>', methods=['PUT'])
def update_employee_route(employee_id):
    """Update an existing employee using direct connection approach."""
    try:
        data = request.get_json()
        
        # Check if employee exists
        employee_data = get_employee(employee_id)
        if not employee_data:
            return jsonify({
                'success': False,
                'message': f'Employee with ID {employee_id} not found',
                'error': 404
            }), 404
        
        updated_employee = update_employee(employee_id, data)
        return jsonify({
            'success': True,
            'message': 'Employee updated successfully',
            'employee': updated_employee
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500

@employee_bp.route('/<int:employee_id>', methods=['DELETE'])
def delete_employee_route(employee_id):
    """Delete an employee using direct connection approach."""
    try:
        # Check if employee exists
        employee_data = get_employee(employee_id)
        if not employee_data:
            return jsonify({
                'success': False,
                'message': f'Employee with ID {employee_id} not found',
                'error': 404
            }), 404
        
        success = delete_employee(employee_id)
        if success:
            return jsonify({
                'success': True,
                'message': 'Employee deleted successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to delete employee',
                'error': 500
            }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500 