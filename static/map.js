document.addEventListener('DOMContentLoaded', function(){  

    document.querySelector('#form').onsubmit = function() {
        const name = document.querySelector('#name').value;
        alert(`Hello ${name}!`);
        if (!localStorage.getItem('user'))
        localStorage.setItem('user', name);
        console.log(localStorage.getItem('user'));
        return false;
    };
});  


