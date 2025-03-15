"""
Direct routes that bypass SQLAlchemy and use direct oracledb connections.
These routes are based on the working example and serve as a fallback
if the SQLAlchemy routes fail.
"""
from flask import Blueprint, jsonify, request
from ..utils.db_utils import (
    get_connection, 
    execute_query, 
    get_departments,
    get_department_options,
    get_employees,
    get_employee,
    get_jobs,
    get_job_options,
    get_location_options,
    create_employee,
    update_employee,
    delete_employee
)

direct_bp = Blueprint('direct', __name__)

# DEPARTMENT ROUTES
@direct_bp.route('/departments', methods=['GET'])
def departments():
    """Get all departments using direct database connection."""
    try:
        departments = get_departments()
        return jsonify({
            'success': True,
            'departments': departments
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500

@direct_bp.route('/departments/<int:department_id>', methods=['GET'])
def department(department_id):
    """Get a single department by ID using direct database connection."""
    try:
        query = """
        SELECT d.DEPARTMENT_ID, d.DEPARTMENT_NAME, d.MANAGER_ID, d.LOCATION_ID,
               l.CITY, l.STATE_PROVINCE
        FROM HR_DEPARTMENTS d
        LEFT JOIN HR_LOCATIONS l ON d.LOCATION_ID = l.LOCATION_ID
        WHERE d.DEPARTMENT_ID = :dept_id
        """
        rows = execute_query(query, {'dept_id': department_id})
        
        if not rows:
            return jsonify({
                'success': False,
                'message': f'Department with ID {department_id} not found',
                'error': 404
            }), 404
        
        row = rows[0]
        department = {
            'department_id': row[0],
            'department_name': row[1],
            'manager_id': row[2],
            'location_id': row[3],
            'location_city': row[4],
            'location_state': row[5]
        }
        
        # Get employees in this department
        emp_query = """
        SELECT EMPLOYEE_ID, FIRST_NAME, LAST_NAME, EMAIL, JOB_ID
        FROM HR_EMPLOYEES
        WHERE DEPARTMENT_ID = :dept_id
        """
        emp_rows = execute_query(emp_query, {'dept_id': department_id})
        
        employees = [
            {
                'employee_id': row[0],
                'first_name': row[1],
                'last_name': row[2],
                'email': row[3],
                'job_id': row[4]
            }
            for row in emp_rows
        ]
        
        department['employees'] = employees
        
        return jsonify({
            'success': True,
            'department': department
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500

@direct_bp.route('/department-options', methods=['GET'])
def department_options():
    """Get departments for dropdown options."""
    try:
        options = get_department_options()
        return jsonify({
            'success': True,
            'department_options': options
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500

# JOB ROUTES
@direct_bp.route('/jobs', methods=['GET'])
def jobs():
    """Get all jobs using direct database connection."""
    try:
        jobs = get_jobs()
        return jsonify({
            'success': True,
            'jobs': jobs
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500

@direct_bp.route('/jobs/<string:job_id>', methods=['GET'])
def job(job_id):
    """Get a single job by ID using direct database connection."""
    try:
        query = """
        SELECT JOB_ID, JOB_TITLE, MIN_SALARY, MAX_SALARY
        FROM HR_JOBS
        WHERE JOB_ID = :job_id
        """
        rows = execute_query(query, {'job_id': job_id})
        
        if not rows:
            return jsonify({
                'success': False,
                'message': f'Job with ID {job_id} not found',
                'error': 404
            }), 404
        
        row = rows[0]
        job = {
            'job_id': row[0],
            'job_title': row[1],
            'min_salary': row[2],
            'max_salary': row[3]
        }
        
        return jsonify({
            'success': True,
            'job': job
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500

@direct_bp.route('/job-options', methods=['GET'])
def job_options():
    """Get jobs for dropdown options."""
    try:
        options = get_job_options()
        return jsonify({
            'success': True,
            'job_options': options
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500

@direct_bp.route('/location-options', methods=['GET'])
def location_options():
    """Get locations for dropdown options."""
    try:
        options = get_location_options()
        return jsonify({
            'success': True,
            'location_options': options
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500

# EMPLOYEE ROUTES
@direct_bp.route('/employees', methods=['GET'])
def employees():
    """Get all employees using direct database connection."""
    try:
        employees = get_employees()
        return jsonify({
            'success': True,
            'employees': employees
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500

@direct_bp.route('/employees/<int:employee_id>', methods=['GET'])
def employee(employee_id):
    """Get a single employee by ID using direct database connection."""
    try:
        employee = get_employee(employee_id)
        if not employee:
            return jsonify({
                'success': False,
                'message': f'Employee with ID {employee_id} not found',
                'error': 404
            }), 404
        
        return jsonify({
            'success': True,
            'employee': employee
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500

@direct_bp.route('/employees', methods=['POST'])
def create_employee_route():
    """Create a new employee."""
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
        
        # Check if email already exists
        check_query = "SELECT COUNT(*) FROM HR_EMPLOYEES WHERE EMAIL = :email"
        count = execute_query(check_query, {'email': data['email']})[0][0]
        if count > 0:
            return jsonify({
                'success': False,
                'message': f"Email '{data['email']}' is already in use",
                'error': 400
            }), 400
            
        employee = create_employee(data)
        return jsonify({
            'success': True,
            'message': 'Employee created successfully',
            'employee': employee
        }), 201
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 500
        }), 500

@direct_bp.route('/employees/<int:employee_id>', methods=['PUT'])
def update_employee_route(employee_id):
    """Update an existing employee."""
    try:
        data = request.get_json()
        
        # Check if employee exists
        employee = get_employee(employee_id)
        if not employee:
            return jsonify({
                'success': False,
                'message': f'Employee with ID {employee_id} not found',
                'error': 404
            }), 404
        
        # Check email uniqueness if it's being updated
        if 'email' in data and data['email'] != employee['email']:
            check_query = "SELECT COUNT(*) FROM HR_EMPLOYEES WHERE EMAIL = :email AND EMPLOYEE_ID != :employee_id"
            count = execute_query(check_query, {'email': data['email'], 'employee_id': employee_id})[0][0]
            if count > 0:
                return jsonify({
                    'success': False,
                    'message': f"Email '{data['email']}' is already in use",
                    'error': 400
                }), 400
        
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

@direct_bp.route('/employees/<int:employee_id>', methods=['DELETE'])
def delete_employee_route(employee_id):
    """Delete an employee."""
    try:
        # Check if employee exists
        employee = get_employee(employee_id)
        if not employee:
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