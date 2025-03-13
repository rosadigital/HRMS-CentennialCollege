from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from .config import config

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_name='development'):
    """
    Application factory function to create and configure a Flask app.
    
    Args:
        config_name: The configuration to use (default: 'development')
    
    Returns:
        A configured Flask application
    """
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions with app
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)
    
    # Register blueprints
    from .routes import register_blueprints
    register_blueprints(app)
    
    # Custom error handlers
    from .utils.error_handlers import register_error_handlers
    register_error_handlers(app)
    
    # Shell context for flask cli
    @app.shell_context_processor
    def make_shell_context():
        return {
            'db': db,
            'app': app,
        }
    
    return app 