import os
import sys

from flask import Flask, render_template
from flask.ext.sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config.from_object('app.config')
db = SQLAlchemy(app)

from app.api_module.views import mod as api_module
app.register_blueprint(api_module)
