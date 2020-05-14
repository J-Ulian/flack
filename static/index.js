document.addEventListener('DOMContentLoaded', function () {

    var name = "name";
    var room = "main";

    if (!localStorage.getItem("user")) {
        document.getElementById("chat").hidden = true;
        document.getElementById("new-message").hidden = true;
    }

    if (localStorage.getItem("user")) {

        name = localStorage.getItem("user");
        room = localStorage.getItem("room");
        document.querySelector("#prompt").innerHTML = `User ${name} in room ${room}`;
        let x = document.querySelectorAll(".form-group");
        let i;
        for (i = 0; i < x.length; i++) {
            x[i].innerHTML = "";
        }
        document.getElementById("login").hidden = true;

        load_page(room);
        show();
    };



    document.querySelector("#login").onsubmit = () => {

        name = document.querySelector("#loguser").value;
        room = document.querySelector("#logroom").value;
        document.querySelector("#prompt").innerHTML = `Hello ${name}!`;
        localStorage.setItem('user', name);
        localStorage.setItem('room', room);

        let x = document.querySelectorAll(".form-group");
        let i;
        for (i = 0; i < x.length; i++) {
            x[i].innerHTML = "";
        }
        document.getElementById("login").hidden = true;
        //  load_page('first');
        document.getElementById("chat").hidden = false;
        document.getElementById("new-message").hidden = false;
        window.location.reload(true);
        show();
        return false;



    };




    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    // Automatically connect to room in question

    socket.emit('join', {
        "room": room,
        "username": name
    });
    console.log(`joining ${room}`);

    socket.on('connect', () => {





        // Set links up to load new pages.
        document.querySelectorAll('.nav-link').forEach(link => {
            link.onclick = () => {
                let newroom = link.innerHTML;
                console.log(newroom);
                if (newroom === "Log Out") {
                    console.log("found!!!!!!")
                } else {


                    let trimmedroom = newroom.trim();
                    console.log(trimmedroom);
                    socket.emit('leave', {
                        "room": room,
                        "username": name
                    });
                    localStorage.setItem('room', trimmedroom);
                    socket.emit('join', {
                        "room": trimmedroom,
                        "username": name
                    });
                    console.log(`joining new ${trimmedroom}`);
                    load_page(link.dataset.page);
                    room = trimmedroom;
                    document.querySelector("#prompt").innerHTML = `User ${name} in room ${room}`;
                    show();
                    console.log("showed");

                    return false;
                    //window.location.reload(true);        

                }
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
        //  socket.on("connect", () => {
        document.querySelector("#new-message").onsubmit = () => {
            const selec = document.querySelector("#message").value;
            name = localStorage.getItem('user');
            const selection = name + ": " + selec;
            room = localStorage.getItem("room");
            socket.emit("submit message", {
                "selection": selection,
                "room": room
            });
            document.querySelector("#message").value = "";
            //document.getElementById('submit').scrollIntoView();
            return false;
        };
        // });

        document.getElementById("logout").addEventListener("click", logOut);
        document.getElementById("message").addEventListener("keypress", submitOnEnter);




        // When a new message is announced, add to the unordered list
        socket.on("chat totals", data => {
            console.log("something");
            const div = document.createElement('div');

            div.innerHTML = `${data.selection}`;
            document.querySelector("#chat").append(div);

            document.querySelector("#message").value = "";
            document.querySelector('#submit').disabled = true;
        })

        /*  socket.on("my response", data => {
        console.log(data.data);
        const name = localStorage.getItem('user');
        const li = document.createElement('li');
        li.innerHTML = `USER: joined the chat!`;
        //document.querySelector("#chat").append(li);
        
        
    }); 
*/


        socket.on('message', function (message) {
            const div = document.createElement('div');
            div.className = "aClassName";
            div.innerHTML = message["selection"];
            console.log(message["selection"]);
            try {
                if (message.match(/^.*has entered the room.*$/)) {
                    console.log(message)
                    const div = document.createElement('div');
                    div.className = "aClassName";
                    div.innerHTML = message;
                    document.querySelector("#userinfo").append(div);
                }
            } catch (e) {
                if (e instanceof TypeError) {
                    // код для обработки исключений TypeError
                    if (message["selection"] != undefined) {
                        div.className = "aClassName";
                        document.querySelector("#chat").append(div);
                    }
                } else if (e instanceof RangeError) {
                    // код для обработки исключений RangeError
                } else if (e instanceof EvalError) {
                    // код для обработки исключений EvalError
                } else {
                    // код для обработки всех остальных типов исключений
                    logMyErrors(e); // передача исключения обработчику исключений
                }

            }
        });






    });

    /*socket.on("chat totals", data => {
        console.log("something");
        const li = document.createElement('li');
        li.innerHTML = `${data.selection}`;
        document.querySelector("#chat").append(li);
        
        document.querySelector("#message").value = "";
        document.querySelector('#submit').disabled = true;
    });

    let matches = document.querySelectorAll("li");
    let i;
        for (i = 0; i < matches.length; i++) {
        if (matches[i] == $0){
    matches[i].hidden = true;
    console.log("found")}
            
        }*/

});


function submitOnEnter(event) {
    if (event.which === 13) {
        event.target.form.dispatchEvent(new Event("submit", {
            cancelable: true
        }));
        event.preventDefault(); // Prevents the addition of a new line in the text field (not needed in a lot of cases)
    }
}

function getDuplicateArrayElements(arr) {
    var sorted_arr = arr.slice().sort();
    var results = [];
    for (var i = 0; i < sorted_arr.length - 1; i++) {
        if (sorted_arr[i + 1] === sorted_arr[i]) {
            results.push(sorted_arr[i]);
        }
    }

    return results;
};

function logOut() {
    window.localStorage.clear();


    window.location.reload(true);

};




// Renders contents of new page in main view.
function load_page(name) {
    const request = new XMLHttpRequest();
    request.open('GET', `/${name}`);
    request.responseType = 'json';
    request.onload = () => {
        console.log(request.response);
        document.querySelector("#chat").innerHTML = "";
        document.querySelector("#logtext").innerHTML = "";
        document.querySelector('#clearout').style.background = "none";
        const response = request.response;
        response.forEach((rec) => {
            const div = document.createElement('div');
            div.innerHTML = rec;
            div.className = "aClassName";
            document.querySelector("#chat").append(div);
        })
        //document.querySelector('#bohhhdy').innerHTML = response;
    };
    request.send();
}




function bottom() {
    document.getElementById('bottom').scrollIntoView();

};

function show() {
    document.getElementById("rooms").style.visibility = "visible";
}


var getJSON = function (url, successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        if (status == 200) {
            successHandler && successHandler(xhr.response);
        } else {
            errorHandler && errorHandler(status);
        }
    };
    xhr.send();
};

/*getJSON('https://mathiasbynens.be/demo/ip', function(data) {
	alert('Your public IP address is: ' + data.ip);
}, function(status) {
	alert('Something went wrong.');
});*/

function onConnect(socket) {

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