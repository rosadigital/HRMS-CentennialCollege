#!/usr/bin/env python
from flask import Flask, jsonify
import oracledb

# Database Configuration - exactly as in the working example
ORACLE_USER = "COMP214_W25_ers_22"
ORACLE_PASSWORD = "password"
ORACLE_HOST = "199.212.26.208"
ORACLE_PORT = "1521"
ORACLE_SID = "SQLD"

# Database Connection Function - exactly as in the working example
def get_connection():
    dsn = f"{ORACLE_HOST}:{ORACLE_PORT}/{ORACLE_SID}"
    print(f"DSN format: {dsn}")
    connection = oracledb.connect(user=ORACLE_USER, password=ORACLE_PASSWORD, dsn=dsn)
    return connection

def test_departments():
    print("Testing departments query...")
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT DEPARTMENT_ID, DEPARTMENT_NAME, MANAGER_ID, LOCATION_ID FROM HR_DEPARTMENTS")
        departments = [
            {"DEPARTMENT_ID": row[0], "DEPARTMENT_NAME": row[1], "MANAGER_ID": row[2], "LOCATION_ID": row[3]}
            for row in cursor.fetchall()
        ]
        cursor.close()
        connection.close()
        
        print(f"Found {len(departments)} departments")
        if departments:
            print(f"First department: {departments[0]}")
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

def test_employees():
    print("\nTesting employees query...")
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT EMPLOYEE_ID, FIRST_NAME, LAST_NAME, EMAIL, JOB_ID, DEPARTMENT_ID FROM HR_EMPLOYEES")
        employees = [
            {"EMPLOYEE_ID": row[0], "FIRST_NAME": row[1], "LAST_NAME": row[2], "EMAIL": row[3], "JOB_ID": row[4], "DEPARTMENT_ID": row[5]}
            for row in cursor.fetchall()
        ]
        cursor.close()
        connection.close()
        
        print(f"Found {len(employees)} employees")
        if employees:
            print(f"First employee: {employees[0]}")
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

def test_jobs():
    print("\nTesting jobs query...")
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT JOB_ID, JOB_TITLE, MIN_SALARY, MAX_SALARY FROM HR_JOBS")
        jobs = [
            {"JOB_ID": row[0], "JOB_TITLE": row[1], "MIN_SALARY": row[2], "MAX_SALARY": row[3]}
            for row in cursor.fetchall()
        ]
        cursor.close()
        connection.close()
        
        print(f"Found {len(jobs)} jobs")
        if jobs:
            print(f"First job: {jobs[0]}")
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == '__main__':
    print("=== Testing Exact Connection Method from Working Example ===")
    
    print("Connection details:")
    print(f"User: {ORACLE_USER}")
    print(f"Host: {ORACLE_HOST}")
    print(f"Port: {ORACLE_PORT}")
    print(f"SID: {ORACLE_SID}")
    
    dept_success = test_departments()
    emp_success = test_employees()
    job_success = test_jobs()
    
    print("\n=== Results ===")
    print(f"Departments query: {'SUCCESS' if dept_success else 'FAILED'}")
    print(f"Employees query: {'SUCCESS' if emp_success else 'FAILED'}")
    print(f"Jobs query: {'SUCCESS' if job_success else 'FAILED'}")
    
    if dept_success and emp_success and job_success:
        print("\nAll queries successful using the exact connection method from the working example!")
    else:
        print("\nSome queries failed. Check error messages above.") 