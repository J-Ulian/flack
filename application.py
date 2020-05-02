import os
import requests

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

chats = ["Demo message"]


@app.route("/")
def index():
    return render_template("index.html",chats=chats)



@socketio.on("submit message")
def chat(data):
    selection = data["selection"]    
    chats.append(selection)
    emit("chat totals", data, broadcast=True)
    print(chats)


