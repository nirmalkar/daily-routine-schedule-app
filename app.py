from app import create_app
from app.config import Config
from app.services.backup_service import start_backup_thread

app = create_app(Config)

if __name__ == '__main__':
    start_backup_thread()
    app.run(host=app.config['FLASK_HOST'], port=app.config['FLASK_PORT'], debug=app.config['DEBUG'])
