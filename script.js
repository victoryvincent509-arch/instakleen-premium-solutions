(function () {
  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.querySelector(".main-nav");
  var navLinks = document.querySelectorAll(".main-nav a");

  function setActiveNavLink() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    if (path === "") path = "index.html";
    navLinks.forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === path || (path === "index.html" && (href === "index.html" || href === "./" || href === "/"))) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  function onScroll() {
    if (!header) return;
    var heroSection = document.querySelector(".hero-home");
    var heroHeight = heroSection ? heroSection.offsetHeight : 0;
    
    if (window.scrollY > 50) {
      header.classList.add("nav-scrolled");
      header.classList.add("scrolled");
    } else {
      header.classList.remove("nav-scrolled");
      header.classList.remove("scrolled");
    }
    
    if (heroSection && window.scrollY > heroHeight) {
      header.classList.add("nav-past-hero");
    } else if (!heroSection && window.scrollY > 0) {
      // For pages without hero section, use solid background immediately
      header.classList.add("nav-past-hero");
    } else {
      header.classList.remove("nav-past-hero");
    }
  }

  function closeNav() {
    if (!navToggle || !mainNav) return;
    navToggle.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("open");
    document.body.style.overflow = "";
  }

  function openNav() {
    if (!navToggle || !mainNav) return;
    navToggle.setAttribute("aria-expanded", "true");
    mainNav.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var expanded = navToggle.getAttribute("aria-expanded") === "true";
      if (expanded) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      closeNav();
    });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  setActiveNavLink();

  var fadeElements = document.querySelectorAll(".fade-in");
  if ("IntersectionObserver" in window && fadeElements.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -40px 0px", threshold: 0.1 }
    );
    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    fadeElements.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  var contactForm = document.getElementById("contact-form");
  var formSuccess = document.querySelector(".form-success");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (formSuccess) {
        formSuccess.classList.add("show");
      }
      contactForm.reset();
      setTimeout(function () {
        if (formSuccess) formSuccess.classList.remove("show");
      }, 6000);
    });
  }

  // Testimonials Carousel
  var testimonialsCarousel = document.querySelector(".testimonials-carousel");
  if (testimonialsCarousel) {
    var track = testimonialsCarousel.querySelector(".testimonials-track");
    var dotsContainer = testimonialsCarousel.querySelector(".testimonials-dots");
    var cards = Array.from(track.querySelectorAll(".testimonial-card"));
    var currentIndex = 0;
    var autoSlideInterval;
    var isDesktop = window.innerWidth >= 768;
    var cardsPerView = isDesktop ? 2 : 1;

    // Generate dots dynamically
    cards.forEach(function (_, index) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "testimonial-dot";
      dot.setAttribute("data-index", index);
      dot.setAttribute("aria-label", "View testimonial " + (index + 1));
      dotsContainer.appendChild(dot);
    });

    var dots = Array.from(dotsContainer.querySelectorAll(".testimonial-dot"));

    function updateCarousel() {
      cards.forEach(function (card, index) {
        if (isDesktop) {
          // Show 2 cards starting from currentIndex
          if (index >= currentIndex && index < currentIndex + cardsPerView) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        } else {
          // Show 1 card
          if (index === currentIndex) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        }
      });

      // Update dots - active dot corresponds to first visible card
      dots.forEach(function (dot, index) {
        if (index === currentIndex) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    }

    function nextSlide() {
      if (isDesktop) {
        currentIndex = (currentIndex + cardsPerView) % cards.length;
        if (currentIndex + cardsPerView > cards.length) {
          currentIndex = 0;
        }
      } else {
        currentIndex = (currentIndex + 1) % cards.length;
      }
      updateCarousel();
    }

    function goToSlide(index) {
      currentIndex = index;
      updateCarousel();
    }

    function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, 4000);
    }

    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }

    // Dot click handlers
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var index = parseInt(dot.getAttribute("data-index"));
        stopAutoSlide();
        goToSlide(index);
        startAutoSlide();
      });
    });

    // Touch/swipe support
    var touchStartX = 0;
    var touchEndX = 0;

    testimonialsCarousel.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoSlide();
    });

    testimonialsCarousel.addEventListener("touchend", function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoSlide();
    });

    function handleSwipe() {
      var swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        nextSlide();
      }
      if (touchEndX > touchStartX + swipeThreshold) {
        currentIndex = Math.max(0, currentIndex - 1);
        updateCarousel();
      }
    }

    // Handle resize
    window.addEventListener("resize", function () {
      isDesktop = window.innerWidth >= 768;
      cardsPerView = isDesktop ? 2 : 1;
      currentIndex = 0;
      updateCarousel();
    });

    // Initialize
    updateCarousel();
    startAutoSlide();
  }
})();
