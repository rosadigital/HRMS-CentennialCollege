import os
from datetime import timedelta

# Flask configurations
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key')
DEBUG = os.environ.get('FLASK_DEBUG', '1') == '1'
APP_ENV = os.environ.get('FLASK_ENV', 'development')

# JWT configurations
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-jwt-secret-key')
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

# Database configurations
DB_TYPE = os.environ.get('DB_TYPE', 'oracle')

# Oracle database configuration
if DB_TYPE == 'oracle':
    ORACLE_USER = os.environ.get('ORACLE_USER', 'COMP214_W25_ers_22')
    ORACLE_PASSWORD = os.environ.get('ORACLE_PASSWORD', 'password')
    ORACLE_HOST = os.environ.get('ORACLE_HOST', '199.212.26.208')
    ORACLE_PORT = os.environ.get('ORACLE_PORT', '1521')
    ORACLE_SID = os.environ.get('ORACLE_SID', 'SQLD')
    
    # Format: oracle+cx_oracle://username:password@host:port/?service_name=service_name
    # or: oracle+cx_oracle://username:password@host:port/SID
    SQLALCHEMY_DATABASE_URI = f"oracle+cx_oracle://{ORACLE_USER}:{ORACLE_PASSWORD}@{ORACLE_HOST}:{ORACLE_PORT}/{ORACLE_SID}"
else:
    # Default SQLite database for development if Oracle not specified
    base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    db_path = os.path.join(base_dir, 'hrms.db')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', f'sqlite:///{db_path}')

# Enable SQLAlchemy track modifications
SQLALCHEMY_TRACK_MODIFICATIONS = False

# CORS configurations
CORS_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000']

# Upload configurations
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max upload size
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

class Config:
    """Base configuration."""
    SECRET_KEY = SECRET_KEY
    JWT_SECRET_KEY = JWT_SECRET_KEY
    JWT_ACCESS_TOKEN_EXPIRES = JWT_ACCESS_TOKEN_EXPIRES
    SQLALCHEMY_TRACK_MODIFICATIONS = SQLALCHEMY_TRACK_MODIFICATIONS


class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = DEBUG
    SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI


class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI
    WTF_CSRF_ENABLED = False


class ProductionConfig(Config):
    """Production configuration."""
    SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    

config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    
    'default': DevelopmentConfig
} 