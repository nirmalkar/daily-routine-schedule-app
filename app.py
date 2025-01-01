from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Get configuration from environment variables
FLASK_HOST = os.getenv('FLASK_HOST', '0.0.0.0')
FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))

# SQLite configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///daily_routine.db'
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
    db.create_all()

@app.route('/api/daily-data/<date>', methods=['GET'])
def get_daily_data(date):
    try:
        date_obj = datetime.strptime(date, '%Y-%m-%d').date()
        daily_data = DailyData.query.filter_by(date=date_obj).first()

        if daily_data:
            data_dict = daily_data.to_dict()
            print(f"Loading data for {date}: {data_dict}") # Print when loading data
            return jsonify(data_dict)
        else:
            default_data = {
                'date': date,
                'todos': [],
                'schedule': [],
                'routines': [
                    {'name': 'Shower', 'done': False},
                    {'name': 'Eat', 'done': False},
                    {'name': 'Sleep', 'done': False},
                    {'name': 'Work', 'done': False},
                    {'name': 'Sport', 'done': False},
                    {'name': 'Drink Water', 'done': False},
                    {'name': 'Medication', 'done': False}
                ],
                'memo': ''
            }
            print(f"No data found for {date}. Returning default data: {default_data}")
            return jsonify(default_data)
    except Exception as e:
        print(f"Error loading data for {date}: {str(e)}") # Print error on exception
        return jsonify({'error': str(e)}), 400

@app.route('/api/daily-data/<date>', methods=['POST'])
def save_daily_data(date):
    try:
        date_obj = datetime.strptime(date, '%Y-%m-%d').date()
        data = request.get_json()

        print(f"Saving data for {date}: {data}") # Print when saving data

        daily_data = DailyData.query.filter_by(date=date_obj).first()
        if not daily_data:
            daily_data = DailyData(date=date_obj)

        daily_data.todos = json.dumps(data.get('todos', []))
        daily_data.schedule = json.dumps(data.get('schedule', []))
        daily_data.routines = json.dumps(data.get('routines', []))
        daily_data.memo = data.get('memo', '')

        db.session.add(daily_data)
        db.session.commit()

        return jsonify({'message': 'Data saved successfully'})
    except Exception as e:
        print(f"Error saving data for {date}: {str(e)}") # Print error on exception
        return jsonify({'error': str(e)}), 400

@app.route('/api/daily-data/<date>', methods=['DELETE'])
def delete_daily_data(date):
    try:
        date_obj = datetime.strptime(date, '%Y-%m-%d').date()
        daily_data = DailyData.query.filter_by(date=date_obj).first()

        if daily_data:
            db.session.delete(daily_data)
            db.session.commit()
            print(f"Deleted data for {date}")
            return jsonify({'message': 'Data deleted successfully'})
        else:
            print(f"No data found for {date} to delete")
            return jsonify({'message': 'No data found for this date'})
    except Exception as e:
        print(f"Error deleting data for {date}: {str(e)}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host=FLASK_HOST, port=FLASK_PORT, debug=True)
