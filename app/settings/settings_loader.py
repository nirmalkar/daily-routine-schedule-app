import json
import logging

def load_settings():
    try:
        with open('settings.json', 'r') as f:
            logging.info("Loaded settings.json")
            return json.load(f)
    except FileNotFoundError:
        logging.error("No settings.json found!")
        return {}
