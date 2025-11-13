document.addEventListener("DOMContentLoaded", () => {
  // --- BACK TO TOP FUNCTIONALITY ---

  // 1. Get the button element
  const backToTopButton = document.querySelector(".back-to-top");

  // 2. Add scroll event listener to the window to control button visibility
  window.addEventListener("scroll", () => {
    // Check if the user has scrolled down past the 50px threshold
    if (window.scrollY > 50) {
      // Show the button (adds the .show class)
      backToTopButton.classList.add("show");
    } else {
      // Hide the button (removes the .show class)
      backToTopButton.classList.remove("show");
    }
  });

  // 3. Add click event listener to handle smooth scrolling
  backToTopButton.addEventListener("click", (e) => {
    // Prevent the default link behavior (prevents instant jump to the top)
    e.preventDefault();

    // Scroll the viewport to the top (0) with a smooth animation
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
