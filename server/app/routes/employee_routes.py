from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from marshmallow import Schema, fields, validate, ValidationError
from ..models import Employee, Department, Job
from .. import db
from datetime import datetime

employee_bp = Blueprint('employee', __name__)

# Schema for request validation
class EmployeeSchema(Schema):
    first_name = fields.String(required=True, validate=validate.Length(min=1, max=50))
    last_name = fields.String(required=True, validate=validate.Length(min=1, max=50))
    email = fields.Email(required=True)
    phone = fields.String(validate=validate.Length(max=20))
    hire_date = fields.Date()
    salary = fields.Float(validate=validate.Range(min=0))
    department_id = fields.Integer()
    job_id = fields.Integer()

employee_schema = EmployeeSchema()

@employee_bp.route('/', methods=['GET'])
@jwt_required()
def get_employees():
    """Get all employees."""
    employees = Employee.query.all()
    return jsonify({
        'success': True,
        'employees': [employee.to_dict() for employee in employees]
    }), 200

@employee_bp.route('/<int:employee_id>', methods=['GET'])
@jwt_required()
def get_employee(employee_id):
    """Get a single employee by ID."""
    employee = Employee.query.get_or_404(employee_id)
    return jsonify({
        'success': True,
        'employee': employee.to_dict()
    }), 200

@employee_bp.route('/', methods=['POST'])
@jwt_required()
def create_employee():
    """Create a new employee."""
    data = request.get_json()
    
    # Validate input
    try:
        validated_data = employee_schema.load(data)
    except ValidationError as err:
        return jsonify({
            'success': False,
            'message': 'Validation error',
            'errors': err.messages
        }), 400
    
    # Check if email already exists
    if Employee.query.filter_by(email=validated_data['email']).first():
        return jsonify({
            'success': False,
            'message': f"Employee with email {validated_data['email']} already exists"
        }), 400
    
    # Check if department exists
    if 'department_id' in validated_data and validated_data['department_id']:
        department = Department.query.get(validated_data['department_id'])
        if not department:
            return jsonify({
                'success': False,
                'message': f"Department with ID {validated_data['department_id']} not found"
            }), 404
    
    # Check if job exists
    if 'job_id' in validated_data and validated_data['job_id']:
        job = Job.query.get(validated_data['job_id'])
        if not job:
            return jsonify({
                'success': False,
                'message': f"Job with ID {validated_data['job_id']} not found"
            }), 404
    
    # Set default hire_date if not provided
    if 'hire_date' not in validated_data or not validated_data['hire_date']:
        validated_data['hire_date'] = datetime.utcnow().date()
    
    # Create the employee
    new_employee = Employee(**validated_data)
    db.session.add(new_employee)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Employee created successfully',
        'employee': new_employee.to_dict()
    }), 201

@employee_bp.route('/<int:employee_id>', methods=['PUT'])
@jwt_required()
def update_employee(employee_id):
    """Update an existing employee."""
    employee = Employee.query.get_or_404(employee_id)
    data = request.get_json()
    
    # Validate input
    try:
        validated_data = employee_schema.load(data, partial=True)
    except ValidationError as err:
        return jsonify({
            'success': False,
            'message': 'Validation error',
            'errors': err.messages
        }), 400
    
    # Check if email already exists
    if 'email' in validated_data and validated_data['email'] != employee.email:
        if Employee.query.filter_by(email=validated_data['email']).first():
            return jsonify({
                'success': False,
                'message': f"Employee with email {validated_data['email']} already exists"
            }), 400
    
    # Check if department exists
    if 'department_id' in validated_data and validated_data['department_id']:
        department = Department.query.get(validated_data['department_id'])
        if not department:
            return jsonify({
                'success': False,
                'message': f"Department with ID {validated_data['department_id']} not found"
            }), 404
    
    # Check if job exists
    if 'job_id' in validated_data and validated_data['job_id']:
        job = Job.query.get(validated_data['job_id'])
        if not job:
            return jsonify({
                'success': False,
                'message': f"Job with ID {validated_data['job_id']} not found"
            }), 404
    
    # Update the employee
    for key, value in validated_data.items():
        setattr(employee, key, value)
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Employee updated successfully',
        'employee': employee.to_dict()
    }), 200

@employee_bp.route('/<int:employee_id>', methods=['DELETE'])
@jwt_required()
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
            'message': 'Failed to delete employee',
            'error': str(e)
        }), 500 