document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');
    const submitBtn = document.querySelector('.submit-btn');
    const alertBox = document.querySelector('.alert-box');
    const alertMsg = document.querySelector('.alert');
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner';
    loadingSpinner.style.display = 'none';
    submitBtn.parentNode.insertBefore(loadingSpinner, submitBtn.nextSibling);

    // Check if user is already logged in
    if (sessionStorage.getItem('user')) {
        window.location.href = '/';
    }

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        handleFormSubmission();
    });

    // Also handle button click for browsers where form submit might not work
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleFormSubmission();
    });

    async function handleFormSubmission() {
        // Disable submit button and show loading
        submitBtn.disabled = true;
        loadingSpinner.style.display = 'block';

        // Get form inputs
        const email = form.querySelector('.email').value.trim();
        const password = form.querySelector('.password').value;
        
        // For registration form
        const name = form.querySelector('.name')?.value.trim();

        try {
            // Basic validation
            if (!email || !password) {
                throw new Error('Please fill in all fields');
            }

            // Email validation
            if (!isValidEmail(email)) {
                throw new Error('Please enter a valid email');
            }

            // Password validation
            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            // Determine if it's login or register
            const isLogin = !form.querySelector('.name');
            
            if (isLogin) {
                await handleLogin(email, password);
            } else {
                if (!name) {
                    throw new Error('Please enter your name');
                }
                if (name.length < 2) {
                    throw new Error('Name must be at least 2 characters long');
                }
                await handleRegister(name, email, password);
            }
        } catch (error) {
            showAlert(error.message, 'error');
        } finally {
            // Re-enable submit button and hide loading
            submitBtn.disabled = false;
            loadingSpinner.style.display = 'none';
        }
    }

    async function handleLogin(email, password) {
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store user data and token
            sessionStorage.setItem('user', JSON.stringify({
                email: data.user.email,
                name: data.user.name,
                token: data.token
            }));

            showAlert('Login successful! Redirecting...', 'success');
            
            // Redirect after successful login
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);

        } catch (error) {
            throw new Error(error.message || 'Login failed. Please try again.');
        }
    }

    async function handleRegister(name, email, password) {
        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            showAlert('Registration successful! Please check your email to verify your account.', 'success');
            
            // Redirect to login page after successful registration
            setTimeout(() => {
                window.location.href = '/login';
            }, 3000);

        } catch (error) {
            throw new Error(error.message || 'Registration failed. Please try again.');
        }
    }

    function showAlert(message, type) {
        alertBox.className = `alert-box ${type}`;
        alertMsg.textContent = message;
        alertBox.style.display = 'block';

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                alertBox.style.display = 'none';
            }, 5000);
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Password visibility toggle
    const showPasswordCheckbox = document.getElementById('show-password');
    const passwordField = document.querySelector('.password');

    if (showPasswordCheckbox && passwordField) {
        showPasswordCheckbox.addEventListener('change', () => {
            passwordField.type = showPasswordCheckbox.checked ? 'text' : 'password';
        });
    }

    // Add password strength indicator
    const passwordStrengthIndicator = document.createElement('div');
    passwordStrengthIndicator.className = 'password-strength';
    if (passwordField) {
        passwordField.parentNode.insertBefore(passwordStrengthIndicator, passwordField.nextSibling);

        passwordField.addEventListener('input', () => {
            const strength = checkPasswordStrength(passwordField.value);
            updatePasswordStrength(strength);
        });
    }

    function checkPasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]+/)) strength++;
        if (password.match(/[A-Z]+/)) strength++;
        if (password.match(/[0-9]+/)) strength++;
        if (password.match(/[!@#$%^&*(),.?":{}|<>]+/)) strength++;

        return strength;
    }

    function updatePasswordStrength(strength) {
        const strengthTexts = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
        const strengthColors = ['#ff4444', '#ffbb33', '#ffbb33', '#00C851', '#007E33'];
        
        if (passwordField.value.length === 0) {
            passwordStrengthIndicator.style.display = 'none';
            return;
        }

        passwordStrengthIndicator.style.display = 'block';
        passwordStrengthIndicator.textContent = strengthTexts[strength - 1] || 'Very Weak';
        passwordStrengthIndicator.style.color = strengthColors[strength - 1] || strengthColors[0];
    }

    // Add some basic CSS for the loading spinner
    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner {
            width: 20px;
            height: 20px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #0D2B1D;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 10px auto;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .password-strength {
            font-size: 0.8em;
            margin-top: 5px;
            display: none;
        }

        .alert-box {
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
            display: none;
        }
    `;
    document.head.appendChild(style);
});