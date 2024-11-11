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
        // Basic validation
        if (!name || !email || !password) {
            showAlert('Please fill in all fields', 'error');
            return;
        }
    
        // Send registration data to the backend
        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Registration failed');
            }
            return response.text();
        })
        .then(message => {
            showAlert(message, 'success');
            setTimeout(() => {
                window.location.href = '/login'; // Redirect to login page after successful registration
            }, 1500);
        })
        .catch(error => {
            showAlert(error.message, 'error');
        });
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
