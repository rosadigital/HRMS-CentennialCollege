from flask import Blueprint, request, jsonify
from ..models import Region, Country
from .. import db

region_bp = Blueprint('region', __name__)

@region_bp.route('/', methods=['GET'])
def get_regions():
    """Get all regions."""
    regions = Region.query.all()
    return jsonify({
        'success': True,
        'regions': [region.to_dict() for region in regions]
    }), 200

@region_bp.route('/<int:region_id>', methods=['GET'])
def get_region(region_id):
    """Get a single region by ID."""
    region = Region.query.get_or_404(region_id)
    
    # Get countries in this region
    countries = Country.query.filter_by(REGION_ID=region_id).all()
    
    result = region.to_dict()
    result['countries'] = [country.to_dict() for country in countries]
    
    return jsonify({
        'success': True,
        'region': result
    }), 200

@region_bp.route('/', methods=['POST'])
def create_region():
    """Create a new region."""
    data = request.get_json()
    
    # Map request fields to Oracle column names
    oracle_data = {}
    field_mapping = {
        'region_name': 'REGION_NAME'
    }
    
    for key, value in data.items():
        if key in field_mapping:
            oracle_data[field_mapping[key]] = value
    
    try:
        new_region = Region(**oracle_data)
        db.session.add(new_region)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Region created successfully',
            'region': new_region.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@region_bp.route('/<int:region_id>', methods=['PUT'])
def update_region(region_id):
    """Update an existing region."""
    region = Region.query.get_or_404(region_id)
    data = request.get_json()
    
    # Map request fields to Oracle column names
    field_mapping = {
        'region_name': 'REGION_NAME'
    }
    
    try:
        for key, value in data.items():
            if key in field_mapping:
                setattr(region, field_mapping[key], value)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Region updated successfully',
            'region': region.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@region_bp.route('/<int:region_id>', methods=['DELETE'])
def delete_region(region_id):
    """Delete a region."""
    region = Region.query.get_or_404(region_id)
    
    # Check if there are countries in this region
    countries = Country.query.filter_by(REGION_ID=region_id).first()
    if countries:
        return jsonify({
            'success': False,
            'message': 'Cannot delete region that has countries. Reassign countries first.'
        }), 400
    
    try:
        db.session.delete(region)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Region deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to delete region: {str(e)}'
        }), 500 