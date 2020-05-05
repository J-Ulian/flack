import os
import requests

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room, send
from collections import defaultdict

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

chats = ["Bot: Welcome to the main chat!", "Second message!"]
chats2 = ["Bot: Welcome to the second chat!"]
chats3 = ["Bot: Welcome to the third chat!"]
rooms = ["first"]
users = []

room1 = room2 = room3 = room4 = room5 = room6 = room7 =  room8 = room9 = room10 = None

thischat =	{
  "room": "Main",
  "messages": "Bot: Welcome to the main chat!"
}
x = thischat["room"]
dictchat = {"first": "empty chat, \n second string though"}

messages = defaultdict(list)
channels = ["Programming"]

def create_room(name):
    name = dict(room="%s" % name, messages="")
    x = name
    return x
    

# mydict = thisdict.copy()
thisdict = dict(brand="Ford", model="Mustang", year=1964)
# note that keywords are not string literals
# note the use of equals rather than colon for the assignment




@app.route("/")
def index():
    
    return render_template("login.html")
   # return render_template("index.html",chats=chats, rooms=rooms)

@app.route("/logout")
def bye():
    return("Bye-bye!")



@socketio.on("submit message")
def chat(data):
    selection = data["selection"]
    room = data["room"]  
    print(selection)
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
    create_room(room)    
    print(f"requestsid - {request.sid}")
     
    if room not in rooms:
        rooms.append(room)
    send(username + ' has entered the room ' + room, room=room, broadcast=True)
    print(room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', room=room)

@app.route("/first")
def first():
    return chats[0]

@app.route("/second")
def second():
    return x

@app.route("/third")
def third():
    return chats3[0]




