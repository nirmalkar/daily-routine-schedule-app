from app.extensions import db
import json

class DailyData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    todos = db.Column(db.Text, default='[]')      # JSON string of todos
    schedule = db.Column(db.Text, default='[]')   # JSON string of schedule items
    routines = db.Column(db.Text, default='[]')   # JSON string of routines
    memo = db.Column(db.Text, default='')

    def to_dict(self):
        return {
            'date': self.date.isoformat(),
            'todos': json.loads(self.todos),
            'schedule': json.loads(self.schedule),
            'routines': json.loads(self.routines),
            'memo': self.memo
        }
