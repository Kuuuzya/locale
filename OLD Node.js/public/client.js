async function register() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    if (data.success) {
        alert('Регистрация успешна!');
        showUserData(data.username);
    } else {
        alert('Ошибка: ' + data.message);
    }
}

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.success) {
        showUserData(data.username);
    } else {
        alert('Ошибка: ' + data.message);
    }
}

function showUserData(username) {
    document.getElementById("auth").style.display = "none";
    document.getElementById("user-data").style.display = "block";
    document.getElementById("user-name").textContent = username;
}

function logout() {
    document.getElementById("auth").style.display = "block";
    document.getElementById("user-data").style.display = "none";
}
