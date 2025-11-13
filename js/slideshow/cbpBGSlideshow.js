/**
 * cbpBGSlideshow.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
var cbpBGSlideshow = (function () {
  var $slideshow = $("#cbp-bislideshow"),
    $items = $slideshow.children("li"),
    itemsCount = $items.length,
    $controls = $("#cbp-bicontrols"),
    navigation = {
      $navPrev: $controls.find("span.cbp-biprev"),
      $navNext: $controls.find("span.cbp-binext"),
      $navPlayPause: $controls.find("span.cbp-bipause"),
    },
    // current item´s index
    current = 0,
    // timeout
    slideshowtime,
    // true if the slideshow is active
    isSlideshowActive = true,
    // it takes 3.5 seconds to change the background image
    interval = 2400;

  function init(config) {
    // Preload images
    $slideshow.imagesLoaded(function () {
      // NEW: Apply responsive image logic
      applyResponsiveImages();
      // Attach a resize listener to re-apply if the user resizes the browser
      $(window).on("resize", function () {
        // Debounce resize to prevent too many calls
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(function () {
          applyResponsiveImages();
        }, 200);
      });

      if (Modernizr.backgroundsize) {
        $items.each(function () {
          var $item = $(this);
          // Ensure the correct (potentially mobile) image src is used here
          var imgSrc = $item.find("img").attr("src");
          $item.css("background-image", "url(" + imgSrc + ")");
        });
      } else {
        $slideshow.find("img").show();
        // for older browsers add fallback here (image size and centering)
      }

      current = Math.floor(Math.random() * itemsCount);

      // show first item
      $items.eq(current).css("opacity", 1);
      // initialize/bind the events
      initEvents();
      // start the slideshow
      startSlideshow();
    });
  }

  // NEW FUNCTION: Apply responsive images
  function applyResponsiveImages() {
    var isMobile = window.innerWidth < 768;

    $items.each(function () {
      var $img = $(this).find("img");
      var targetSrc = isMobile ? $img.data("mobile") : $img.data("desktop");

      // Set src only if not already set to avoid flickering
      if ($img.attr("src") !== targetSrc) {
        $img.attr("src", targetSrc);
      }

      // Update background image for Modernizr users
      if (Modernizr.backgroundsize) {
        $(this).css("background-image", "url(" + targetSrc + ")");
      }
    });
  }

  function initEvents() {
    navigation.$navPlayPause.on("click", function () {
      var $control = $(this);
      if ($control.hasClass("cbp-biplay")) {
        $control.removeClass("cbp-biplay").addClass("cbp-bipause");
        startSlideshow();
      } else {
        $control.removeClass("cbp-bipause").addClass("cbp-biplay");
        stopSlideshow();
      }
    });

    navigation.$navPrev.on("click", function () {
      navigate("prev");
      if (isSlideshowActive) {
        startSlideshow();
      }
    });
    navigation.$navNext.on("click", function () {
      navigate("next");
      if (isSlideshowActive) {
        startSlideshow();
      }
    });
  }

  function navigate(direction) {
    // current item
    var $oldItem = $items.eq(current);

    if (direction === "next") {
      current = current < itemsCount - 1 ? ++current : 0;
    } else if (direction === "prev") {
      current = current > 0 ? --current : itemsCount - 1;
    }

    // new item
    var $newItem = $items.eq(current);
    // show / hide items
    $oldItem.css("opacity", 0);
    $newItem.css("opacity", 1);
  }

  function startSlideshow() {
    isSlideshowActive = true;
    clearTimeout(slideshowtime);
    slideshowtime = setTimeout(function () {
      navigate("next");
      startSlideshow();
    }, interval);
  }

  function stopSlideshow() {
    isSlideshowActive = false;
    clearTimeout(slideshowtime);
  }

  return { init: init };
})();
