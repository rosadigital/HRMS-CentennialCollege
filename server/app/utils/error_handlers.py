from flask import jsonify
from werkzeug.exceptions import HTTPException, NotFound, BadRequest, Unauthorized, Forbidden
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

def register_error_handlers(app):
    """
    Register error handlers for the Flask app.
    """
    
    # Handle 404 errors
    @app.errorhandler(NotFound)
    def not_found(error):
        return jsonify({
            'success': False,
            'error': 404,
            'message': 'Resource not found'
        }), 404
    
    # Handle 400 errors
    @app.errorhandler(BadRequest)
    def bad_request(error):
        return jsonify({
            'success': False,
            'error': 400,
            'message': 'Bad request'
        }), 400
    
    # Handle 401 errors
    @app.errorhandler(Unauthorized)
    def unauthorized(error):
        return jsonify({
            'success': False,
            'error': 401,
            'message': 'Authentication required'
        }), 401
    
    # Handle 403 errors
    @app.errorhandler(Forbidden)
    def forbidden(error):
        return jsonify({
            'success': False,
            'error': 403,
            'message': 'Permission denied'
        }), 403
    
    # Handle generic HTTP exceptions
    @app.errorhandler(HTTPException)
    def handle_http_exception(error):
        return jsonify({
            'success': False,
            'error': error.code,
            'message': error.description
        }), error.code
    
    # Handle SQLAlchemy errors
    @app.errorhandler(SQLAlchemyError)
    def handle_sqlalchemy_error(error):
        app.logger.error(f"Database error: {str(error)}")
        return jsonify({
            'success': False,
            'error': 500,
            'message': 'Database error occurred'
        }), 500
    
    # Handle integrity errors (e.g., unique constraint violations)
    @app.errorhandler(IntegrityError)
    def handle_integrity_error(error):
        app.logger.error(f"Integrity error: {str(error)}")
        return jsonify({
            'success': False,
            'error': 400,
            'message': 'Data integrity error. Possible duplicate or invalid reference.'
        }), 400
    
    # Handle generic errors
    @app.errorhandler(Exception)
    def handle_generic_exception(error):
        app.logger.error(f"Unhandled exception: {str(error)}")
        return jsonify({
            'success': False,
            'error': 500,
            'message': 'An unexpected error occurred'
        }), 500 