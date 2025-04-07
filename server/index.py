#!/usr/bin/env python
import os
from app import create_app, db
from app.models import User, Department, Job, Employee
from flask_cors import CORS

# Get configuration from environment or use default
config_name = os.environ.get('FLASK_CONFIG', 'development')
app = create_app(config_name)
CORS(app,
     origins=["https://hrms-k8mukh4zf-rosadigitals-projects.vercel.app",
              "http://localhost:3000/",
              "https://hrms-chi.vercel.app",
              "https://hrms-rosadigitals-projects.vercel.app"],
     supports_credentials=True)

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
    
    db.session.commit()
    print("Database seeded with initial data.")

if __name__ == '__main__':
    app.run(host='0.0.0.0') 