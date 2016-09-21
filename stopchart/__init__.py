from flask import Flask
from stopchart.views import client


app = Flask(__name__)
app.register_blueprint(client)
app.config.from_object('stopchart.config')
