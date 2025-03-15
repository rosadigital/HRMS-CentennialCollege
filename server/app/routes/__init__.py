from flask import Blueprint
from .employee_routes import employee_bp
from .department_routes import department_bp
from .job_routes import job_bp
from .location_routes import location_bp
from .country_routes import country_bp
from .region_routes import region_bp
from .job_history_routes import job_history_bp
from .job_grade_routes import job_grade_bp

api_bp = Blueprint('api', __name__, url_prefix='/api')

# Register the routes
api_bp.register_blueprint(employee_bp, url_prefix='/employees')
api_bp.register_blueprint(department_bp, url_prefix='/departments')
api_bp.register_blueprint(job_bp, url_prefix='/jobs')
api_bp.register_blueprint(location_bp, url_prefix='/locations')
api_bp.register_blueprint(country_bp, url_prefix='/countries')
api_bp.register_blueprint(region_bp, url_prefix='/regions')
api_bp.register_blueprint(job_history_bp, url_prefix='/job-history')
api_bp.register_blueprint(job_grade_bp, url_prefix='/job-grades')

def init_app(app):
    """Initialize app with API routes."""
    app.register_blueprint(api_bp) 