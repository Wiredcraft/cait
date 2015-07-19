import os
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

DEBUG = False
SECRET_KEY = 'development key'

# Define the database
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'app.db')
DATABASE_CONNECT_OPTIONS = {}
