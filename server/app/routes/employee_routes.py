from flask import Blueprint, request, jsonify
from ..models import Employee, Department, Job
from .. import db

employee_bp = Blueprint('employee', __name__)

@employee_bp.route('/', methods=['GET'])
def get_employees():
    """Get all employees."""
    employees = Employee.query.all()
    return jsonify({
        'success': True,
        'employees': [employee.to_dict() for employee in employees]
    }), 200

@employee_bp.route('/<int:employee_id>', methods=['GET'])
def get_employee(employee_id):
    """Get a single employee by ID."""
    employee = Employee.query.get_or_404(employee_id)
    return jsonify({
        'success': True,
        'employee': employee.to_dict()
    }), 200

@employee_bp.route('/', methods=['POST'])
def create_employee():
    """Create a new employee."""
    data = request.get_json()
    
    # Map request fields to Oracle column names
    oracle_data = {}
    field_mapping = {
        'first_name': 'FIRST_NAME',
        'last_name': 'LAST_NAME',
        'email': 'EMAIL',
        'phone_number': 'PHONE_NUMBER',
        'hire_date': 'HIRE_DATE',
        'job_id': 'JOB_ID',
        'salary': 'SALARY',
        'commission_pct': 'COMMISSION_PCT',
        'manager_id': 'MANAGER_ID',
        'department_id': 'DEPARTMENT_ID'
    }
    
    for key, value in data.items():
        if key in field_mapping:
            oracle_data[field_mapping[key]] = value
    
    try:
        new_employee = Employee(**oracle_data)
        db.session.add(new_employee)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Employee created successfully',
            'employee': new_employee.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@employee_bp.route('/<int:employee_id>', methods=['PUT'])
def update_employee(employee_id):
    """Update an existing employee."""
    employee = Employee.query.get_or_404(employee_id)
    data = request.get_json()
    
    # Map request fields to Oracle column names
    field_mapping = {
        'first_name': 'FIRST_NAME',
        'last_name': 'LAST_NAME',
        'email': 'EMAIL',
        'phone_number': 'PHONE_NUMBER',
        'hire_date': 'HIRE_DATE',
        'job_id': 'JOB_ID',
        'salary': 'SALARY',
        'commission_pct': 'COMMISSION_PCT',
        'manager_id': 'MANAGER_ID',
        'department_id': 'DEPARTMENT_ID'
    }
    
    try:
        for key, value in data.items():
            if key in field_mapping:
                setattr(employee, field_mapping[key], value)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Employee updated successfully',
            'employee': employee.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@employee_bp.route('/<int:employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    """Delete an employee."""
    employee = Employee.query.get_or_404(employee_id)
    
    try:
        db.session.delete(employee)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Employee deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to delete employee: {str(e)}'
        }), 500 