import os
import shutil
import time
import threading
import logging
from datetime import datetime, timedelta
from app.config import Config

logger = logging.getLogger(__name__)

def get_db_path():
    uri = Config.SQLALCHEMY_DATABASE_URI
    if uri.startswith('sqlite:///'):
        db_name = uri.replace('sqlite:///', '')
        if not os.path.isabs(db_name):
            db_name = os.path.abspath(db_name)
        return db_name
    return None

db_path = get_db_path()
BACKUP_INTERVAL_HOURS = 24
BACKUP_SIZE_THRESHOLD = 50 * 1024 * 1024  # 50MB

def should_backup():
    """Determine if a backup is needed based on time or size."""
    if not os.path.exists(db_path):
        return False

    file_size = os.path.getsize(db_path)
    last_backup_time = get_last_backup_time()

    if last_backup_time is None or datetime.now() - last_backup_time > timedelta(hours=BACKUP_INTERVAL_HOURS):
        return True

    if file_size > BACKUP_SIZE_THRESHOLD:
        return True

    return False

def get_last_backup_time():
    """Retrieve the last backup timestamp from existing backup files."""
    backup_dir = os.path.dirname(db_path)
    base_db_name = os.path.basename(db_path)
    backup_files = [f for f in os.listdir(backup_dir) if f.startswith(f"{base_db_name}.backup_")]
    if not backup_files:
        return None

    backup_files.sort(reverse=True)
    latest_backup = backup_files[0]
    timestamp_str = latest_backup.replace(f"{base_db_name}.backup_", "").split(".")[0]
    
    try:
        return datetime.strptime(timestamp_str, "%Y%m%d_%H%M%S")
    except ValueError:
        return None

def create_backup():
    if should_backup():
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = os.path.join(os.path.dirname(db_path), f"{os.path.basename(db_path)}.backup_{timestamp}")
        try:
            shutil.copy2(db_path, backup_path)
            logger.info(f"Database backup created: {backup_path}")
        except Exception as e:
            logger.error(f"Error creating backup: {e}")

def scheduled_backup():
    while True:
        create_backup()
        time.sleep(BACKUP_INTERVAL_HOURS * 3600)

def start_backup_thread():
    backup_thread = threading.Thread(target=scheduled_backup, daemon=True)
    backup_thread.start()
