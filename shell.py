# Quick access to the IPython shell with some modules pre-imported
import IPython

from app import *
from app.api_module.models import *

IPython.embed()
