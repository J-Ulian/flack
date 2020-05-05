

document.addEventListener('DOMContentLoaded', function(){  

    if (localStorage.getItem("user")) {
        // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
        const name = localStorage.getItem("user");
        document.querySelector("#prompt").innerHTML = `Hello again ${name}!`;
        let x = document.querySelectorAll(".form-group");
        let i;
        for (i = 0; i < x.length; i++) {
            x[i].innerHTML = "";
        }
        document.getElementById("login").hidden = true;

        load_page('first');
    };

    

    document.querySelector("#login").onsubmit = () => {
    if (!localStorage.getItem('user')){    
        const name = document.querySelector("#loguser").value; //prompt("Enter a nickname:");
        const room = document.querySelector("#logroom").value;   
        document.querySelector("#prompt").innerHTML = `Hello ${name}!`;    
        localStorage.setItem('user', name);
        localStorage.setItem('room', room);
        console.log(localStorage.getItem('user')); 
        // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    // Automatically connect to general channel
     
    socket.emit('join',{"room":room, "username":name});
    console.log("emmiting connection to socket");   
    load_page('first');
    return false;
    load_page('first');
    };
    
    };

    document.querySelector("#new-message").onsubmit = () => {    
        console.log("new message");        
        const selec = document.querySelector("#message").value;  
        console.log(selec)
        const name = localStorage.getItem('user');
        const selection = name + ": " + selec;   
        const room = localStorage.getItem("room");      
        socket.emit("submit message", {"selection": selection, "room": room});  
        return false;          
    };



 // Set links up to load new pages.
 document.querySelectorAll('.nav-link').forEach(link => {
     link.onclick = () => {
         load_page(link.dataset.page);
         return false;
     };
 });     

    

        // By default, submit button is disabled
        document.querySelector('#submit').disabled = true;

        // Enable button only if there is text in the input field
        document.querySelector("#message").onkeyup = () => {
            if (document.querySelector("#message").value.length > 0)
            document.querySelector('#submit').disabled = false;
            else
                document.querySelector('#submit').disabled = true;
        }

   
    

    
    
    // When connected, configure submit message button
    socket.on("connect", () => {
        document.querySelector("#new-message").onsubmit = () => {            
            const selec = document.querySelector("#message").value;  
            const name = localStorage.getItem('user');
            const selection = name + ": " + selec;   
            const room = localStorage.getItem("room");      
            socket.emit("submit message", {"selection": selection, "room": room});  
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
        //document.querySelector("#chat").append(li);
        
        
    });

   socket.on("my disresponse", data => {
        console.log(data.data);
        const name = localStorage.getItem('user');
        const li = document.createElement('li');
        li.innerHTML = `USER: has left the chat!`;
       // document.querySelector("#chat").append(li);
        
    });

    socket.on('message', function(message) {
        const li = document.createElement('li');
        li.innerHTML = message;
        document.querySelector("#chat").append(li);
        const li2 = document.createElement('li');
        li2.innerHTML =  `${room}`;
        document.querySelector("#roomsflask").append(li2);
        console.log(`Received message: ${room}`);
      });


    
   
});  

   // Renders contents of new page in main view.
   function load_page(name) {
    const request = new XMLHttpRequest();
    request.open('GET', `/${name}`);
    request.onload = () => {
        const response = request.responseText;
        
        const li = document.createElement('li');
        li.innerHTML = response;
       
        document.querySelector("#chat").append(li);
        var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
        socket.on("connect", () => {
            document.querySelector("#new-message").onsubmit = () => {            
                const selec = document.querySelector("#message").value;  
                const name = localStorage.getItem('user');
                const selection = name + ": " + selec;   
                const room = localStorage.getItem("room");      
                socket.emit("submit message", {"selection": selection, "room": room});  
                return false;          
            };
        });

        
    };
    request.send();
};

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

