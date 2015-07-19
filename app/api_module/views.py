from flask import Blueprint


mod = Blueprint('api_module', __name__, url_prefix='/api')


@mod.route('/')
def index():
    return 'a bunch of data'
