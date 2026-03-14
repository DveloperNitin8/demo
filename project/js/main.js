document.addEventListener("DOMContentLoaded", () => {
    // Navbar Scroll Effect
    const navbar = document.getElementById("navbar");
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 20) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById("mobile-toggle");
    if (mobileToggle && navbar) {
        mobileToggle.addEventListener("click", () => {
            mobileToggle.classList.toggle("active");
            navbar.classList.toggle("active-mobile-menu");
        });
    }

    // Subtle animations on scroll (Intersection Observer)
    const fadeElements = document.querySelectorAll('.feature-card, .cta-card');
    
    if ('IntersectionObserver' in window && fadeElements.length > 0) {
        const appearOptions = {
            threshold: 0,
            rootMargin: "0px 0px -50px 0px"
        };
        
        // Initial setup for cards to slide up
        fadeElements.forEach(el => {
            el.style.opacity = "0";
            el.style.transform = "translateY(30px)";
            el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
        });

        const appearOnScroll = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            });
        }, appearOptions);

        fadeElements.forEach(el => {
            appearOnScroll.observe(el);
        });
    } else {
        // Fallback
        fadeElements.forEach(el => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        });
    }
});
