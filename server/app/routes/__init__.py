from flask import Blueprint

def register_blueprints(app):
    """Register all blueprints with the Flask application."""
    
    # Import blueprints
    from .employee_routes import employee_bp
    from .department_routes import department_bp
    from .job_routes import job_bp
    from .auth_routes import auth_bp
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(employee_bp, url_prefix='/api/employees')
    app.register_blueprint(department_bp, url_prefix='/api/departments')
    app.register_blueprint(job_bp, url_prefix='/api/jobs') 