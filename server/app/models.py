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


class Region(db.Model):
    """Region model."""
    __tablename__ = 'HR_REGIONS'
    
    REGION_ID = db.Column(db.Integer, primary_key=True)
    REGION_NAME = db.Column(db.String(25))
    
    def to_dict(self):
        return {
            'region_id': self.REGION_ID,
            'region_name': self.REGION_NAME
        }


class Country(db.Model):
    """Country model."""
    __tablename__ = 'HR_COUNTRIES'
    
    COUNTRY_ID = db.Column(db.String(2), primary_key=True)
    COUNTRY_NAME = db.Column(db.String(40))
    REGION_ID = db.Column(db.Integer, db.ForeignKey('HR_REGIONS.REGION_ID'))
    
    # Relationships - no backrefs
    region = db.relationship('Region')
    
    def to_dict(self):
        return {
            'country_id': self.COUNTRY_ID,
            'country_name': self.COUNTRY_NAME,
            'region_id': self.REGION_ID,
            'region_name': self.region.REGION_NAME if self.region else None
        }


class Location(db.Model):
    """Location model."""
    __tablename__ = 'HR_LOCATIONS'
    
    LOCATION_ID = db.Column(db.Integer, primary_key=True)
    STREET_ADDRESS = db.Column(db.String(40))
    POSTAL_CODE = db.Column(db.String(12))
    CITY = db.Column(db.String(30))
    STATE_PROVINCE = db.Column(db.String(25))
    COUNTRY_ID = db.Column(db.String(2), db.ForeignKey('HR_COUNTRIES.COUNTRY_ID'))
    
    # Relationships - no backrefs
    country = db.relationship('Country')
    
    def to_dict(self):
        return {
            'location_id': self.LOCATION_ID,
            'street_address': self.STREET_ADDRESS,
            'postal_code': self.POSTAL_CODE,
            'city': self.CITY,
            'state_province': self.STATE_PROVINCE,
            'country_id': self.COUNTRY_ID,
            'country_name': self.country.COUNTRY_NAME if self.country else None
        }


class Department(db.Model):
    """Department model."""
    __tablename__ = 'HR_DEPARTMENTS'
    
    DEPARTMENT_ID = db.Column(db.Integer, primary_key=True)
    DEPARTMENT_NAME = db.Column(db.String(30))
    MANAGER_ID = db.Column(db.Integer, db.ForeignKey('HR_EMPLOYEES.EMPLOYEE_ID', use_alter=True))
    LOCATION_ID = db.Column(db.Integer, db.ForeignKey('HR_LOCATIONS.LOCATION_ID'))
    
    # Relationships - no backrefs
    location = db.relationship('Location')
    
    def to_dict(self):
        return {
            'department_id': self.DEPARTMENT_ID,
            'department_name': self.DEPARTMENT_NAME,
            'manager_id': self.MANAGER_ID,
            'location_id': self.LOCATION_ID,
            'location_city': self.location.CITY if self.location else None
        }



class Job(db.Model):
    """Job model."""
    __tablename__ = 'HR_JOBS'
    
    JOB_ID = db.Column(db.String(10), primary_key=True)
    JOB_TITLE = db.Column(db.String(35))
    MIN_SALARY = db.Column(db.Integer)
    MAX_SALARY = db.Column(db.Integer)
    
    def to_dict(self):
        return {
            'job_id': self.JOB_ID,
            'job_title': self.JOB_TITLE,
            'min_salary': self.MIN_SALARY,
            'max_salary': self.MAX_SALARY
        }


class Employee(db.Model):
    """Employee model."""
    __tablename__ = 'HR_EMPLOYEES'
    
    EMPLOYEE_ID = db.Column(db.Integer, primary_key=True)
    FIRST_NAME = db.Column(db.String(20))
    LAST_NAME = db.Column(db.String(25))
    EMAIL = db.Column(db.String(25), unique=True)
    PHONE_NUMBER = db.Column(db.String(20))
    HIRE_DATE = db.Column(db.Date)
    JOB_ID = db.Column(db.String(10), db.ForeignKey('HR_JOBS.JOB_ID'))
    SALARY = db.Column(db.Float)
    COMMISSION_PCT = db.Column(db.Float)
    MANAGER_ID = db.Column(db.Integer, db.ForeignKey('HR_EMPLOYEES.EMPLOYEE_ID', use_alter=True))
    DEPARTMENT_ID = db.Column(db.Integer, db.ForeignKey('HR_DEPARTMENTS.DEPARTMENT_ID'))
    
    # Relationships - specify foreign_keys to avoid ambiguity
    department = db.relationship('Department', foreign_keys=[DEPARTMENT_ID])
    job = db.relationship('Job', foreign_keys=[JOB_ID])
    
    def to_dict(self):
        return {
            'employee_id': self.EMPLOYEE_ID,
            'first_name': self.FIRST_NAME,
            'last_name': self.LAST_NAME,
            'email': self.EMAIL,
            'phone_number': self.PHONE_NUMBER,
            'hire_date': self.HIRE_DATE.isoformat() if self.HIRE_DATE else None,
            'job_id': self.JOB_ID,
            'job_title': self.job.JOB_TITLE if self.job else None,
            'salary': self.SALARY,
            'commission_pct': self.COMMISSION_PCT,
            'manager_id': self.MANAGER_ID,
            'department_id': self.DEPARTMENT_ID,
            'department_name': self.department.DEPARTMENT_NAME if self.department else None
        }


class JobHistory(db.Model):
    """Job History model."""
    __tablename__ = 'HR_JOB_HISTORY'
    
    EMPLOYEE_ID = db.Column(db.Integer, db.ForeignKey('HR_EMPLOYEES.EMPLOYEE_ID'), primary_key=True)
    START_DATE = db.Column(db.Date, primary_key=True)
    END_DATE = db.Column(db.Date)
    JOB_ID = db.Column(db.String(10), db.ForeignKey('HR_JOBS.JOB_ID'))
    DEPARTMENT_ID = db.Column(db.Integer, db.ForeignKey('HR_DEPARTMENTS.DEPARTMENT_ID'))
    
    # Relationships - specify foreign_keys to avoid ambiguity
    job = db.relationship('Job', foreign_keys=[JOB_ID])
    department = db.relationship('Department', foreign_keys=[DEPARTMENT_ID])
    employee = db.relationship('Employee', foreign_keys=[EMPLOYEE_ID])
    
    def to_dict(self):
        return {
            'employee_id': self.EMPLOYEE_ID,
            'employee_name': f"{self.employee.FIRST_NAME} {self.employee.LAST_NAME}" if self.employee else None,
            'start_date': self.START_DATE.isoformat() if self.START_DATE else None,
            'end_date': self.END_DATE.isoformat() if self.END_DATE else None,
            'job_id': self.JOB_ID,
            'job_title': self.job.JOB_TITLE if self.job else None,
            'department_id': self.DEPARTMENT_ID,
            'department_name': self.department.DEPARTMENT_NAME if self.department else None
        }


class JobGrade(db.Model):
    """Job Grade model."""
    __tablename__ = 'HR_JOB_GRADES'
    
    GRADE_LEVEL = db.Column(db.String(3), primary_key=True)
    LOWEST_SAL = db.Column(db.Integer)
    HIGHEST_SAL = db.Column(db.Integer)
    
    def to_dict(self):
        return {
            'grade_level': self.GRADE_LEVEL,
            'lowest_salary': self.LOWEST_SAL,
            'highest_salary': self.HIGHEST_SAL
        } 