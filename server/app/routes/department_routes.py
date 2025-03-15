from flask import Blueprint, request, jsonify
from ..models import Department, Employee
from .. import db

department_bp = Blueprint('department', __name__)

@department_bp.route('/', methods=['GET'])
def get_departments():
    """Get all departments."""
    departments = Department.query.all()
    return jsonify({
        'success': True,
        'departments': [department.to_dict() for department in departments]
    }), 200

@department_bp.route('/<int:department_id>', methods=['GET'])
def get_department(department_id):
    """Get a single department by ID."""
    department = Department.query.get_or_404(department_id)
    
    # Get employees in this department
    employees = Employee.query.filter_by(DEPARTMENT_ID=department_id).all()
    
    result = department.to_dict()
    result['employees'] = [employee.to_dict() for employee in employees]
    
    return jsonify({
        'success': True,
        'department': result
    }), 200

@department_bp.route('/', methods=['POST'])
def create_department():
    """Create a new department."""
    data = request.get_json()
    
    # Map request fields to Oracle column names
    oracle_data = {}
    field_mapping = {
        'department_name': 'DEPARTMENT_NAME',
        'manager_id': 'MANAGER_ID',
        'location_id': 'LOCATION_ID'
    }
    
    for key, value in data.items():
        if key in field_mapping:
            oracle_data[field_mapping[key]] = value
    
    try:
        new_department = Department(**oracle_data)
        db.session.add(new_department)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Department created successfully',
            'department': new_department.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@department_bp.route('/<int:department_id>', methods=['PUT'])
def update_department(department_id):
    """Update an existing department."""
    department = Department.query.get_or_404(department_id)
    data = request.get_json()
    
    # Map request fields to Oracle column names
    field_mapping = {
        'department_name': 'DEPARTMENT_NAME',
        'manager_id': 'MANAGER_ID',
        'location_id': 'LOCATION_ID'
    }
    
    try:
        for key, value in data.items():
            if key in field_mapping:
                setattr(department, field_mapping[key], value)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Department updated successfully',
            'department': department.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@department_bp.route('/<int:department_id>', methods=['DELETE'])
def delete_department(department_id):
    """Delete a department."""
    department = Department.query.get_or_404(department_id)
    
    # Check if there are employees in this department
    employees = Employee.query.filter_by(DEPARTMENT_ID=department_id).first()
    if employees:
        return jsonify({
            'success': False,
            'message': 'Cannot delete department that has employees. Reassign or remove employees first.'
        }), 400
    
    try:
        db.session.delete(department)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Department deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to delete department: {str(e)}'
        }), 500 