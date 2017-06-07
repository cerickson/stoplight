from flask import (
    Blueprint,
    render_template,
    abort,
    current_app
    )
from jinja2 import TemplateNotFound

client = Blueprint('client',
                   __name__,
                   template_folder='templates',
                   static_url_path='/static')

@client.route('/', methods=['GET'])
def home():
    title = current_app.config['TITLE']
    return render_template('index.html', title=title)
