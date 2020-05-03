import os
import requests

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room, send

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

chats = ["Bot: Welcome to the main chat!"]



@app.route("/")
def index():
    return render_template("index.html",chats=chats)

@app.route("/logout")
def bye():
    return("Bye-bye!")



@socketio.on("submit message")
def chat(data):
    selection = data["selection"]    
    chats.append(selection)
    emit("chat totals", data, broadcast=True)
    check_length()
    

def check_length():
    if len(chats) > 99:
        del chats[0]


@socketio.on('connect')
def test_connect():
    emit('my response', {'data': 'Connected'}, broadcast=True)

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')
    emit('my disresponse', {'data': 'disconnected'}, broadcast=True)
        


@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    send(username + ' has entered the room.', room=room)
    print("romm_joinfunction")

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', room=room)
    
