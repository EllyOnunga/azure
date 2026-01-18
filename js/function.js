(function ($) {
  "use strict";

  var $window = $(window);
  var $body = $("body");

  /* Preloader Effect */
  $window.on("load", function () {
    $(".preloader").fadeOut(600);
  });

  /* Sticky Header */
  if ($(".active-sticky-header").length) {
    $window.on("resize", function () {
      setHeaderHeight();
    });

    function setHeaderHeight() {
      $("header.main-header").css(
        "height",
        $("header .header-sticky").outerHeight()
      );
    }

    $window.on("scroll", function () {
      var fromTop = $(window).scrollTop();
      setHeaderHeight();
      var headerHeight = $("header .header-sticky").outerHeight();
      $("header .header-sticky").toggleClass(
        "hide",
        fromTop > headerHeight + 100
      );
      $("header .header-sticky").toggleClass("active", fromTop > 600);
    });
  }

  /* Slick Menu JS */
  $("#menu").slicknav({
    label: "",
    prependTo: ".responsive-menu",
  });

  if ($("a[href='#top']").length) {
    $(document).on("click", "a[href='#top']", function () {
      $("html, body").animate({ scrollTop: 0 }, "slow");
      return false;
    });

    $window.on("scroll", function () {
      if ($(window).scrollTop() > 300) {
        $(".scroll-to-top").addClass("active");
      } else {
        $(".scroll-to-top").removeClass("active");
      }

      var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var scrolled = (winScroll / height) * 100;
      $(".scroll-progress").css("width", scrolled + "%");
    });
  }

  /* testimonial Slider JS */
  if ($(".testimonial-slider").length) {
    const testimonial_slider = new Swiper(".testimonial-slider .swiper", {
      slidesPerView: 1,
      speed: 1000,
      spaceBetween: 60,
      loop: true,
      autoplay: {
        delay: 5000,
      },
      pagination: {
        el: ".testimonial-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".testimonial-button-next",
        prevEl: ".testimonial-button-prev",
      },
      breakpoints: {
        768: {
          slidesPerView: 1,
        },
        991: {
          slidesPerView: 1,
        },
      },
    });
  }

  /* Skill Bar */
  if ($(".skills-progress-bar").length) {
    $(".skills-progress-bar").waypoint(
      function () {
        $(".skillbar").each(function () {
          $(this)
            .find(".count-bar")
            .animate(
              {
                width: $(this).attr("data-percent"),
              },
              2000
            );
        });
      },
      {
        offset: "70%",
      }
    );
  }

  /* Youtube Background Video JS */
  if ($("#herovideo").length) {
    var myPlayer = $("#herovideo").YTPlayer();
  }

  /* Init Counter */
  if ($(".counter").length) {
    $(".counter").counterUp({ delay: 6, time: 3000 });
  }

  /* Image Reveal Animation */
  if ($(".reveal").length) {
    gsap.registerPlugin(ScrollTrigger);
    let revealContainers = document.querySelectorAll(".reveal");
    revealContainers.forEach((container) => {
      let image = container.querySelector("img");
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          toggleActions: "play none none none",
        },
      });
      tl.set(container, {
        autoAlpha: 1,
      });
      tl.from(container, 1, {
        xPercent: -100,
        ease: Power2.out,
      });
      tl.from(image, 1, {
        xPercent: 100,
        scale: 1,
        delay: -1,
        ease: Power2.out,
      });
    });
  }

  /* Text Effect Animation */
  if ($(".text-anime-style-1").length) {
    let staggerAmount = 0.05,
      translateXValue = 0,
      delayValue = 0.5,
      animatedTextElements = document.querySelectorAll(".text-anime-style-1");

    animatedTextElements.forEach((element) => {
      let animationSplitText = new SplitText(element, { type: "chars, words" });
      gsap.from(animationSplitText.words, {
        duration: 1,
        delay: delayValue,
        x: 20,
        autoAlpha: 0,
        stagger: staggerAmount,
        scrollTrigger: { trigger: element, start: "top 85%" },
      });
    });
  }

  if ($(".text-anime-style-2").length) {
    let staggerAmount = 0.03,
      translateXValue = 20,
      delayValue = 0.1,
      easeType = "power2.out",
      animatedTextElements = document.querySelectorAll(".text-anime-style-2");

    animatedTextElements.forEach((element) => {
      let animationSplitText = new SplitText(element, { type: "chars, words" });
      gsap.from(animationSplitText.chars, {
        duration: 1,
        delay: delayValue,
        x: translateXValue,
        autoAlpha: 0,
        stagger: staggerAmount,
        ease: easeType,
        scrollTrigger: { trigger: element, start: "top 85%" },
      });
    });
  }

  if ($(".text-anime-style-3").length) {
    let animatedTextElements = document.querySelectorAll(".text-anime-style-3");

    animatedTextElements.forEach((element) => {
      //Reset if needed
      if (element.animation) {
        element.animation.progress(1).kill();
        element.split.revert();
      }

      element.split = new SplitText(element, {
        type: "lines,words,chars",
        linesClass: "split-line",
      });
      gsap.set(element, { perspective: 400 });

      gsap.set(element.split.chars, {
        opacity: 0,
        x: "50",
      });

      element.animation = gsap.to(element.split.chars, {
        scrollTrigger: { trigger: element, start: "top 90%" },
        x: "0",
        y: "0",
        rotateX: "0",
        opacity: 1,
        duration: 1,
        ease: Back.easeOut,
        stagger: 0.02,
      });
    });
  }

  /* Parallaxie js */
  var $parallaxie = $(".parallaxie");
  if ($parallaxie.length && $window.width() > 991) {
    if ($window.width() > 768) {
      $parallaxie.parallaxie({
        speed: 0.55,
        offset: 0,
      });
    }
  }

  /* Zoom Gallery screenshot */
  $(".gallery-items").magnificPopup({
    delegate: "a",
    type: "image",
    closeOnContentClick: false,
    closeBtnInside: false,
    mainClass: "mfp-with-zoom",
    image: {
      verticalFit: true,
    },
    gallery: {
      enabled: true,
    },
    zoom: {
      enabled: true,
      duration: 300, // don't foget to change the duration also in CSS
      opener: function (element) {
        return element.find("img");
      },
    },
  });

  /* Formspree Configuration */
  // REPLACE THESE WITH YOUR ACTUAL FORMSPREE FORM IDs
  const FORMSPREE_IDS = {
    CONTACT: "xdaaebyq", // e.g., "xwqrqwqr"
    RESERVATION: "mzddeooe", // e.g., "mzazazaz"
    NEWSLETTER: "mgooaddz" // e.g., "qoqoqoQO"
  };

  /* Contact form validation */
  var $contactform = $("#contactForm");
  $contactform.validator({ focus: false }).on("submit", function (event) {
    if (!event.isDefaultPrevented()) {
      event.preventDefault();
      submitForm();
    }
  });

  function submitForm() {


    $.ajax({
      type: "POST",
      url: "https://formspree.io/f/" + FORMSPREE_IDS.CONTACT,
      data: $contactform.serialize(),
      dataType: "json",
      success: function (response) {
        formSuccess();
      },
      error: function (err) {
        submitMSG(false, "Did not connect to server.");
      }
    });
  }

  function formSuccess() {
    $contactform[0].reset();
    submitMSG(true, "Message Sent Successfully!");
  }

  function submitMSG(valid, msg) {
    if (valid) {
      var msgClasses = "h4 text-success";
    } else {
      var msgClasses = "h4 text-danger";
    }
    $("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
  }
  /* Contact form validation end */

  /* Appointment form validation */
  var $reserveForm = $("#reserveForm");
  $reserveForm.validator({ focus: false }).on("submit", function (event) {
    if (!event.isDefaultPrevented()) {
      event.preventDefault();
      submitreserveForm();
    }
  });

  function submitreserveForm() {


    $.ajax({
      type: "POST",
      url: "https://formspree.io/f/" + FORMSPREE_IDS.RESERVATION,
      data: $reserveForm.serialize(),
      dataType: "json",
      success: function (response) {
        reserveFormSuccess();
      },
      error: function (err) {
        appointmentsubmitMSG(false, "Did not connect to server.");
      }
    });
  }

  function reserveFormSuccess() {
    $reserveForm[0].reset();
    appointmentsubmitMSG(true, "Message Sent Successfully!");
  }

  function appointmentsubmitMSG(valid, msg) {
    if (valid) {
      var msgClasses = "h3 text-success";
    } else {
      var msgClasses = "h3 text-danger";
    }
    $("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
  }
  /* Appointment form validation end */

  /* Newsletter form validation */
  var $newsletterForm = $("#newslettersForm");
  if ($newsletterForm.length) {
    $newsletterForm.validator({ focus: false }).on("submit", function (event) {
      if (!event.isDefaultPrevented()) {
        event.preventDefault();
        submitNewsletterForm();
      }
    });
  }

  function submitNewsletterForm() {


    $.ajax({
      type: "POST",
      url: "https://formspree.io/f/" + FORMSPREE_IDS.NEWSLETTER,
      data: $newsletterForm.serialize(),
      dataType: "json",
      success: function (response) {
        newsletterFormSuccess();
      },
      error: function (err) {
        alert("Did not connect to server.");
      }
    });
  }

  function newsletterFormSuccess() {
    $newsletterForm[0].reset();
    alert("Subscribed Successfully!");
  }
  /* Newsletter form validation end */

  /* Animated Wow Js */
  new WOW().init();

  /* Popup Video */
  if ($(".popup-video").length) {
    $(".popup-video").magnificPopup({
      type: "iframe",
      mainClass: "mfp-fade",
      removalDelay: 160,
      preloader: false,
      fixedContentPos: true,
    });
  }

  /* Our Gallery (filtering) Start */
  $window.on("load", function () {
    if ($(".gallery-item-boxes").length) {
      /* Init Isotope */
      var $menuitem = $(".gallery-item-boxes").isotope({
        itemSelector: ".gallery-item-box",
        layoutMode: "masonry",
        masonry: {
          // use outer width of grid-sizer for columnWidth
          columnWidth: 1,
        },
      });

      /* Filter items on click */
      var $menudisesnav = $(".our-gallery-nav li a");
      $menudisesnav.on("click", function (e) {
        var filterValue = $(this).attr("data-filter");
        $menuitem.isotope({
          filter: filterValue,
        });

        $menudisesnav.removeClass("active-btn");
        $(this).addClass("active-btn");
        e.preventDefault();
      });
      $menuitem.isotope({ filter: "*" });
    }
  });
  /* Our Gallery (filtering) End */
})(jQuery);
