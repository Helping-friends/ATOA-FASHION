document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');
    const submitBtn = document.querySelector('.submit-btn');
    const alertBox = document.querySelector('.alert-box');
    const alertMsg = document.querySelector('.alert');

    // Check if user is already logged in
    if (sessionStorage.getItem('user')) {
        window.location.href = '/';
    }

    submitBtn.addEventListener('click', () => {
        // Get form inputs
        const email = form.querySelector('.email').value;
        const password = form.querySelector('.password').value;
        
        // For registration form
        const name = form.querySelector('.name')?.value;

        // Basic validation
        if (!email || !password) {
            showAlert('Please fill in all fields', 'error');
            return;
        }

        // Email validation
        if (!isValidEmail(email)) {
            showAlert('Please enter a valid email', 'error');
            return;
        }

        // Password validation
        if (password.length < 6) {
            showAlert('Password must be at least 6 characters', 'error');
            return;
        }

        // Determine if it's login or register
        const isLogin = !form.querySelector('.name');
        
        if (isLogin) {
            handleLogin(email, password);
        } else {
            if (!name) {
                showAlert('Please enter your name', 'error');
                return;
            }
            handleRegister(name, email, password);
        }
    });

    function handleLogin(email, password) {
        // Here you would normally make an API call to your backend
        // For demonstration, we'll use localStorage to simulate a database
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            showAlert('Login successful!', 'success');
            sessionStorage.setItem('user', JSON.stringify(user));
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } else {
            showAlert('Invalid email or password', 'error');
        }
    }

    function handleRegister(name, email, password) {
        // Here you would normally make an API call to your backend
        // For demonstration, we'll use localStorage to simulate a database
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if email already exists
        if (users.some(user => user.email === email)) {
            showAlert('Email already registered', 'error');
            return;
        }

        // Create new user
        const newUser = {
            name,
            email,
            password,
            id: Date.now().toString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        showAlert('Registration successful!', 'success');
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
    }

    function showAlert(message, type) {
        alertBox.className = 'alert-box ' + type;
        alertMsg.textContent = message;
        alertBox.style.display = 'block';
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    // Show/Hide Password Functionality
    document.getElementById('show-password').addEventListener('change', function() {
        const passwordField = document.getElementById('password');
        if (this.checked) {
            passwordField.type = 'text'; // Show password
        } else {
            passwordField.type = 'password'; // Hide password
        }
    });
});