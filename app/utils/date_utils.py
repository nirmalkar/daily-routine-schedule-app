from datetime import datetime
import logging

def validate_date_format(date_str):
    """Validate that the date string is in the correct format (YYYY-MM-DD)."""
    try:
        datetime.strptime(date_str, '%Y-%m-%d')
        return True, None
    except ValueError as e:
        logging.error(f"Invalid date format: {str(e)}")
        return False, "Invalid date format"
