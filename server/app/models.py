from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from . import db

class User(db.Model):
    """User model for authentication and user information."""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')
    
    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'is_admin': self.is_admin,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Country(db.Model):
    """Country model."""
    __tablename__ = 'hr_countries'
    
    country_id = db.Column(db.String(2), primary_key=True)
    country_name = db.Column(db.String(40))
    region_id = db.Column(db.Integer, db.ForeignKey('hr_regions.region_id'))
    
    # Relationships
    region = db.relationship('Region', backref='countries')
    locations = db.relationship('Location', backref='country')
    
    def to_dict(self):
        return {
            'country_id': self.country_id,
            'country_name': self.country_name,
            'region_id': self.region_id,
            'region_name': self.region.region_name if self.region else None
        }


class Region(db.Model):
    """Region model."""
    __tablename__ = 'hr_regions'
    
    region_id = db.Column(db.Integer, primary_key=True)
    region_name = db.Column(db.String(25))
    
    def to_dict(self):
        return {
            'region_id': self.region_id,
            'region_name': self.region_name
        }


class Location(db.Model):
    """Location model."""
    __tablename__ = 'hr_locations'
    
    location_id = db.Column(db.Integer, primary_key=True)
    street_address = db.Column(db.String(40))
    postal_code = db.Column(db.String(12))
    city = db.Column(db.String(30))
    state_province = db.Column(db.String(25))
    country_id = db.Column(db.String(2), db.ForeignKey('hr_countries.country_id'))
    
    # Relationships
    departments = db.relationship('Department', backref='location')
    
    def to_dict(self):
        return {
            'location_id': self.location_id,
            'street_address': self.street_address,
            'postal_code': self.postal_code,
            'city': self.city,
            'state_province': self.state_province,
            'country_id': self.country_id,
            'country_name': self.country.country_name if self.country else None
        }


class Department(db.Model):
    """Department model."""
    __tablename__ = 'departments'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    employees = db.relationship('Employee', backref='department', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'employee_count': self.employees.count()
        }


class Job(db.Model):
    """Job model for job positions."""
    __tablename__ = 'jobs'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    min_salary = db.Column(db.Float)
    max_salary = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    employees = db.relationship('Employee', backref='job', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'min_salary': self.min_salary,
            'max_salary': self.max_salary,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Employee(db.Model):
    """Employee model."""
    __tablename__ = 'employees'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    hire_date = db.Column(db.Date, nullable=False, default=datetime.utcnow().date)
    salary = db.Column(db.Float)
    
    # Foreign keys
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'))
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'hire_date': self.hire_date.isoformat() if self.hire_date else None,
            'salary': self.salary,
            'department_id': self.department_id,
            'department_name': self.department.name if self.department else None,
            'job_id': self.job_id,
            'job_title': self.job.title if self.job else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class JobHistory(db.Model):
    """Job History model to track employee job changes."""
    __tablename__ = 'hr_job_history'
    
    employee_id = db.Column(db.Integer, db.ForeignKey('hr_employees.employee_id'), primary_key=True)
    start_date = db.Column(db.Date, primary_key=True)
    end_date = db.Column(db.Date, nullable=False)
    job_id = db.Column(db.String(10), db.ForeignKey('hr_jobs.job_id'), nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('hr_departments.department_id'))
    
    # Relationships
    job = db.relationship('Job')
    department = db.relationship('Department')
    
    def to_dict(self):
        return {
            'employee_id': self.employee_id,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'job_id': self.job_id,
            'job_title': self.job.job_title if self.job else None,
            'department_id': self.department_id,
            'department_name': self.department.department_name if self.department else None
        }


class JobGrade(db.Model):
    """Job Grade model."""
    __tablename__ = 'hr_job_grades'
    
    grade_level = db.Column(db.String(3), primary_key=True)
    lowest_sal = db.Column(db.Integer)
    highest_sal = db.Column(db.Integer)
    
    def to_dict(self):
        return {
            'grade_level': self.grade_level,
            'lowest_sal': self.lowest_sal,
            'highest_sal': self.highest_sal
        } 