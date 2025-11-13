document.addEventListener("DOMContentLoaded", () => {
  // Define the mobile screen width breakpoint
  const MOBILE_BREAKPOINT = 768;

  // Select all list items (category links) that trigger the hover effect
  const listItems = document.querySelectorAll(".text-links li");

  // Select the image element that displays the preview
  const hoverImage = document.getElementById("hoverImage");

  // Store the initial/default image source for reverting on mouseleave
  const defaultImageSrc = hoverImage ? hoverImage.src : null;

  // Utility function to check if the current view is mobile
  const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;

  // --- Main Controller Function ---
  // Toggles between desktop hover and mobile slideshow functionality
  const checkAndToggleFeatures = () => {
    if (isMobile()) {
      // MOBILE LOGIC: Activate Slideshow and Disable Hover

      // 1. Initialize the background slideshow script
      if (typeof cbpBS !== "undefined" && typeof cbpBS.init === "function") {
        // Assuming cbpBS is the global variable for your slideshow script
        // Note: The HTML already has an $(function(){ cbpBGSlideshow.init(); }); call,
        // this is for re-initialization if needed.
        // cbpBS.init();
      }

      // 2. Disable cursor/hover effect and clean up any desktop-specific text
      listItems.forEach((item) => {
        const linkElement = item.querySelector("a");
        if (!linkElement) return;

        item.style.cursor = "default";

        // Reset the link text content to the original category name
        linkElement.textContent =
          linkElement.getAttribute("data-original-text") ||
          linkElement.textContent;
      });
    } else {
      // DESKTOP LOGIC: Enable Hover Effect
      setupDesktopHover();

      // Placeholder for optional code to stop the slideshow on desktop
    }
  };

  // --- Desktop Hover Functionality Setup ---
  // Attaches mouse event listeners to list items for image and text swap
  const setupDesktopHover = () => {
    listItems.forEach((item) => {
      const linkElement = item.querySelector("a");
      if (!linkElement) return;

      // Store original link text content once for reverting later
      if (!linkElement.getAttribute("data-original-text")) {
        linkElement.setAttribute("data-original-text", linkElement.textContent);
      }
      const originalText = linkElement.getAttribute("data-original-text");

      // Retrieve the desired image file name from the data attribute
      const imageFileName = item.dataset.image;

      // Ensure cursor is pointer for desktop interaction
      item.style.cursor = "pointer";

      // Clear previous event listeners (crucial for window resize handling)
      item.onmouseenter = null;
      item.onmouseleave = null;

      // Apply new **mouseenter** listener to swap the image source and link text
      item.onmouseenter = () => {
        if (!isMobile() && hoverImage) {
          hoverImage.src = imageFileName;
          // Change the link text to the image file name
          linkElement.textContent = imageFileName;
        }
      };

      // Apply new **mouseleave** listener to revert the image source and link text
      item.onmouseleave = () => {
        if (!isMobile() && hoverImage) {
          hoverImage.src = defaultImageSrc;
          // Revert the link text to the original category name
          linkElement.textContent = originalText;
        }
      };
    });
  };

  // --- Initial Call and Resize Listener ---
  // Run the check on initial page load
  checkAndToggleFeatures();

  let resizeTimeout;
  // Listen for window resize to switch between mobile and desktop features
  window.addEventListener("resize", () => {
    // Debounce the resize event for better performance
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(checkAndToggleFeatures, 200);
  });
});
