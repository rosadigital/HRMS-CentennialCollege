#!/usr/bin/env python
import os
from app import create_app, db
from app.models import User, Department, Job, Employee
from flask_cors import CORS

# Get configuration from environment or use default
config_name = os.environ.get('FLASK_CONFIG', 'development')
app = create_app(config_name)
CORS(app, supports_credentials=True) 

@app.shell_context_processor
def make_shell_context():
    """Add database and models to flask shell context."""
    return {
        'db': db,
        'User': User,
        'Department': Department,
        'Job': Job,
        'Employee': Employee
    }

@app.cli.command("init-db")
def init_db():
    """Initialize the database."""
    db.create_all()
    print("Database tables created.")

@app.cli.command("seed-db")
def seed_db():
    """Seed the database with sample data."""
    # Create admin user
    if not User.query.filter_by(email='admin@example.com').first():
        admin = User(
            email='admin@example.com',
            username='admin',
            first_name='Admin',
            last_name='User',
            is_admin=True
        )
        admin.password = 'password'
        db.session.add(admin)
    
    # Create departments
    departments = [
        {'name': 'Human Resources', 'description': 'Handles employee relations and recruitment'},
        {'name': 'Engineering', 'description': 'Builds and maintains software and systems'},
        {'name': 'Marketing', 'description': 'Handles promotion and advertising'},
        {'name': 'Finance', 'description': 'Manages company funds and budget'},
        {'name': 'Operations', 'description': 'Oversees day-to-day operations'}
    ]
    
    for dept_data in departments:
        if not Department.query.filter_by(name=dept_data['name']).first():
            dept = Department(**dept_data)
            db.session.add(dept)
    
    # Create jobs
    jobs = [
        {'title': 'Software Engineer', 'description': 'Develops and maintains software applications', 'min_salary': 70000, 'max_salary': 120000},
        {'title': 'HR Manager', 'description': 'Manages HR activities and recruitment', 'min_salary': 65000, 'max_salary': 95000},
        {'title': 'Marketing Specialist', 'description': 'Creates and implements marketing campaigns', 'min_salary': 60000, 'max_salary': 90000},
        {'title': 'Financial Analyst', 'description': 'Analyzes financial data and makes recommendations', 'min_salary': 65000, 'max_salary': 100000},
        {'title': 'Operations Manager', 'description': 'Oversees company operations', 'min_salary': 75000, 'max_salary': 110000}
    ]
    
    for job_data in jobs:
        if not Job.query.filter_by(title=job_data['title']).first():
            job = Job(**job_data)
            db.session.add(job)
    
    db.session.commit()
    print("Database seeded with initial data.")

if __name__ == '__main__':
    app.run(host='0.0.0.0') 