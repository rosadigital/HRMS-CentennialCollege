from flask import Blueprint, request, jsonify
from ..models import Location, Department
from .. import db

location_bp = Blueprint('location', __name__)

@location_bp.route('/', methods=['GET'])
def get_locations():
    """Get all locations."""
    locations = Location.query.all()
    return jsonify({
        'success': True,
        'locations': [location.to_dict() for location in locations]
    }), 200

@location_bp.route('/<int:location_id>', methods=['GET'])
def get_location(location_id):
    """Get a single location by ID."""
    location = Location.query.get_or_404(location_id)
    
    # Get departments at this location
    departments = Department.query.filter_by(LOCATION_ID=location_id).all()
    
    result = location.to_dict()
    result['departments'] = [department.to_dict() for department in departments]
    
    return jsonify({
        'success': True,
        'location': result
    }), 200

@location_bp.route('/', methods=['POST'])
def create_location():
    """Create a new location."""
    data = request.get_json()
    
    # Map request fields to Oracle column names
    oracle_data = {}
    field_mapping = {
        'street_address': 'STREET_ADDRESS',
        'postal_code': 'POSTAL_CODE',
        'city': 'CITY',
        'state_province': 'STATE_PROVINCE',
        'country_id': 'COUNTRY_ID'
    }
    
    for key, value in data.items():
        if key in field_mapping:
            oracle_data[field_mapping[key]] = value
    
    try:
        new_location = Location(**oracle_data)
        db.session.add(new_location)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Location created successfully',
            'location': new_location.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@location_bp.route('/<int:location_id>', methods=['PUT'])
def update_location(location_id):
    """Update an existing location."""
    location = Location.query.get_or_404(location_id)
    data = request.get_json()
    
    # Map request fields to Oracle column names
    field_mapping = {
        'street_address': 'STREET_ADDRESS',
        'postal_code': 'POSTAL_CODE',
        'city': 'CITY',
        'state_province': 'STATE_PROVINCE',
        'country_id': 'COUNTRY_ID'
    }
    
    try:
        for key, value in data.items():
            if key in field_mapping:
                setattr(location, field_mapping[key], value)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Location updated successfully',
            'location': location.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@location_bp.route('/<int:location_id>', methods=['DELETE'])
def delete_location(location_id):
    """Delete a location."""
    location = Location.query.get_or_404(location_id)
    
    # Check if there are departments using this location
    departments = Department.query.filter_by(LOCATION_ID=location_id).first()
    if departments:
        return jsonify({
            'success': False,
            'message': 'Cannot delete location that has departments. Reassign departments first.'
        }), 400
    
    try:
        db.session.delete(location)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Location deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to delete location: {str(e)}'
        }), 500 