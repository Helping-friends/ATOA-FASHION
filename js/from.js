document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');
    const alertBox = document.querySelector('.alert-box');
    const alertMsg = document.querySelector('.alert');

    // Check if user is already logged in
    if (sessionStorage.getItem('name')) {
        window.location.href = '/';
    }

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Determine if it's login or register
        const isLogin = !form.querySelector('.name');
        const endpoint = isLogin ? '/login-user' : '/register-user';

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alertBox.classList.add('error');
                alertMsg.textContent = data.error;
            } else {
                alertBox.classList.add('success');
                alertMsg.textContent = 'Success! Redirecting...';
                sessionStorage.setItem('name', data.name);
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            }
        })
        .catch(err => {
            alertBox.classList.add('error');
            alertMsg.textContent = 'An error occurred. Please try again.';
        });
    });
});