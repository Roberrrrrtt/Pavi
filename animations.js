window.onscroll = function () { scrollFunction(); animateOnScroll(); };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.querySelector(".contact-buttons").classList.add("sticky");
    } else {
        document.querySelector(".contact-buttons").classList.remove("sticky");
    }
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in, .slide-in, .zoom-in');
    const windowHeight = window.innerHeight;

    elements.forEach(element => {
        const position = element.getBoundingClientRect().top;
        if (position < windowHeight - 50) {
            element.style.opacity = 1;
            element.style.transform = 'translateY(0)';
        }
    });
}

document.addEventListener('DOMContentLoaded', animateOnScroll);
