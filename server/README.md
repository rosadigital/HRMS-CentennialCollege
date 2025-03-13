# HRMS Server

Backend API for the Human Resource Management System (HRMS), built with Flask.

## Features

- RESTful API for HRMS resources
- JWT-based authentication
- Database models for employees, departments, jobs, and users
- Data validation with Marshmallow
- Error handling

## Tech Stack

- Flask 2.3.3
- SQLAlchemy 2.0.25
- Flask-JWT-Extended 4.5.3
- Marshmallow 3.20.1
- SQLite (default) with option to use other databases

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. Clone the repository
2. Navigate to the server directory:
   ```
   cd server
   ```
3. Create a virtual environment:
   ```
   python -m venv venv
   ```
4. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```
5. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

### Environment Setup

Create a `.env` file in the server directory with the following variables:

```
FLASK_APP=run.py
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
```

### Database Setup

Initialize and seed the database with sample data:

```
flask init-db
flask seed-db
```

### Running the Application

To start the development server:

```
flask run
```

The API will be available at [http://localhost:5000/api](http://localhost:5000/api).

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/register` - Register a new user

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/<id>` - Get a specific employee
- `POST /api/employees` - Create a new employee
- `PUT /api/employees/<id>` - Update an employee
- `DELETE /api/employees/<id>` - Delete an employee

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/<id>` - Get a specific department
- `POST /api/departments` - Create a new department
- `PUT /api/departments/<id>` - Update a department
- `DELETE /api/departments/<id>` - Delete a department

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/<id>` - Get a specific job
- `POST /api/jobs` - Create a new job
- `PUT /api/jobs/<id>` - Update a job
- `DELETE /api/jobs/<id>` - Delete a job

## Testing

Run the tests using pytest:

```
pytest
```

## Production Deployment

For production deployment:

1. Set appropriate environment variables
2. Use a production WSGI server like Gunicorn:
   ```
   gunicorn 'run:app'
   ```
3. Consider using a more robust database like PostgreSQL

## Default Admin User

- Email: admin@example.com
- Password: password 