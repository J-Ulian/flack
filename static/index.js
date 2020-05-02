

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
   
});  

