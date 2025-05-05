// script.js

document.addEventListener('DOMContentLoaded', () => {
  // 1) Grab your filter menu items and the original slides
  const menuItems = document.querySelectorAll('.portfolio-menu .menu-item');
  const originalSlides = Array.from(document.querySelectorAll('.swiper-slide'))
    .map(slide => ({ html: slide.outerHTML, category: slide.dataset.category }));

  // 2) Initialize Swiper with autoplay
  const swiper = new Swiper('.swiper-container', {
    loop: true,
    spaceBetween: 20,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    slidesPerView: 1,
    breakpoints: {
      640:  { slidesPerView: 1 },
      768:  { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  });

  // 3) Auto-play / pause video slides
  swiper.on('slideChangeTransitionEnd', () => {
    document.querySelectorAll('.swiper-slide video').forEach((vid, idx) => {
      if (idx === swiper.realIndex) {
        vid.muted = true;
        vid.play().catch(() => {});
      } else {
        vid.pause();
        vid.currentTime = 0;
      }
    });
  });

  // ── Helper to apply a filter programmatically ──
  function applyFilter(filter) {
    // a) Toggle the active class on menu items
    menuItems.forEach(mi =>
      mi.classList.toggle('active', mi.dataset.filter === filter)
    );

    // b) Build the slide HTML array for this filter
    const slidesToShow = filter === 'all'
      ? originalSlides.map(s => s.html)
      : originalSlides
          .filter(s => s.category === filter)
          .map(s => s.html);

    // c) Rebuild the Swiper carousel
    swiper.loopDestroy();         // destroy loop mode
    swiper.removeAllSlides();     // remove all current slides
    swiper.appendSlide(slidesToShow); // append filtered slides
    swiper.loopCreate();          // recreate loop clones
    swiper.slideTo(0);            // go back to the first slide
  }

  // 4) Wire up click handlers for the menu items
  menuItems.forEach(item => {
    item.addEventListener('click', () => applyFilter(item.dataset.filter));
  });

  // 5) On initial load, show only the "restaurant" category
  applyFilter('restaurant');

  // 6) Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
  });
});
