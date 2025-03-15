import json
import logging

logger = logging.getLogger(__name__)

def load_settings():
    try:
        with open('settings.json', 'r') as f:
            settings = json.load(f)
            logger.info("Loaded settings.json")
            return settings
    except FileNotFoundError:
        logger.error("No settings.json found!")
        return {}
    except json.JSONDecodeError as e:
        logger.exception("Invalid JSON in settings.json!")
        return {}
