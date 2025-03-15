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