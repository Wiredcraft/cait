import os
import sys
import decimal

from flask import Flask, render_template, json
from flask.ext.sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow


app = Flask(__name__)
app.config.from_object('app.config')
db = SQLAlchemy(app)
ma = Marshmallow(app)


from app.api_module.views import mod as api_module
from app.client_module.views import mod as client_module
app.register_blueprint(api_module)
app.register_blueprint(client_module)
