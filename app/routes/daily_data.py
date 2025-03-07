from flask import Blueprint, jsonify, request
from datetime import datetime
import json
import logging

from app.models.daily_data import DailyData
from app.extensions import db
from app.utils.date_utils import validate_date_format
from app.settings.settings_loader import load_settings

daily_data_bp = Blueprint('daily_data', __name__)
settings = load_settings()

@daily_data_bp.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Server is running!'}), 200

@daily_data_bp.route('/api/daily-data/<date>', methods=['GET'])
def get_daily_data(date):
    is_valid, error_message = validate_date_format(date)
    if not is_valid:
        return jsonify({'error': 'Invalid date format', 'message': error_message}), 400

    date_obj = datetime.strptime(date, '%Y-%m-%d').date()
    daily_data = DailyData.query.filter_by(date=date_obj).first()

    if daily_data:
        data_dict = daily_data.to_dict()
        logging.info(f"Loading data for {date}: {data_dict}")
        response = jsonify(data_dict)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    else:
        default_data = {
            'date': date,
            'todos': [],
            'schedule': [],
            'routines': settings.get('routines', []),
            'memo': ''
        }
        logging.info(f"No data found for {date}. Returning default data: {default_data}")
        response = jsonify(default_data)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

@daily_data_bp.route('/api/daily-data/<date>', methods=['POST'])
def save_daily_data(date):
    is_valid, error_message = validate_date_format(date)
    if not is_valid:
        return jsonify({
            'error': 'Invalid date format',
            'message': error_message
        }), 400

    date_obj = datetime.strptime(date, '%Y-%m-%d').date()
    data = request.get_json()

    if 'date' in data and data['date'] != date:
        error_msg = f"Date mismatch: URL date {date} doesn't match data date {data['date']}"
        logging.error(error_msg)
        return jsonify({
            'error': 'Date mismatch',
            'message': error_msg
        }), 400

    logging.info(f"Saving data for {date}: {data}")

    daily_data = DailyData.query.filter_by(date=date_obj).first()
    if daily_data:
        daily_data.todos = json.dumps(data.get('todos', []))
        daily_data.schedule = json.dumps(data.get('schedule', []))
        daily_data.routines = json.dumps(data.get('routines', []))
        daily_data.memo = data.get('memo', '')
    else:
        daily_data = DailyData(
            date=date_obj,
            todos=json.dumps(data.get('todos', [])),
            schedule=json.dumps(data.get('schedule', [])),
            routines=json.dumps(data.get('routines', [])),
            memo=data.get('memo', '')
        )

    db.session.add(daily_data)
    db.session.commit()

    response = jsonify({'message': 'Data saved successfully'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@daily_data_bp.route('/api/daily-data/<date>', methods=['DELETE'])
def delete_daily_data(date):
    try:
        date_obj = datetime.strptime(date, '%Y-%m-%d').date()
        daily_data = DailyData.query.filter_by(date=date_obj).first()

        if daily_data:
            db.session.delete(daily_data)
            db.session.commit()
            logging.info(f"Deleted data for {date}")
            response = jsonify({'message': 'Data deleted successfully'})
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
        else:
            logging.info(f"No data found for {date} to delete")
            response = jsonify({'message': 'No data found for this date'})
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
    except Exception as e:
        logging.error(f"Error deleting data for {date}: {str(e)}")
        return jsonify({'error': str(e)}), 400
