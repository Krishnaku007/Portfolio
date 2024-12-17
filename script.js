let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');


menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');


        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        };
    });

    let header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 100);

    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};

// script.js

document.addEventListener("DOMContentLoaded", function() {
    const smokeContainer = document.getElementById('smoke-container');
    
    function createSmoke() {
        const smoke = document.createElement('div');
        smoke.className = 'smoke';
        
        // Randomize initial position
        smoke.style.left = Math.random() * window.innerWidth + 'px';
        
        // Append to container
        smokeContainer.appendChild(smoke);
        
        // Remove the smoke after animation ends
        setTimeout(() => {
            smokeContainer.removeChild(smoke);
        }, 5000); // Should match the animation duration
    }
    
    // Create smoke at intervals
    setInterval(createSmoke, 200); // Adjust the interval as needed
});
