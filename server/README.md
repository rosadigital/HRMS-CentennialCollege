# Human Resource Management System (HRMS) API

This is the backend API for the Human Resource Management System. It provides endpoints for managing employees, departments, jobs, and user authentication.

## Requirements

- Python 3.8+
- Flask and extensions
- Oracle database

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd HRMS-CentennialCollege/server
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On MacOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure the database connection:
   - Edit the `app/config.py` file and update the database connection URL with your Oracle database credentials:
     ```python
     SQLALCHEMY_DATABASE_URI = 'oracle://<username>:<password>@<host>:<port>/<service_name>'
     ```

## Running the Application

1. Initialize the database:
   ```bash
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

2. Start the development server:
   ```bash
   python run.py
   ```

   The API will be available at `http://localhost:5000/api`.

## Testing the API

A test script is provided to verify the API functionality. To run the tests:

```bash
python test_api.py
```

This will create test data, test all the API endpoints, and clean up the test data.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get access token
- `GET /api/auth/me` - Get current authenticated user

### Employees

- `GET /api/employees/` - Get all employees
- `GET /api/employees/<id>` - Get a specific employee
- `POST /api/employees/` - Create a new employee
- `PUT /api/employees/<id>` - Update an existing employee
- `DELETE /api/employees/<id>` - Delete an employee

### Departments

- `GET /api/departments/` - Get all departments
- `GET /api/departments/<id>` - Get a specific department
- `POST /api/departments/` - Create a new department
- `PUT /api/departments/<id>` - Update an existing department
- `DELETE /api/departments/<id>` - Delete a department

### Jobs

- `GET /api/jobs/` - Get all jobs
- `GET /api/jobs/<id>` - Get a specific job
- `POST /api/jobs/` - Create a new job
- `PUT /api/jobs/<id>` - Update an existing job
- `DELETE /api/jobs/<id>` - Delete a job

## Authentication

All API endpoints (except login and register) require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Error Handling

The API returns appropriate HTTP status codes and JSON responses for validation errors, not found errors, and other exceptions. 