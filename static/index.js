

document.addEventListener('DOMContentLoaded', function(){  

    if (!localStorage.getItem('user')){    
        const name = prompt("Enter a nickname:");    
        document.querySelector("#prompt").innerHTML = `Hello ${name}!`;    
        localStorage.setItem('user', name);
        console.log(localStorage.getItem('user'));      
        } else {
            const name = localStorage.getItem("user");
            document.querySelector("#prompt").innerHTML = `Hello again ${name}!`;
        };

    

        // By default, submit button is disabled
        document.querySelector('#submit').disabled = true;

        // Enable button only if there is text in the input field
        document.querySelector("#message").onkeyup = () => {
            if (document.querySelector("#message").value.length > 0)
            document.querySelector('#submit').disabled = false;
            else
                document.querySelector('#submit').disabled = true;
        }

   
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // Automatically connect to general channel
    const name = localStorage.getItem("user");
    socket.emit('join',{"room": "general", "username":name});
    
    // When connected, configure submit message button
    socket.on("connect", () => {
        document.querySelector("#new-message").onsubmit = () => {            
            const selec = document.querySelector("#message").value;  
            const name = localStorage.getItem('user');
            const selection = name + ": " + selec;         
            socket.emit("submit message", {"selection": selection});  
            return false;          
        };
    });

    

    // When a new message is announced, add to the unordered list
    socket.on("chat totals", data => {
        const li = document.createElement('li');
        li.innerHTML = `${data.selection}`;
        document.querySelector("#chat").append(li);
        document.querySelector("#message").value = "";
        document.querySelector('#submit').disabled = true;
    })

    socket.on("my response", data => {
        console.log(data.data);
        const name = localStorage.getItem('user');
        const li = document.createElement('li');
        li.innerHTML = `USER: joined the chat!`;
        document.querySelector("#chat").append(li);
        
        
    })

    socket.on("my disresponse", data => {
        console.log(data.data);
        const name = localStorage.getItem('user');
        const li = document.createElement('li');
        li.innerHTML = `USER: has left the chat!`;
        document.querySelector("#chat").append(li);
        
    })

    socket.on('message', function(message) {
        console.log(`Received message: ${message}`);
      });


    
   
});  


function onConnect(socket){

    // sending to the client
    socket.emit('hello', 'can you hear me?', 1, 2, 'abc');
  
    // sending to all clients except sender
    socket.broadcast.emit('broadcast', 'hello friends!');
  
    // sending to all clients in 'game' room except sender
    socket.to('game').emit('nice game', "let's play a game");
  
    // sending to all clients in 'game1' and/or in 'game2' room, except sender
    socket.to('game1').to('game2').emit('nice game', "let's play a game (too)");
  
    // sending to all clients in 'game' room, including sender
    io.in('game').emit('big-announcement', 'the game will start soon');
  
    // sending to all clients in namespace 'myNamespace', including sender
    io.of('myNamespace').emit('bigger-announcement', 'the tournament will start soon');
  
    // sending to a specific room in a specific namespace, including sender
    io.of('myNamespace').to('room').emit('event', 'message');
  
    // sending to individual socketid (private message)
    io.to(socketId).emit('hey', 'I just met you');
  
    // WARNING: `socket.to(socket.id).emit()` will NOT work, as it will send to everyone in the room
    // named `socket.id` but the sender. Please use the classic `socket.emit()` instead.
  
    // sending with acknowledgement
    socket.emit('question', 'do you think so?', function (answer) {});
  
    // sending without compression
    socket.compress(false).emit('uncompressed', "that's rough");
  
    // sending a message that might be dropped if the client is not ready to receive messages
    socket.volatile.emit('maybe', 'do you really need it?');
  
    // specifying whether the data to send has binary data
    socket.binary(false).emit('what', 'I have no binaries!');
  
    // sending to all clients on this node (when using multiple nodes)
    io.local.emit('hi', 'my lovely babies');
  
    // sending to all connected clients
    io.emit('an event sent to all connected clients');
  
  };

