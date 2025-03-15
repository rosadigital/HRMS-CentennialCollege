#!/usr/bin/env python
import requests
import json
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_URL = 'http://localhost:5000/api'

def test_endpoints():
    """Test key API endpoints and diagnose issues."""
    # Test GET endpoints
    endpoints = [
        '/departments',
        '/employees',
        '/jobs',
        '/regions',
        '/countries',
        '/locations',
        '/job-grades',
        '/job-history'
    ]
    
    print("Starting API tests...")
    
    for endpoint in endpoints:
        try:
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
            else:
                print(f"Response: {response.text[:200]}...")
        except Exception as e:
            print(f"Error testing {endpoint}: {str(e)}")
    
    # Test a specific item
    try:
        print("\nTesting GET /departments/10")
        response = requests.get(f"{BASE_URL}/departments/10")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"Response: {response.text[:200]}...")
    except Exception as e:
        print(f"Error testing specific department: {str(e)}")

if __name__ == '__main__':
    test_endpoints()
    print("\nAPI tests completed!") 