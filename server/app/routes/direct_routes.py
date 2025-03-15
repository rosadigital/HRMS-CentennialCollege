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
    get_employees, 
    get_jobs
)

direct_bp = Blueprint('direct', __name__)

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
        query = """
        SELECT e.EMPLOYEE_ID, e.FIRST_NAME, e.LAST_NAME, e.EMAIL, 
               e.PHONE_NUMBER, e.HIRE_DATE, e.JOB_ID, e.SALARY, 
               e.COMMISSION_PCT, e.MANAGER_ID, e.DEPARTMENT_ID,
               d.DEPARTMENT_NAME, j.JOB_TITLE
        FROM HR_EMPLOYEES e
        LEFT JOIN HR_DEPARTMENTS d ON e.DEPARTMENT_ID = d.DEPARTMENT_ID
        LEFT JOIN HR_JOBS j ON e.JOB_ID = j.JOB_ID
        WHERE e.EMPLOYEE_ID = :emp_id
        """
        rows = execute_query(query, {'emp_id': employee_id})
        
        if not rows:
            return jsonify({
                'success': False,
                'message': f'Employee with ID {employee_id} not found',
                'error': 404
            }), 404
        
        row = rows[0]
        employee = {
            'employee_id': row[0],
            'first_name': row[1],
            'last_name': row[2],
            'email': row[3],
            'phone_number': row[4],
            'hire_date': row[5].isoformat() if row[5] else None,
            'job_id': row[6],
            'salary': row[7],
            'commission_pct': row[8],
            'manager_id': row[9],
            'department_id': row[10],
            'department_name': row[11],
            'job_title': row[12]
        }
        
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