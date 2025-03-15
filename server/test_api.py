import requests
import json
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_URL = 'http://localhost:5000/api'

def test_auth():
    """Test authentication endpoints."""
    print("\n--- Testing Authentication ---")
    
    # Register a new user
    register_data = {
        'email': 'test@example.com',
        'username': 'testuser',
        'password': 'password123',
        'first_name': 'Test',
        'last_name': 'User'
    }
    
    try:
        response = requests.post(f'{BASE_URL}/auth/register', json=register_data)
        response_data = response.json()
        print(f"Register response ({response.status_code}):", json.dumps(response_data, indent=2))
        
        if response.status_code >= 400:
            logger.error(f"Registration failed with status {response.status_code}")
            if 'error' in response_data:
                logger.error(f"Error details: {response_data}")
        
        if response.status_code == 201:
            access_token = response_data.get('access_token')
            headers = {'Authorization': f'Bearer {access_token}'}
            
            # Test getting current user
            me_response = requests.get(f'{BASE_URL}/auth/me', headers=headers)
            print(f"Current user response ({me_response.status_code}):", json.dumps(me_response.json(), indent=2))
        
        # Test login with existing admin account
        logger.info("Trying to login with admin account...")
        login_data = {
            'email': 'admin@example.com',
            'password': 'password'
        }
        login_response = requests.post(f'{BASE_URL}/auth/login', json=login_data)
        login_data = login_response.json()
        print(f"Login response ({login_response.status_code}):", json.dumps(login_data, indent=2))
        
        if login_response.status_code >= 400:
            logger.error(f"Login failed with status {login_response.status_code}")
            if 'error' in login_data:
                logger.error(f"Error details: {login_data}")
        
        if login_response.status_code == 200:
            access_token = login_data.get('access_token')
            return access_token
        
        # If admin login failed, try the test user
        login_data = {
            'email': 'test@example.com',
            'password': 'password123'
        }
        login_response = requests.post(f'{BASE_URL}/auth/login', json=login_data)
        login_data = login_response.json()
        print(f"Test user login response ({login_response.status_code}):", json.dumps(login_data, indent=2))
        
        if login_response.status_code == 200:
            access_token = login_data.get('access_token')
            return access_token
    
    except requests.exceptions.ConnectionError:
        logger.error(f"Failed to connect to {BASE_URL}. Is the server running?")
    except Exception as e:
        logger.error(f"Error testing auth endpoints: {str(e)}", exc_info=True)
    
    return None

def test_departments(access_token):
    """Test department endpoints."""
    print("\n--- Testing Departments ---")
    headers = {'Authorization': f'Bearer {access_token}'}
    
    # Create a department
    dept_data = {
        'name': 'Test Department',
        'description': 'This is a test department'
    }
    
    try:
        # Create department
        response = requests.post(f'{BASE_URL}/departments/', json=dept_data, headers=headers)
        print(f"Create department response ({response.status_code}):", json.dumps(response.json(), indent=2))
        
        if response.status_code == 201:
            dept_id = response.json().get('department', {}).get('id')
            
            # Get all departments
            all_response = requests.get(f'{BASE_URL}/departments/', headers=headers)
            print(f"Get all departments response ({all_response.status_code}):", json.dumps(all_response.json(), indent=2))
            
            # Get single department
            single_response = requests.get(f'{BASE_URL}/departments/{dept_id}', headers=headers)
            print(f"Get single department response ({single_response.status_code}):", json.dumps(single_response.json(), indent=2))
            
            # Update department
            update_data = {'name': 'Updated Department Name'}
            update_response = requests.put(f'{BASE_URL}/departments/{dept_id}', json=update_data, headers=headers)
            print(f"Update department response ({update_response.status_code}):", json.dumps(update_response.json(), indent=2))
            
            return dept_id
    
    except Exception as e:
        print(f"Error testing department endpoints: {str(e)}")
    
    return None

def test_jobs(access_token):
    """Test job endpoints."""
    print("\n--- Testing Jobs ---")
    headers = {'Authorization': f'Bearer {access_token}'}
    
    # Create a job
    job_data = {
        'title': 'Test Job',
        'description': 'This is a test job',
        'min_salary': 50000,
        'max_salary': 100000
    }
    
    try:
        # Create job
        response = requests.post(f'{BASE_URL}/jobs/', json=job_data, headers=headers)
        print(f"Create job response ({response.status_code}):", json.dumps(response.json(), indent=2))
        
        if response.status_code == 201:
            job_id = response.json().get('job', {}).get('id')
            
            # Get all jobs
            all_response = requests.get(f'{BASE_URL}/jobs/', headers=headers)
            print(f"Get all jobs response ({all_response.status_code}):", json.dumps(all_response.json(), indent=2))
            
            # Get single job
            single_response = requests.get(f'{BASE_URL}/jobs/{job_id}', headers=headers)
            print(f"Get single job response ({single_response.status_code}):", json.dumps(single_response.json(), indent=2))
            
            # Update job
            update_data = {'title': 'Updated Job Title'}
            update_response = requests.put(f'{BASE_URL}/jobs/{job_id}', json=update_data, headers=headers)
            print(f"Update job response ({update_response.status_code}):", json.dumps(update_response.json(), indent=2))
            
            return job_id
    
    except Exception as e:
        print(f"Error testing job endpoints: {str(e)}")
    
    return None

def test_employees(access_token, dept_id, job_id):
    """Test employee endpoints."""
    print("\n--- Testing Employees ---")
    headers = {'Authorization': f'Bearer {access_token}'}
    
    # Create an employee
    employee_data = {
        'first_name': 'John',
        'last_name': 'Doe',
        'email': 'john.doe@example.com',
        'phone': '123-456-7890',
        'salary': 75000,
        'department_id': dept_id,
        'job_id': job_id
    }
    
    try:
        # Create employee
        response = requests.post(f'{BASE_URL}/employees/', json=employee_data, headers=headers)
        print(f"Create employee response ({response.status_code}):", json.dumps(response.json(), indent=2))
        
        if response.status_code == 201:
            employee_id = response.json().get('employee', {}).get('id')
            
            # Get all employees
            all_response = requests.get(f'{BASE_URL}/employees/', headers=headers)
            print(f"Get all employees response ({all_response.status_code}):", json.dumps(all_response.json(), indent=2))
            
            # Get single employee
            single_response = requests.get(f'{BASE_URL}/employees/{employee_id}', headers=headers)
            print(f"Get single employee response ({single_response.status_code}):", json.dumps(single_response.json(), indent=2))
            
            # Update employee
            update_data = {'first_name': 'Updated', 'last_name': 'Name'}
            update_response = requests.put(f'{BASE_URL}/employees/{employee_id}', json=update_data, headers=headers)
            print(f"Update employee response ({update_response.status_code}):", json.dumps(update_response.json(), indent=2))
            
            return employee_id
    
    except Exception as e:
        print(f"Error testing employee endpoints: {str(e)}")
    
    return None

def cleanup(access_token, employee_id, dept_id, job_id):
    """Clean up test data."""
    print("\n--- Cleaning Up Test Data ---")
    headers = {'Authorization': f'Bearer {access_token}'}
    
    try:
        # Delete employee
        if employee_id:
            emp_response = requests.delete(f'{BASE_URL}/employees/{employee_id}', headers=headers)
            print(f"Delete employee response ({emp_response.status_code}):", json.dumps(emp_response.json(), indent=2))
        
        # Delete job
        if job_id:
            job_response = requests.delete(f'{BASE_URL}/jobs/{job_id}', headers=headers)
            print(f"Delete job response ({job_response.status_code}):", json.dumps(job_response.json(), indent=2))
        
        # Delete department
        if dept_id:
            dept_response = requests.delete(f'{BASE_URL}/departments/{dept_id}', headers=headers)
            print(f"Delete department response ({dept_response.status_code}):", json.dumps(dept_response.json(), indent=2))
    
    except Exception as e:
        print(f"Error during cleanup: {str(e)}")

def test_endpoints():
    # Test GET endpoints
    endpoints = [
        '/employees',
        '/departments',
        '/jobs',
        '/regions',
        '/countries',
        '/locations',
        '/job-grades',
        '/job-history'
    ]
    
    for endpoint in endpoints:
        print(f"\nTesting GET {endpoint}")
        response = requests.get(f"{BASE_URL}{endpoint}")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            key = endpoint.strip('/').replace('-', '_')
            if key in data:
                print(f"Count: {len(data[key])}")
                if len(data[key]) > 0:
                    print(f"First item: {json.dumps(data[key][0], indent=2)[:150]}...")
    
    # Test a specific item
    print("\nTesting GET /departments/10")
    response = requests.get(f"{BASE_URL}/departments/10")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(json.dumps(response.json(), indent=2))

def main():
    """Run the API tests."""
    print("Starting API tests...")
    
    # Test authentication
    access_token = test_auth()
    if not access_token:
        print("Authentication failed. Exiting tests.")
        return
    
    # Test departments
    dept_id = test_departments(access_token)
    
    # Test jobs
    job_id = test_jobs(access_token)
    
    # Test employees
    employee_id = None
    if dept_id and job_id:
        employee_id = test_employees(access_token, dept_id, job_id)
    
    # Clean up test data
    cleanup(access_token, employee_id, dept_id, job_id)
    
    # Test additional endpoints
    test_endpoints()
    
    print("\nAPI tests completed!")

if __name__ == '__main__':
    main() 