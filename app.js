document.addEventListener("DOMContentLoaded", () => {
    // 1. Scroll Spy - Highlight Active Menu Item
    const navLinks = document.querySelectorAll(".site-nav nav a");
    const sections = document.querySelectorAll("section[id]");

    const scrollSpy = () => {
        let currentId = "home";
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentId = section.getAttribute("id");
            }
        });

        // Map sub-sections to main nav links
        if (currentId === "pack") currentId = "story";
        if (currentId === "streets") currentId = "initiative";

        navLinks.forEach(link => {
            const href = link.getAttribute("href");
            if (href === `#${currentId}`) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    };

    window.addEventListener("scroll", scrollSpy, { passive: true });
    window.addEventListener("resize", scrollSpy);
    scrollSpy();

    // 2. IntersectionObserver for scroll animations
    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    });

    animatedElements.forEach(el => scrollObserver.observe(el));

    // 3. Counter Animation for all counters (.counter-animate, .counter-streets, #counter)
    const counters = document.querySelectorAll(".counter-animate, .counter-streets, #counter");
    counters.forEach(counter => {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(counter.getAttribute("data-target"), 10) || 0;
                    let current = 0;
                    const duration = 2000; // 2 seconds
                    const frameDuration = 1000 / 60; // 60fps
                    const totalFrames = Math.round(duration / frameDuration);
                    const increment = target / totalFrames;
                    let frame = 0;

                    const animateCounter = () => {
                        frame++;
                        current = increment * frame;
                        if (frame < totalFrames) {
                            counter.textContent = Math.floor(current).toLocaleString();
                            requestAnimationFrame(animateCounter);
                        } else {
                            counter.textContent = target.toLocaleString();
                        }
                    };

                    animateCounter();
                    counterObserver.unobserve(counter);
                }
            });
        }, {
            threshold: 0.2
        });
        counterObserver.observe(counter);
    });

    // 4. Shop Section - Tab Switching logic
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");

            // Toggle button active class
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Toggle panels display with fade transition
            tabPanels.forEach(panel => {
                if (panel.id === targetTab) {
                    panel.classList.add("active");
                    // Trigger scroll animations for items in newly visible panel
                    const panelAnimateItems = panel.querySelectorAll(".animate-on-scroll");
                    panelAnimateItems.forEach(item => {
                        // Small delay to ensure display: grid renders first
                        setTimeout(() => {
                            item.classList.add("visible");
                        }, 50);
                    });
                } else {
                    panel.classList.remove("active");
                }
            });
        });
    });

    // 5. Hero Floating Illustration Parallax Effect on Scroll
    const floatingIllustrations = document.querySelectorAll(".floating-illustration");
    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;
        // Only apply parallax if screen width is larger than mobile (floating images hidden on mobile anyway)
        if (window.innerWidth > 900) {
            floatingIllustrations.forEach((el, index) => {
                // Different speeds for background depth
                const speed = (index + 1) * 0.08;
                const direction = index % 2 === 0 ? 1 : -1;
                // Move elements slightly up or down relative to scroll
                el.style.transform = `translateY(${scrollY * speed * direction}px)`;
            });
        }
    }, { passive: true });

    // 6. Lightbox Modal logic
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxClose = document.querySelector(".lightbox-close");

    // Select all triggerable images (product cards, illustrations, events, profile pictures)
    const triggerImages = document.querySelectorAll(
        ".product-card img, .illustration-card img, .event-photo-wrapper img, .pack-card img, .story-frame img"
    );

    triggerImages.forEach(img => {
        img.style.cursor = "zoom-in";
        img.addEventListener("click", () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.style.display = "block";
            document.body.style.overflow = "hidden"; // Prevent background scroll
        });
    });

    const closeLightbox = () => {
        lightbox.style.display = "none";
        document.body.style.overflow = ""; // Re-enable scroll
    };

    if (lightboxClose) {
        lightboxClose.addEventListener("click", closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeLightbox();
        }
    });

    // 7. Contact Form Simulation
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("form-name").value;
            alert(`Thank you, ${name}! Your message has been simulated successfully. Pawshu will get back to you soon!`);
            contactForm.reset();
        });
    }
});
