# Quick access to the IPython shell with some modules pre-imported
import IPython

from flask import *
from app import *
from app.api_module.models import *
from app.api_module.schemas import *


ctx = app.test_request_context()
ctx.push()

IPython.embed()
