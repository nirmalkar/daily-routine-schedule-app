import os
import logging
from flask import Flask
from app.config import Config
from app.extensions import init_extensions, db

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    setup_logging(app)
    init_extensions(app)

    # Register blueprints
    from app.routes import register_blueprints
    register_blueprints(app)

    # Create database tables if they do not exist
    with app.app_context():
        db.create_all()
        app.logger.info(f"Database tables created/verified at: {app.config['SQLALCHEMY_DATABASE_URI']}")
    return app

def setup_logging(app):
    import sys
    from logging import Formatter, StreamHandler, FileHandler

    logger = app.logger
    logger.setLevel(logging.INFO)

    if logger.handlers:  # Prevent adding handlers repeatedly
        return

    # Create logs directory if it doesn't exist
    log_dir = os.path.join(os.getcwd(), 'logs')
    os.makedirs(log_dir, exist_ok=True)

    # File handler
    file_handler = FileHandler(os.path.join(log_dir, 'app.log'))
    file_handler.setLevel(logging.INFO)
    file_formatter = Formatter('%(asctime)s - %(levelname)s - %(message)s')
    file_handler.setFormatter(file_formatter)
    logger.addHandler(file_handler)

    # Console handler
    console_handler = StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_formatter = Formatter('%(asctime)s - %(levelname)s - %(message)s')
    console_handler.setFormatter(console_formatter)
    logger.addHandler(console_handler)

