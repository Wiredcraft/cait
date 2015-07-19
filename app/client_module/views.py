from flask import Blueprint, render_template

mod = Blueprint('client_module', __name__)

@mod.route('/')
def index():
    return render_template('client/index.html')
