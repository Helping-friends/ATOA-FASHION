// script.js

// Function to display a greeting when the page loads
window.onload = function() {
    alert("Welcome to ATOA Fashion!");
}

// Function to change the text color of links when hovered over
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('mouseover', function() {
        this.style.color = 'blue';  // Change text color to blue when hovered over
    });

    link.addEventListener('mouseout', function() {
        this.style.color = 'black';  // Revert to original color when the mouse moves away
    });
});

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

