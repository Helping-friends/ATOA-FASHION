// Function to display a greeting when the page loads
window.onload = () => {
    alert("Welcome to ATOA Fashion! We Are Sorry! This page is under maintenance. But we will be back soon");
}
window.onload = () => {
    alert("Please visit us back!!")
}

// Function to change the text color of links when hovered over
const links = document.querySelectorAll('a');
if (links.length) {
    links.forEach(link => {
        link.addEventListener('mouseover', () => {
            link.style.color = 'blue';  // Change text color to blue when hovered over
        });

        link.addEventListener('mouseout', () => {
            link.style.color = 'black';  // Revert to original color when the mouse moves away
        });
    });
}

// Function to dynamically update the banner size based on screen size
const bannerImage = document.querySelector('.banner img');
function resizeBanner() {
    if (window.innerWidth < 600) {
        bannerImage.style.width = "100%";
    } else {
        bannerImage.style.width = "90%";
    }
}
window.onresize = resizeBanner;
resizeBanner();  // Call the function on page load to set the banner size

// Cart Icon Counter Update
let cartItemsCount = 3;  // You can update this count dynamically later
const cartIcon = document.querySelector('.cart-icon');

function updateCartCount(count) {
    let cartBadge = document.querySelector('.cart-badge');
    if (!cartBadge) {
        cartBadge = document.createElement('span');
        cartBadge.classList.add('cart-badge');
        cartIcon.appendChild(cartBadge);
    }
    cartBadge.textContent = count;  // Update the cart count display
}

updateCartCount(cartItemsCount);  // Initial call to show the cart count

// Check if user is logged in
const user = JSON.parse(sessionStorage.getItem('user'));
const loginLink = document.getElementById('login-link');
const logoutBtn = document.querySelector('.header-right'); // Updated selector

if (user) {
    // User is logged in
    loginLink.style.display = 'none'; // Hide login link
    
    // Add logout button if it doesn't exist
    if (!document.getElementById('logout-btn')) {
        const logoutButton = document.createElement('button');
        logoutButton.id = 'logout-btn';
        logoutButton.textContent = 'Logout';
        logoutButton.className = 'logout-btn';
        logoutButton.style.cssText = `
            padding: 8px 16px;
            background-color: #ff4444;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 10px;
        `;
        
        // Add hover effect
        logoutButton.onmouseover = () => {
            logoutButton.style.backgroundColor = '#cc0000';
        };
        logoutButton.onmouseout = () => {
            logoutButton.style.backgroundColor = '#ff4444';
        };
        
        // Add logout functionality
        logoutButton.addEventListener('click', () => {
            // Clear session storage
            sessionStorage.removeItem('user');
            
            // Show a logout message
            alert('You have been successfully logged out!');
            
            // Redirect to home page or login page
            window.location.href = '/login.html';
        });
        
        logoutBtn.appendChild(logoutButton);
    }
} else {
    // User is not logged in
    if (loginLink) {
        loginLink.style.display = 'block'; // Show login link
    }
    // Remove logout button if it exists
    const existingLogoutBtn = document.getElementById('logout-btn');
    if (existingLogoutBtn) {
        existingLogoutBtn.remove();
    }
}

// Add event listener for page load to check login status
window.addEventListener('load', () => {
    // Check if user is logged in
    const user = JSON.parse(sessionStorage.getItem('user'));
    const headerRight = document.querySelector('.header-right');
    
    if (user) {
        // Update header to show user info
        const userInfo = document.createElement('span');
        userInfo.className = 'user-info';
        userInfo.style.cssText = `
            margin-right: 15px;
            color: #333;
            font-size: 14px;
        `;
        userInfo.textContent = `Welcome, ${user.name}`;
        headerRight.insertBefore(userInfo, headerRight.firstChild);
    }
});