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
    __tablename__ = 'hr_departments'
    
    department_id = db.Column(db.Integer, primary_key=True)
    department_name = db.Column(db.String(30), nullable=False)
    manager_id = db.Column(db.Integer, db.ForeignKey('hr_employees.employee_id'))
    location_id = db.Column(db.Integer, db.ForeignKey('hr_locations.location_id'))
    
    # Relationships
    employees = db.relationship('Employee', foreign_keys='Employee.department_id', backref='department')
    manager = db.relationship('Employee', foreign_keys=[manager_id], backref='managed_department')
    
    def to_dict(self):
        return {
            'department_id': self.department_id,
            'department_name': self.department_name,
            'manager_id': self.manager_id,
            'manager_name': f"{self.manager.first_name} {self.manager.last_name}" if self.manager else None,
            'location_id': self.location_id,
            'location': self.location.city if self.location else None,
            'employee_count': len(self.employees) if self.employees else 0
        }


class Job(db.Model):
    """Job model for job positions."""
    __tablename__ = 'hr_jobs'
    
    job_id = db.Column(db.String(10), primary_key=True)
    job_title = db.Column(db.String(35), nullable=False)
    min_salary = db.Column(db.Integer)
    max_salary = db.Column(db.Integer)
    
    # Relationships
    employees = db.relationship('Employee', backref='job')
    
    def to_dict(self):
        return {
            'job_id': self.job_id,
            'job_title': self.job_title,
            'min_salary': self.min_salary,
            'max_salary': self.max_salary
        }


class Employee(db.Model):
    """Employee model."""
    __tablename__ = 'hr_employees'
    
    employee_id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(20))
    last_name = db.Column(db.String(25), nullable=False)
    email = db.Column(db.String(25), unique=True, nullable=False)
    phone_number = db.Column(db.String(20))
    hire_date = db.Column(db.Date, nullable=False)
    job_id = db.Column(db.String(10), db.ForeignKey('hr_jobs.job_id'), nullable=False)
    salary = db.Column(db.Integer)
    commission_pct = db.Column(db.Integer)
    manager_id = db.Column(db.Integer, db.ForeignKey('hr_employees.employee_id'))
    department_id = db.Column(db.Integer, db.ForeignKey('hr_departments.department_id'))
    
    # Relationships
    subordinates = db.relationship('Employee', backref=db.backref('manager', remote_side=[employee_id]))
    job_history = db.relationship('JobHistory', backref='employee')
    
    def to_dict(self):
        return {
            'employee_id': self.employee_id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone_number': self.phone_number,
            'hire_date': self.hire_date.isoformat() if self.hire_date else None,
            'job_id': self.job_id,
            'job_title': self.job.job_title if self.job else None,
            'salary': self.salary,
            'commission_pct': self.commission_pct,
            'manager_id': self.manager_id,
            'manager_name': f"{self.manager.first_name} {self.manager.last_name}" if self.manager else None,
            'department_id': self.department_id,
            'department_name': self.department.department_name if self.department else None
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