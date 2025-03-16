"""
Database utility functions for direct database connections
"""
import oracledb
from ..config import ORACLE_USER, ORACLE_PASSWORD, ORACLE_DSN

def get_connection():
    """
    Get a direct connection to the Oracle database using the approach
    that's working in the example code.
    
    Returns:
        connection: An oracledb connection object
    """
    connection = oracledb.connect(user=ORACLE_USER, password=ORACLE_PASSWORD, dsn=ORACLE_DSN)
    return connection

def execute_query(query, params=None, fetchall=True):
    """
    Execute a SQL query directly using oracledb.
    
    Args:
        query: The SQL query to execute
        params: Query parameters (optional)
        fetchall: Whether to fetch all results (default: True)
        
    Returns:
        results: Query results
    """
    connection = get_connection()
    cursor = connection.cursor()
    
    try:
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        
        if fetchall:
            results = cursor.fetchall()
        else:
            # For INSERT, UPDATE, DELETE
            connection.commit()
            results = cursor.rowcount
    except Exception as e:
        connection.rollback()
        raise e
    finally:
        cursor.close()
        connection.close()
    
    return results

def get_departments():
    """Get all departments using direct connection."""
    query = "SELECT DEPARTMENT_ID, DEPARTMENT_NAME, MANAGER_ID, LOCATION_ID FROM HR_DEPARTMENTS"
    rows = execute_query(query)
    
    return [
        {
            "department_id": row[0],
            "department_name": row[1],
            "manager_id": row[2],
            "location_id": row[3]
        }
        for row in rows
    ]

def get_department_options():
    """Get departments for dropdown options."""
    query = "SELECT DEPARTMENT_ID, DEPARTMENT_NAME FROM HR_DEPARTMENTS ORDER BY DEPARTMENT_NAME"
    rows = execute_query(query)
    
    return [
        {
            "value": row[0],
            "label": row[1]
        }
        for row in rows
    ]

def get_jobs():
    """Get all jobs using direct connection."""
    query = "SELECT JOB_ID, JOB_TITLE, MIN_SALARY, MAX_SALARY FROM HR_JOBS"
    rows = execute_query(query)
    
    return [
        {
            "job_id": row[0],
            "job_title": row[1],
            "min_salary": row[2],
            "max_salary": row[3]
        }
        for row in rows
    ]

def get_job_options():
    """Get jobs for dropdown options."""
    query = "SELECT JOB_ID, JOB_TITLE FROM HR_JOBS ORDER BY JOB_TITLE"
    rows = execute_query(query)
    
    return [
        {
            "value": row[0],
            "label": row[1]
        }
        for row in rows
    ]

def get_location_options():
    """Get locations for dropdown options."""
    query = """
    SELECT l.LOCATION_ID, l.CITY || ', ' || l.STATE_PROVINCE || ' (' || c.COUNTRY_NAME || ')' AS LOCATION_DISPLAY
    FROM HR_LOCATIONS l
    LEFT JOIN HR_COUNTRIES c ON l.COUNTRY_ID = c.COUNTRY_ID
    ORDER BY l.CITY
    """
    rows = execute_query(query)
    
    return [
        {
            "value": row[0],
            "label": row[1]
        }
        for row in rows
    ]

def get_employees():
    """Get all employees using direct connection."""
    query = """
    SELECT e.EMPLOYEE_ID, e.FIRST_NAME, e.LAST_NAME, e.EMAIL, 
           e.PHONE_NUMBER, e.HIRE_DATE, e.JOB_ID, e.SALARY, 
           e.COMMISSION_PCT, e.MANAGER_ID, e.DEPARTMENT_ID,
           d.DEPARTMENT_NAME, j.JOB_TITLE
    FROM HR_EMPLOYEES e
    LEFT JOIN HR_DEPARTMENTS d ON e.DEPARTMENT_ID = d.DEPARTMENT_ID
    LEFT JOIN HR_JOBS j ON e.JOB_ID = j.JOB_ID
    """
    rows = execute_query(query)
    
    return [
        {
            "employee_id": row[0],
            "first_name": row[1],
            "last_name": row[2],
            "email": row[3],
            "phone_number": row[4],
            "hire_date": row[5].isoformat() if row[5] else None,
            "job_id": row[6],
            "salary": row[7],
            "commission_pct": row[8],
            "manager_id": row[9],
            "department_id": row[10],
            "department_name": row[11],
            "job_title": row[12]
        }
        for row in rows
    ]

def get_employee(employee_id):
    """Get a single employee by ID."""
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
        return None
    
    row = rows[0]
    return {
        "employee_id": row[0],
        "first_name": row[1],
        "last_name": row[2],
        "email": row[3],
        "phone_number": row[4],
        "hire_date": row[5].isoformat() if row[5] else None,
        "job_id": row[6],
        "salary": row[7],
        "commission_pct": row[8],
        "manager_id": row[9],
        "department_id": row[10],
        "department_name": row[11],
        "job_title": row[12]
    }

def create_employee(data):
    """Create a new employee."""
    query = """
    BEGIN
    INSERT INTO HR_EMPLOYEES (
        EMPLOYEE_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE_NUMBER,
        HIRE_DATE, JOB_ID, SALARY, COMMISSION_PCT, MANAGER_ID, DEPARTMENT_ID
    ) VALUES (
        HR_EMPLOYEES_SEQ.NEXTVAL, :first_name, :last_name, :email, :phone_number,
        TO_DATE(:hire_date, 'YYYY-MM-DD'), :job_id, :salary, :commission_pct, :manager_id, :department_id
    ) RETURNING EMPLOYEE_ID INTO :employee_id;
    END;
    """

    connection = get_connection()
    cursor = connection.cursor()
    # Default values for nullable fields
    params = {
        'first_name': data.get('first_name'),
        'last_name': data.get('last_name'),
        'email': data.get('email'),
        'phone_number': data.get('phone_number') or None,
        'job_id': data.get('job_id'),
        'salary': data.get('salary') or 0,
        'hire_date': data.get('hire_date') or None,
        'commission_pct': data.get('commission_pct') or None,
        'manager_id': data.get('manager_id') or None,
        'department_id': data.get('department_id') or None,
        'employee_id': cursor.var(oracledb.NUMBER)  # Output parameter
    }

    try:
        cursor.execute(query, params)
        employee_id = params['employee_id'].getvalue()
        connection.commit()

        # Get the newly created employee
        employee = get_employee(employee_id)
        return employee
    except Exception as e:
        connection.rollback()
        raise e
    finally:
        cursor.close()
        connection.close()

def update_employee(employee_id, data):
    """Update an existing employee."""
    # Build dynamic query based on provided fields
    set_clauses = []
    params = {'employee_id': employee_id}
    
    # Map fields to Oracle column names and build SET clauses
    field_mapping = {
        'first_name': 'FIRST_NAME',
        'last_name': 'LAST_NAME',
        'email': 'EMAIL',
        'phone_number': 'PHONE_NUMBER',
        'job_id': 'JOB_ID',
        'salary': 'SALARY',
        'commission_pct': 'COMMISSION_PCT',
        'manager_id': 'MANAGER_ID',
        'department_id': 'DEPARTMENT_ID'
    }
    
    for field, column in field_mapping.items():
        if field in data:
            set_clauses.append(f"{column} = :{field}")
            params[field] = data.get(field)
    
    if not set_clauses:
        raise ValueError("No fields provided for update")
    
    query = f"""
    UPDATE HR_EMPLOYEES
    SET {', '.join(set_clauses)}
    WHERE EMPLOYEE_ID = :employee_id
    """
    
    result = execute_query(query, params, fetchall=False)
    
    # Get the updated employee
    employee = get_employee(employee_id)
    return employee

def delete_employee(employee_id):
    """Delete an employee."""
    query = "DELETE FROM HR_EMPLOYEES WHERE EMPLOYEE_ID = :employee_id"
    result = execute_query(query, {'employee_id': employee_id}, fetchall=False)
    return result > 0  # Return True if a row was deleted

def get_department(department_id):
    """Get a single department by ID."""
    query = """
    SELECT d.DEPARTMENT_ID, d.DEPARTMENT_NAME, d.MANAGER_ID, d.LOCATION_ID,
           l.CITY, l.STATE_PROVINCE, c.COUNTRY_NAME
    FROM HR_DEPARTMENTS d
    LEFT JOIN HR_LOCATIONS l ON d.LOCATION_ID = l.LOCATION_ID
    LEFT JOIN HR_COUNTRIES c ON l.COUNTRY_ID = c.COUNTRY_ID
    WHERE d.DEPARTMENT_ID = :dept_id
    """
    rows = execute_query(query, {'dept_id': department_id})
    
    if not rows:
        return None
    
    row = rows[0]
    
    # Get employees in this department
    emp_query = """
    SELECT EMPLOYEE_ID, FIRST_NAME, LAST_NAME, JOB_ID
    FROM HR_EMPLOYEES
    WHERE DEPARTMENT_ID = :dept_id
    """
    emp_rows = execute_query(emp_query, {'dept_id': department_id})
    
    employees = [
        {
            "employee_id": emp[0],
            "first_name": emp[1],
            "last_name": emp[2],
            "job_id": emp[3]
        }
        for emp in emp_rows
    ]
    
    return {
        "department_id": row[0],
        "department_name": row[1],
        "manager_id": row[2],
        "location_id": row[3],
        "city": row[4],
        "state_province": row[5],
        "country_name": row[6],
        "employees": employees
    }

def get_job(job_id):
    """Get a single job by ID."""
    query = """
    SELECT JOB_ID, JOB_TITLE, MIN_SALARY, MAX_SALARY
    FROM HR_JOBS
    WHERE JOB_ID = :job_id
    """
    rows = execute_query(query, {'job_id': job_id})
    
    if not rows:
        return None
    
    row = rows[0]
    
    # Get employees with this job
    emp_query = """
    SELECT EMPLOYEE_ID, FIRST_NAME, LAST_NAME, DEPARTMENT_ID
    FROM HR_EMPLOYEES
    WHERE JOB_ID = :job_id
    """
    emp_rows = execute_query(emp_query, {'job_id': job_id})
    
    employees = [
        {
            "employee_id": emp[0],
            "first_name": emp[1],
            "last_name": emp[2],
            "department_id": emp[3]
        }
        for emp in emp_rows
    ]
    
    return {
        "job_id": row[0],
        "job_title": row[1],
        "min_salary": row[2],
        "max_salary": row[3],
        "employees": employees
    }

def get_locations():
    """Get all locations using direct connection."""
    query = """
    SELECT l.LOCATION_ID, l.STREET_ADDRESS, l.POSTAL_CODE, l.CITY, 
           l.STATE_PROVINCE, l.COUNTRY_ID, c.COUNTRY_NAME
    FROM HR_LOCATIONS l
    LEFT JOIN HR_COUNTRIES c ON l.COUNTRY_ID = c.COUNTRY_ID
    """
    rows = execute_query(query)
    
    return [
        {
            "location_id": row[0],
            "street_address": row[1],
            "postal_code": row[2],
            "city": row[3],
            "state_province": row[4],
            "country_id": row[5],
            "country_name": row[6]
        }
        for row in rows
    ]

def get_location(location_id):
    """Get a single location by ID."""
    query = """
    SELECT l.LOCATION_ID, l.STREET_ADDRESS, l.POSTAL_CODE, l.CITY, 
           l.STATE_PROVINCE, l.COUNTRY_ID, c.COUNTRY_NAME
    FROM HR_LOCATIONS l
    LEFT JOIN HR_COUNTRIES c ON l.COUNTRY_ID = c.COUNTRY_ID
    WHERE l.LOCATION_ID = :loc_id
    """
    rows = execute_query(query, {'loc_id': location_id})
    
    if not rows:
        return None
    
    row = rows[0]
    
    # Get departments at this location
    dept_query = """
    SELECT DEPARTMENT_ID, DEPARTMENT_NAME, MANAGER_ID
    FROM HR_DEPARTMENTS
    WHERE LOCATION_ID = :loc_id
    """
    dept_rows = execute_query(dept_query, {'loc_id': location_id})
    
    departments = [
        {
            "department_id": dept[0],
            "department_name": dept[1],
            "manager_id": dept[2]
        }
        for dept in dept_rows
    ]
    
    return {
        "location_id": row[0],
        "street_address": row[1],
        "postal_code": row[2],
        "city": row[3],
        "state_province": row[4],
        "country_id": row[5],
        "country_name": row[6],
        "departments": departments
    } 