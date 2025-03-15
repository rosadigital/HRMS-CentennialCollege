from flask import Blueprint
from .department_routes import department_bp
from .employee_routes import employee_bp
from .job_routes import job_bp
from .job_history_routes import job_history_bp
from .job_grade_routes import job_grade_bp
from .location_routes import location_bp
from .country_routes import country_bp
from .region_routes import region_bp
from .direct_routes import direct_bp

# Main API blueprint
api_bp = Blueprint('api', __name__, url_prefix='/api')

def init_app(app):
    """Initialize the application with routes."""
    
    # Register route blueprints with the API blueprint
    api_bp.register_blueprint(department_bp, url_prefix='/departments')
    api_bp.register_blueprint(employee_bp, url_prefix='/employees')
    api_bp.register_blueprint(job_bp, url_prefix='/jobs')
    api_bp.register_blueprint(job_history_bp, url_prefix='/job-history')
    api_bp.register_blueprint(job_grade_bp, url_prefix='/job-grades')
    api_bp.register_blueprint(location_bp, url_prefix='/locations')
    api_bp.register_blueprint(country_bp, url_prefix='/countries')
    api_bp.register_blueprint(region_bp, url_prefix='/regions')
    
    # Register direct routes for fallback with a different prefix
    api_bp.register_blueprint(direct_bp, url_prefix='/direct')
    
    # Register the API blueprint with the app
    app.register_blueprint(api_bp)
    
    # Return the app instance for convenience
    return app 