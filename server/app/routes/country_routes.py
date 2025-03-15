from flask import Blueprint, request, jsonify
from ..models import Country, Location
from .. import db

country_bp = Blueprint('country', __name__)

@country_bp.route('/', methods=['GET'])
def get_countries():
    """Get all countries."""
    countries = Country.query.all()
    return jsonify({
        'success': True,
        'countries': [country.to_dict() for country in countries]
    }), 200

@country_bp.route('/<string:country_id>', methods=['GET'])
def get_country(country_id):
    """Get a single country by ID."""
    country = Country.query.get_or_404(country_id)
    
    # Get locations in this country
    locations = Location.query.filter_by(COUNTRY_ID=country_id).all()
    
    result = country.to_dict()
    result['locations'] = [location.to_dict() for location in locations]
    
    return jsonify({
        'success': True,
        'country': result
    }), 200

@country_bp.route('/', methods=['POST'])
def create_country():
    """Create a new country."""
    data = request.get_json()
    
    # Map request fields to Oracle column names
    oracle_data = {}
    field_mapping = {
        'country_id': 'COUNTRY_ID',
        'country_name': 'COUNTRY_NAME',
        'region_id': 'REGION_ID'
    }
    
    for key, value in data.items():
        if key in field_mapping:
            oracle_data[field_mapping[key]] = value
    
    try:
        new_country = Country(**oracle_data)
        db.session.add(new_country)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Country created successfully',
            'country': new_country.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@country_bp.route('/<string:country_id>', methods=['PUT'])
def update_country(country_id):
    """Update an existing country."""
    country = Country.query.get_or_404(country_id)
    data = request.get_json()
    
    # Map request fields to Oracle column names
    field_mapping = {
        'country_name': 'COUNTRY_NAME',
        'region_id': 'REGION_ID'
    }
    
    try:
        for key, value in data.items():
            if key in field_mapping:
                setattr(country, field_mapping[key], value)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Country updated successfully',
            'country': country.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@country_bp.route('/<string:country_id>', methods=['DELETE'])
def delete_country(country_id):
    """Delete a country."""
    country = Country.query.get_or_404(country_id)
    
    # Check if there are locations in this country
    locations = Location.query.filter_by(COUNTRY_ID=country_id).first()
    if locations:
        return jsonify({
            'success': False,
            'message': 'Cannot delete country that has locations. Reassign locations first.'
        }), 400
    
    try:
        db.session.delete(country)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Country deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to delete country: {str(e)}'
        }), 500 