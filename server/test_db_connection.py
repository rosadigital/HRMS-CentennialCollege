#!/usr/bin/env python
import os
import oracledb
from flask import Flask
from app import create_app, db
from app.models import Department

# In oracledb 3.0+, thin mode is the default so we don't need to set it explicitly
# oracledb.init_mode = oracledb.THIN_MODE  # Not needed in 3.0+

def test_direct_connection():
    """Test direct connection to Oracle using oracledb with the simpler approach."""
    try:
        # Get credentials from config
        from app.config import ORACLE_USER, ORACLE_PASSWORD, ORACLE_HOST, ORACLE_PORT, ORACLE_SID, ORACLE_DSN
        
        print(f"Attempting direct connection to Oracle database...")
        print(f"User: {ORACLE_USER}")
        print(f"Host: {ORACLE_HOST}")
        print(f"Port: {ORACLE_PORT}")
        print(f"SID: {ORACLE_SID}")
        print(f"Using DSN: {ORACLE_DSN}")
        
        # Use the simpler connection method that works in the example
        connection = oracledb.connect(user=ORACLE_USER, password=ORACLE_PASSWORD, dsn=ORACLE_DSN)
        
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

def test_direct_query():
    """Test direct query execution (like in the working example)."""
    try:
        from app.config import ORACLE_USER, ORACLE_PASSWORD, ORACLE_DSN
        
        print("\nTesting direct query execution (like in the working example)...")
        
        connection = oracledb.connect(user=ORACLE_USER, password=ORACLE_PASSWORD, dsn=ORACLE_DSN)
        cursor = connection.cursor()
        
        # Query departments like in the working example
        cursor.execute("SELECT DEPARTMENT_ID, DEPARTMENT_NAME, MANAGER_ID, LOCATION_ID FROM HR_DEPARTMENTS")
        departments = [
            {"DEPARTMENT_ID": row[0], "DEPARTMENT_NAME": row[1], "MANAGER_ID": row[2], "LOCATION_ID": row[3]}
            for row in cursor.fetchall()
        ]
        
        print(f"Retrieved {len(departments)} departments directly")
        if departments:
            print(f"First department: {departments[0]}")
            
        cursor.close()
        connection.close()
        return True
    except Exception as e:
        print(f"Direct query failed: {str(e)}")
        return False

if __name__ == '__main__':
    print("=== Database Connection Test ===")
    direct_success = test_direct_connection()
    sqlalchemy_success = test_sqlalchemy_connection()
    direct_query_success = test_direct_query()
    
    print("\n=== Results ===")
    print(f"Direct connection: {'SUCCESS' if direct_success else 'FAILED'}")
    print(f"SQLAlchemy connection: {'SUCCESS' if sqlalchemy_success else 'FAILED'}")
    print(f"Direct query execution: {'SUCCESS' if direct_query_success else 'FAILED'}")
    
    if not direct_success and not sqlalchemy_success and not direct_query_success:
        print("\nAll connection methods failed. Check database credentials and network connectivity.")
    elif direct_success or direct_query_success:
        if not sqlalchemy_success:
            print("\nDirect connection works but SQLAlchemy failed. This suggests an issue with your Flask/SQLAlchemy configuration.")
        else:
            print("\nAll connection methods are working properly.")
    else:
        print("\nUnexpected results. Check the error messages for more information.") 