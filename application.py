


import os
import requests

from flask import Flask, jsonify, render_template, request, session, redirect
from flask_session import Session
from flask_socketio import SocketIO, emit, join_room, leave_room, send
from collections import defaultdict
from random import randrange

app = Flask(__name__)

socketio = SocketIO(app)

# Configure session to use filesystem


app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

chats = ["Bot: Welcome to the chat!", "Second message!"]
chats2 = ["Bot: Welcome to the second chat!"]
chats3 = ["Bot: Welcome to the third chat!"]
rooms = ["first"]
users = []

thischat =	{
  "user": "roof",
  "user2": "main"
}



dictchat = {"first": "empty chat, \n second string though"}

messages = defaultdict(list)

messages["main"].append("first")
messages["main"].append("second")


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
    
    try:
        if session["user_id"]:
            x = thischat[session["user_id"]]
            print(f' CURRENT SESSSSSSSSSION {session["user_id"]}')
        return render_template("index.html",messages=messages[x])
    except:
        session["user_id"] = randrange(100000000000000000000)
        print(f' CURRENT SESSSSSSSSSION NOOOOOO')
        return render_template("index.html")

    
   # return render_template("index.html",chats=chats, rooms=rooms)

@app.route("/logout")
def bye():
    return("Bye-bye!")

@app.route("/login")
def welcome():
    return redirect("/")

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
   

@socketio.on("send message")
def message(data):
    room = data['channel']
    emit('broadcast message', data['message'], room=room)
  
   
@socketio.on("submit message")
def handle_message(message):
    selection = message["selection"]
    room = message["room"]  
    print(selection)     
    messages[room].append(selection)    
    send(message, room=room)
    
        


@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)       
    thischat[session["user_id"]] = room
    #messages[room].append(f"{username} has entered the {room}.")
    #send(username + ' has entered the room ' + room, room=room)
    
    



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




