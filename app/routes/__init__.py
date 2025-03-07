from flask import Flask
from app.routes.daily_data import daily_data_bp

def register_blueprints(app: Flask):
    app.register_blueprint(daily_data_bp)
