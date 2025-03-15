from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, validate, ValidationError
from ..models import Department, Employee, Location
from .. import db

department_bp = Blueprint('department', __name__)

# Schema for request validation
class DepartmentSchema(Schema):
    department_name = fields.String(required=True, validate=validate.Length(min=1, max=30))
    manager_id = fields.Integer()
    location_id = fields.Integer()

department_schema = DepartmentSchema()

@department_bp.route('/', methods=['GET'])
@jwt_required()
def get_departments():
    """Get all departments."""
    departments = Department.query.all()
    return jsonify({
        'success': True,
        'departments': [department.to_dict() for department in departments]
    }), 200

@department_bp.route('/<int:department_id>', methods=['GET'])
@jwt_required()
def get_department(department_id):
    """Get a single department by ID."""
    department = Department.query.filter_by(department_id=department_id).first_or_404()
    
    # Get employees in this department
    employees = Employee.query.filter_by(department_id=department_id).all()
    
    result = department.to_dict()
    result['employees'] = [employee.to_dict() for employee in employees]
    
    return jsonify({
        'success': True,
        'department': result
    }), 200

@department_bp.route('/', methods=['POST'])
@jwt_required()
def create_department():
    """Create a new department."""
    data = request.get_json()
    
    # Validate input
    try:
        validated_data = department_schema.load(data)
    except ValidationError as err:
        return jsonify({
            'success': False,
            'message': 'Validation error',
            'errors': err.messages
        }), 400
    
    # Check if manager exists
    if 'manager_id' in validated_data and validated_data['manager_id']:
        manager = Employee.query.filter_by(employee_id=validated_data['manager_id']).first()
        if not manager:
            return jsonify({
                'success': False,
                'message': f"Employee with ID {validated_data['manager_id']} not found"
            }), 404
    
    # Check if location exists
    if 'location_id' in validated_data and validated_data['location_id']:
        location = Location.query.filter_by(location_id=validated_data['location_id']).first()
        if not location:
            return jsonify({
                'success': False,
                'message': f"Location with ID {validated_data['location_id']} not found"
            }), 404
    
    # Create the department
    new_department = Department(**validated_data)
    db.session.add(new_department)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Department created successfully',
        'department': new_department.to_dict()
    }), 201

@department_bp.route('/<int:department_id>', methods=['PUT'])
@jwt_required()
def update_department(department_id):
    """Update an existing department."""
    department = Department.query.filter_by(department_id=department_id).first_or_404()
    data = request.get_json()
    
    # Validate input
    try:
        validated_data = department_schema.load(data, partial=True)
    except ValidationError as err:
        return jsonify({
            'success': False,
            'message': 'Validation error',
            'errors': err.messages
        }), 400
    
    # Check if manager exists
    if 'manager_id' in validated_data and validated_data['manager_id']:
        manager = Employee.query.filter_by(employee_id=validated_data['manager_id']).first()
        if not manager:
            return jsonify({
                'success': False,
                'message': f"Employee with ID {validated_data['manager_id']} not found"
            }), 404
    
    # Check if location exists
    if 'location_id' in validated_data and validated_data['location_id']:
        location = Location.query.filter_by(location_id=validated_data['location_id']).first()
        if not location:
            return jsonify({
                'success': False,
                'message': f"Location with ID {validated_data['location_id']} not found"
            }), 404
    
    # Update the department
    for key, value in validated_data.items():
        setattr(department, key, value)
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Department updated successfully',
        'department': department.to_dict()
    }), 200

@department_bp.route('/<int:department_id>', methods=['DELETE'])
@jwt_required()
def delete_department(department_id):
    """Delete a department."""
    department = Department.query.filter_by(department_id=department_id).first_or_404()
    
    # Check if there are employees in this department
    employees = Employee.query.filter_by(department_id=department_id).first()
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
            'message': 'Failed to delete department',
            'error': str(e)
        }), 500 