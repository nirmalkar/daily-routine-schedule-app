import unittest
from app import create_app, db
from app.config import Config
import json

class DailyDataTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(Config)
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_home(self):
        response = self.client.get('/')
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertIn('message', data)

if __name__ == '__main__':
    unittest.main()
