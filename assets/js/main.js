(function() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('navMenu');
  const yearSpan = document.getElementById('year');
  const heroBg = document.querySelector('.hero-bg');
  const siteHeader = document.querySelector('.site-header');

  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  if (navToggle && navMenu) {
    function closeMenu() {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('body--no-scroll');
    }

    function openMenu() {
      navMenu.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('body--no-scroll');
    }

    navToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (navMenu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        closeMenu();
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (navMenu.classList.contains('open')) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
          closeMenu();
        }
      }
    });
  }

  // Smooth scroll for same-page links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const el = document.querySelector(targetId);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
    });
  });

  // Reveal on scroll
  const animated = document.querySelectorAll('[data-animate]');
  if (animated.length > 0) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);

          // Stagger children for richer effect
          const children = entry.target.querySelectorAll('.card, .gallery-item, .testimonial, .chips span, .badges li');
          children.forEach((el, idx) => {
            el.style.transition = 'opacity .6s ease, transform .6s ease';
            el.style.opacity = '0';
            el.style.transform = 'translateY(12px)';
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, 60 * idx);
          });
        }
      });
    }, { threshold: 0.15 });
    animated.forEach((el) => io.observe(el));
  }

  // Parallax hero background
  if (heroBg) {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      heroBg.style.transform = `translate3d(0, ${Math.min(y * 0.2, 80)}px, 0)`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Lightbox for gallery
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox ? lightbox.querySelector('.lightbox-image') : null;
  const lbCap = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
  const lbClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

  function openLightbox(src, caption) {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    if (lbCap) lbCap.textContent = caption || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  if (lightbox && lbClose) {
    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  }
  document.querySelectorAll('[data-lightbox]').forEach((img) => {
    img.addEventListener('click', () => openLightbox(img.src, img.closest('figure')?.querySelector('figcaption')?.textContent));
  });

  // Testimonial carousel - Infinite scroll
  const slider = document.querySelector('.testimonial-slider');
  if (slider) {
    const track = slider.querySelector('.testimonial-track');
    const slides = Array.from(slider.querySelectorAll('.testimonial-slide'));
    
    // Duplicate slides for seamless loop
    if (slides.length > 0) {
      slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        track.appendChild(clone);
      });
    }

    // Adjust animation speed based on number of slides (faster)
    const totalSlides = slides.length * 2;
    const animationDuration = totalSlides * 0.5; // 0.5 seconds per slide for very fast movement
    // Only set if not already set by CSS media queries
    if (!track.style.animationDuration || track.style.animationDuration === '') {
      track.style.animationDuration = `${animationDuration}s`;
    }
  }

  // Subtle tilt on cards (desktop only)
  const cards = document.querySelectorAll('.cards .card');
  if (cards.length && window.matchMedia('(pointer:fine)').matches) {
    const maxTilt = 6; // degrees
    cards.forEach((card) => {
      let frame;
      function onMove(e) {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width; // 0..1
        const y = (e.clientY - rect.top) / rect.height; // 0..1
        const tiltX = (maxTilt / 2 - x * maxTilt).toFixed(2);
        const tiltY = (y * maxTilt - maxTilt / 2).toFixed(2);
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          card.style.transform = `rotateX(${tiltY}deg) rotateY(${tiltX}deg) translateY(-2px)`;
        });
      }
      function onLeave() {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          card.style.transform = '';
        });
      }
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
  }
  // Header shrink on scroll
  const handleHeaderScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (!siteHeader) return;
    if (y > 10) siteHeader.classList.add('scrolled');
    else siteHeader.classList.remove('scrolled');
  };
  handleHeaderScroll();
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // Ensure all images lazy-load for mobile performance
  document.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    img.decoding = 'async';
  });

  // Zones expand/collapse
  const zonesToggle = document.querySelector('.zones-toggle');
  const chipsMore = document.querySelector('.chips-more');
  if (zonesToggle && chipsMore) {
    zonesToggle.addEventListener('click', function() {
      const isExpanded = chipsMore.style.display === 'flex' || window.getComputedStyle(chipsMore).display === 'flex';
      if (isExpanded) {
        chipsMore.style.display = 'none';
        this.textContent = 'Ver más zonas...';
      } else {
        chipsMore.style.display = 'flex';
        this.textContent = 'Ver menos zonas';
      }
    });
  }

  // Contact form submission
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const formMessage = document.getElementById('form-message');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault(); // Prevent default form submission
      
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
      formMessage.style.display = 'none';
      
      // Get form data
      const formData = new FormData(contactForm);
      
      // Send form data using fetch
      fetch('https://formsubmit.co/info@pavimentogirona.com', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          // Form submitted successfully
          contactForm.reset();
          formMessage.style.display = 'block';
          formMessage.className = 'form-message form-message-success';
          formMessage.innerHTML = '<strong>¡Formulario enviado correctamente!</strong><br>Te responderemos en menos de 24 horas.';
          
          // Reset button
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
          
          // Scroll to message
          formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          throw new Error('Error al enviar el formulario');
        }
      })
      .catch(error => {
        // Show error message
        formMessage.style.display = 'block';
        formMessage.className = 'form-message form-message-error';
        formMessage.innerHTML = '<strong>Error al enviar el formulario.</strong><br>Por favor, intenta de nuevo o contáctanos por WhatsApp.';
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      });
    });
  }
})();


