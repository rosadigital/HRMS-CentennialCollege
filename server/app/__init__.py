from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from .config import config
import oracledb

# Configure oracledb to use thin mode (in oracledb 3.0+, thin mode is the default)
# oracledb.init_mode = oracledb.THIN_MODE  # Not needed in 3.0+

# Initialize extensions
db = SQLAlchemy()

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
    
    # Disable automatic trailing slash behavior
    app.url_map.strict_slashes = False
    
    # Initialize extensions with app
    db.init_app(app)
    
    # Configure CORS with more specific settings
    CORS(app, 
         resources={r"/api/*": {"origins": app.config.get('CORS_ORIGINS', '*').split(','), 
                               "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                               "allow_headers": ["Content-Type", "Authorization"]}},
         supports_credentials=True)
    
    # Register blueprints
    from .routes import init_app
    init_app(app)
    
    # Handle OPTIONS requests explicitly for CORS preflight
    @app.route('/api/<path:path>', methods=['OPTIONS'])
    @app.route('/api/', methods=['OPTIONS'])
    @app.route('/api', methods=['OPTIONS'])
    def options_handler(path=''):
        return '', 200
    
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