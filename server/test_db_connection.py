#!/usr/bin/env python
import os
import cx_Oracle
from flask import Flask
from app import create_app, db
from app.models import Department

def test_direct_connection():
    """Test direct connection to Oracle using cx_Oracle."""
    try:
        # Get credentials from config
        from app.config import ORACLE_USER, ORACLE_PASSWORD, ORACLE_HOST, ORACLE_PORT, ORACLE_SID
        
        print(f"Attempting direct connection to Oracle database...")
        print(f"User: {ORACLE_USER}")
        print(f"Host: {ORACLE_HOST}")
        print(f"Port: {ORACLE_PORT}")
        print(f"SID: {ORACLE_SID}")
        
        dsn = cx_Oracle.makedsn(ORACLE_HOST, ORACLE_PORT, sid=ORACLE_SID)
        connection = cx_Oracle.connect(ORACLE_USER, ORACLE_PASSWORD, dsn)
        
        print("Direct connection successful!")
        
        # Try a simple query
        cursor = connection.cursor()
        cursor.execute("SELECT COUNT(*) FROM HR_DEPARTMENTS")
        count = cursor.fetchone()[0]
        print(f"Found {count} departments in the database.")
        
        cursor.close()
        connection.close()
        return True
    except Exception as e:
        print(f"Direct connection failed: {str(e)}")
        return False

def test_sqlalchemy_connection():
    """Test connection through SQLAlchemy."""
    try:
        print(f"\nAttempting SQLAlchemy connection...")
        app = create_app('development')
        with app.app_context():
            # Try to get departments
            departments = Department.query.all()
            print(f"Found {len(departments)} departments via SQLAlchemy.")
            
            # Print first department if available
            if departments:
                dept = departments[0]
                print(f"First department: {dept.DEPARTMENT_NAME} (ID: {dept.DEPARTMENT_ID})")
        return True
    except Exception as e:
        print(f"SQLAlchemy connection failed: {str(e)}")
        return False

if __name__ == '__main__':
    print("=== Database Connection Test ===")
    direct_success = test_direct_connection()
    sqlalchemy_success = test_sqlalchemy_connection()
    
    print("\n=== Results ===")
    print(f"Direct connection: {'SUCCESS' if direct_success else 'FAILED'}")
    print(f"SQLAlchemy connection: {'SUCCESS' if sqlalchemy_success else 'FAILED'}")
    
    if not direct_success and not sqlalchemy_success:
        print("\nBoth connection methods failed. Check database credentials and network connectivity.")
    elif direct_success and not sqlalchemy_success:
        print("\nDirect connection works but SQLAlchemy failed. This suggests an issue with your Flask/SQLAlchemy configuration.")
    elif not direct_success and sqlalchemy_success:
        print("\nUnusual result: SQLAlchemy works but direct connection failed.")
    else:
        print("\nBoth connections successful. Your database connection is working properly.") 