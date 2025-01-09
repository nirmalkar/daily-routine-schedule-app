from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import json
import os
import logging
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(
    filename='app.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Get configuration from environment variables
FLASK_HOST = os.getenv('FLASK_HOST', '0.0.0.0')
FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))

# SQLite configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database Models
class DailyData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    todos = db.Column(db.Text, default='[]')  # JSON string of todos
    schedule = db.Column(db.Text, default='[]')  # JSON string of schedule items
    routines = db.Column(db.Text, default='[]')  # JSON string of routines
    memo = db.Column(db.Text, default='')

    def to_dict(self):
        return {
            'date': self.date.isoformat(),
            'todos': json.loads(self.todos),
            'schedule': json.loads(self.schedule),
            'routines': json.loads(self.routines),
            'memo': self.memo
        }

# Create database tables
with app.app_context():
    db_path = app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', '')
    if os.path.exists(db_path):
        logging.info(f"Database file already exists at: {db_path}")
    else:
        logging.info(f"Creating database at: {db_path}")
    db.create_all()
    logging.info(f"Database created at: {app.config['SQLALCHEMY_DATABASE_URI']}")

def load_settings():
    try:
        with open('settings.json', 'r') as f:
            logging.info("Load settings.json")
            return json.load(f)
    except FileNotFoundError:
        logging.error("No settings.json found!")
        return {}

settings = load_settings()

def validate_date_format(date_str):
    """Validate that the date string is in the correct format."""
    try:
        datetime.strptime(date_str, '%Y-%m-%d')
        return True, None
    except ValueError as e:
        logging.error(f"Invalid date format: {str(e)}")
        return False, "Invalid date format"

@app.route('/api/daily-data/<date>', methods=['GET'])
def get_daily_data(date):
    try:
        # Validate date format
        is_valid, error_message = validate_date_format(date)
        if not is_valid:
            return jsonify({
                'error': 'Invalid date format',
                'message': error_message
            }), 400

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
    except Exception as e:
        logging.error(f"Error loading data for {date}: {str(e)}")
        return jsonify({'error': str(e)}), 400

@app.route('/api/daily-data/<date>', methods=['POST'])
def save_daily_data(date):
    try:
        # Validate date format
        is_valid, error_message = validate_date_format(date)
        if not is_valid:
            return jsonify({
                'error': 'Invalid date format',
                'message': error_message
            }), 400

        date_obj = datetime.strptime(date, '%Y-%m-%d').date()
        data = request.get_json()

        # Validate that the data contains the correct date
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
    except Exception as e:
        logging.error(f"Error saving data for {date}: {str(e)}")
        return jsonify({'error': str(e)}), 400

@app.route('/api/daily-data/<date>', methods=['DELETE'])
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

if __name__ == '__main__':
    app.run(host=FLASK_HOST, port=FLASK_PORT, debug=True)
