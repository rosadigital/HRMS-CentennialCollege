from flask import Blueprint
from .employee_routes import employee_bp
from .department_routes import department_bp
from .job_routes import job_bp
from .auth_routes import auth_bp

api_bp = Blueprint('api', __name__, url_prefix='/api')

# Register the routes
api_bp.register_blueprint(auth_bp, url_prefix='/auth')
api_bp.register_blueprint(employee_bp, url_prefix='/employees')
api_bp.register_blueprint(department_bp, url_prefix='/departments')
api_bp.register_blueprint(job_bp, url_prefix='/jobs')

def init_app(app):
    """Initialize app with API routes."""
    app.register_blueprint(api_bp) 