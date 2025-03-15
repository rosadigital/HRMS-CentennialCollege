from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from marshmallow import Schema, fields, validate, ValidationError
from ..models import User
from .. import db

auth_bp = Blueprint('auth', __name__)

# Schema for request validation
class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)

class RegisterSchema(Schema):
    email = fields.Email(required=True)
    username = fields.String(required=True, validate=validate.Length(min=3, max=80))
    password = fields.String(required=True, validate=validate.Length(min=6))
    first_name = fields.String(validate=validate.Length(max=50))
    last_name = fields.String(validate=validate.Length(max=50))

login_schema = LoginSchema()
register_schema = RegisterSchema()

@auth_bp.route('/login', methods=['POST'])
def login():
    """Log in a user and return an access token."""
    data = request.get_json()
    
    # Validate input
    try:
        validated_data = login_schema.load(data)
    except ValidationError as err:
        return jsonify({
            'success': False,
            'message': 'Validation error',
            'errors': err.messages
        }), 400
    
    # Check if user exists
    user = User.query.filter_by(email=validated_data['email']).first()
    if not user or not user.verify_password(validated_data['password']):
        return jsonify({
            'success': False,
            'message': 'Invalid email or password'
        }), 401
    
    # Create access token
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'success': True,
        'message': 'Login successful',
        'access_token': access_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.get_json()
    
    # Validate input
    try:
        validated_data = register_schema.load(data)
    except ValidationError as err:
        return jsonify({
            'success': False,
            'message': 'Validation error',
            'errors': err.messages
        }), 400
    
    # Check if email already exists
    if User.query.filter_by(email=validated_data['email']).first():
        return jsonify({
            'success': False,
            'message': 'Email already registered'
        }), 400
    
    # Check if username already exists
    if User.query.filter_by(username=validated_data['username']).first():
        return jsonify({
            'success': False,
            'message': 'Username already taken'
        }), 400
    
    # Create user
    user = User(
        email=validated_data['email'],
        username=validated_data['username'],
        first_name=validated_data.get('first_name', ''),
        last_name=validated_data.get('last_name', ''),
        is_admin=False
    )
    user.password = validated_data['password']
    
    db.session.add(user)
    db.session.commit()
    
    # Create access token
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'success': True,
        'message': 'Registration successful',
        'access_token': access_token,
        'user': user.to_dict()
    }), 201

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get the current authenticated user."""
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    return jsonify({
        'success': True,
        'user': user.to_dict()
    }), 200 