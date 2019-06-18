"use strict";
jQuery(document).ready(function($) {
  // Window on load
  $(window).on("load", function() {
    if (Services.is(".slider__main")) {
      $(".slider__main").owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        responsive: {
          0: {
            items: 1
          },
          600: {
            items: 3
          },
          1000: {
            items: 5
          }
        }
      });
    }
  });
});
