document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERENCES ---
    const galleryImages = document.querySelectorAll(".gallery-container img");
    const lightboxOverlay = document.getElementById("lightbox-overlay");
    const lightboxImage = document.getElementById("lightbox-image");
    const prevButton = document.getElementById("lightbox-prev");
    const nextButton = document.getElementById("lightbox-next");
    const backToTopButton = document.querySelector(".back-to-top");
    // Ensure the indicator has the ID 'swipe-indicator' in your HTML
    const swipeIndicator = document.getElementById("swipe-indicator"); 

    // --- STATE VARIABLES ---
    let currentIndex = 0;

    // --- CRITICAL TOUCH GESTURE VARIABLES ---
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50; // Minimum distance (pixels) for a swipe
    const tapThreshold = 5; // Minimal movement (pixels) to prevent default page scroll
    let touchStartTime = 0;
    const swipeMinTime = 100; // Minimum duration (ms) for a recognized swipe (to filter fast taps)

    // --- CORE IMAGE UPDATE LOGIC (NEW/MODIFIED) ---

    function updateLightboxImage() {
    // 1. Get the high-res source path
    const highResSrc = galleryImages[currentIndex].getAttribute('data-lightbox-src');
    
    // Determine the source to use (high-res or thumbnail fallback)
    const newSrc = highResSrc || galleryImages[currentIndex].src;
    
    // 2. Hide the current lightbox image immediately
    //    We use opacity here for a smoother visual hide/show.
    lightboxImage.style.opacity = '0';
    
    // 3. Create a temporary image element for preloading
    const tempImg = new Image();
    
    // 4. Set the new image's source to the temporary element
    tempImg.src = newSrc;

    // 5. Wait for the new image to fully load in the temporary element
    tempImg.onload = function() {
        // Once loaded:
        
        // a. Set the lightbox's source to the pre-loaded source
        lightboxImage.src = newSrc;
        
        // b. Make the lightbox image visible again (instant transition)
        lightboxImage.style.opacity = '1';
    };
    
    // 6. Handle potential load errors (optional but recommended)
    tempImg.onerror = function() {
        console.error("Error loading image:", newSrc);
        // Fallback action, e.g., show a default image or close the lightbox
        lightboxImage.style.opacity = '1'; // Show whatever image is currently loaded
    };
}


    // --- LIGHTBOX CONTROL FUNCTIONS ---

    function closeLightbox() {
        lightboxOverlay.style.display = "none";
        document.body.classList.remove("no-scroll"); // Restore scrolling

        // 1. Clean up swipe indicator state
        if (swipeIndicator) {
            swipeIndicator.classList.remove("animate-once"); // Ensure CSS class is removed
            swipeIndicator.style.opacity = '0'; // Ensure it's fully hidden
        }

        // 2. Manage 'Back to Top' button visibility after closing
        if (window.scrollY > 200) {
            backToTopButton.classList.add("show");
        }
    }

    function openLightbox(index) {
        currentIndex = index;
        updateLightboxImage(); // Load the correct high-res image

        lightboxOverlay.style.display = "flex";
        document.body.classList.add("no-scroll"); // Lock page scroll
        backToTopButton.classList.remove("show");

        // --- Swipe Indicator Animation Logic (NEW/MODIFIED) ---
        if (window.innerWidth <= 768 && swipeIndicator) {
        // 1. Reset state
        swipeIndicator.classList.remove('animate-once');
        swipeIndicator.style.opacity = '0';
        
        // 2. Start animation after a slight delay (500ms)
        setTimeout(() => {
            // Use the standardized class name: animate-once
            swipeIndicator.classList.add('animate-once'); 
            
            // 3. Set a timeout to clean up after the animation duration (MUST match CSS)
            //    Using 4000ms, so make sure CSS duration is 4s.
            const animationDurationMs = 4000; 
            
            setTimeout(() => {
                // Final cleanup after the animation runs its course
                swipeIndicator.classList.remove('animate-once');
                swipeIndicator.style.opacity = '0';
            }, animationDurationMs); 
        }, 500);
    }
    }

    // --- NAVIGATION FUNCTIONS (MODIFIED to use updateLightboxImage) ---

    function showPrevImage() {
        currentIndex =
            (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        updateLightboxImage();
    }

    // --- EVENT LISTENERS ---

    // 1. Open lightbox when a gallery image is clicked
    galleryImages.forEach((img, index) => {
        img.addEventListener("click", () => {
            openLightbox(index);
        });
    });

    // 2. Close lightbox when clicking the background overlay (Bubble Phase)
    lightboxOverlay.addEventListener(
        "click",
        (e) => {
            // Only close if the click target is the overlay itself
            if (e.target === lightboxOverlay) { 
                closeLightbox();
            }
        },
        false // Runs in the standard Bubble Phase
    );

    // 3. Navigation (Desktop Click/Keyboard)
    prevButton.addEventListener("click", showPrevImage);
    nextButton.addEventListener("click", showNextImage);
    document.addEventListener("keydown", (e) => {
        if (lightboxOverlay.style.display === "flex") {
            if (e.key === "ArrowLeft") {
                showPrevImage();
            } else if (e.key === "ArrowRight") {
                showNextImage();
            } else if (e.key === "Escape") {
                closeLightbox();
            }
        }
    });

    // 4. MOBILE SWIPE NAVIGATION
    lightboxOverlay.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        touchStartTime = Date.now();
    });

    lightboxOverlay.addEventListener("touchmove", (e) => {
        touchEndY = e.touches[0].clientY;
        touchEndX = e.touches[0].clientX;
        const deltaY = Math.abs(touchStartY - touchEndY);

        // Prevent page scroll only if movement is intentional (above tap threshold)
        if (deltaY > tapThreshold) {
            e.preventDefault();
        }
    });

    lightboxOverlay.addEventListener("touchend", () => {
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - touchStartTime;

        const swipeDistance = touchStartY - touchEndY;
        const absoluteSwipeDistance = Math.abs(swipeDistance);
        const deltaX = Math.abs(touchStartX - touchEndX);
        const isMostlyVertical = deltaX < absoluteSwipeDistance; 

        // --- CRITICAL CHECK FOR SWIPE VALIDATION ---
        const isValidSwipe =
            absoluteSwipeDistance >= swipeThreshold &&
            isMostlyVertical && 
            touchDuration >= swipeMinTime;

        // Reset touch variables
        touchStartY = 0;
        touchEndY = 0;
        touchStartX = 0;
        touchEndX = 0;
        touchStartTime = 0;

        if (isValidSwipe) {
            if (swipeDistance > 0) {
                // Swipe Up -> NEXT IMAGE
                showNextImage();
            } else {
                // Swipe Down -> PREVIOUS IMAGE
                showPrevImage();
            }
        }
    });

    // 5. BACK TO TOP Functionality (Scroll & Click)
    window.addEventListener("scroll", () => {
        if (window.scrollY > 200) {
            backToTopButton.classList.add("show");
        } else {
            backToTopButton.classList.remove("show");
        }
    });

    backToTopButton.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });

    // 6. FINAL GHOST CLICK CANCELLATION (Capture Phase)
    lightboxOverlay.addEventListener(
        "click",
        (e) => {
            if (e.target === lightboxImage || e.target.closest(".lightbox-content")) {
                e.preventDefault();
                e.stopPropagation();
            }
        },
        true // Runs in the CAPTURE phase
    );
});