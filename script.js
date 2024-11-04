// Function to display a greeting when the page loads
window.onload = () => {
    alert("Welcome to ATOA Fashion! We Are Sorry! This page is under maintenance.");
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
