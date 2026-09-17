/**
 * Agreed Coding Standards in Extreme Programming
 * Presentation Controller (Slide Deck & Reading Mode)
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  let currentSlide = 1;

  const progressBar = document.getElementById('progressBar');
  const slideCounter = document.getElementById('slideCounter');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const slideIndicators = document.getElementById('slideIndicators');
  const viewToggleBtn = document.getElementById('viewToggleBtn');
  const notesToggleBtn = document.getElementById('notesToggleBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const notesModal = document.getElementById('notesModal');
  const notesBody = document.getElementById('notesBody');
  const notesSlideNumber = document.getElementById('notesSlideNumber');

  let isSummaryMode = false;
  let touchStartX = 0;
  let touchEndX = 0;

  // Initialize Indicators
  function initIndicators() {
    slideIndicators.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `indicator-dot ${idx === 0 ? 'active' : ''}`;
      dot.title = `Ir a diapositiva ${idx + 1}`;
      dot.addEventListener('click', () => goToSlide(idx + 1));
      slideIndicators.appendChild(dot);
    });
  }

  // Update Speaker Notes
  function updateNotes(slideIndex) {
    const activeSlide = document.getElementById(`slide-${slideIndex}`);
    if (!activeSlide) return;

    const noteSource = activeSlide.querySelector('.speaker-note-source');
    if (noteSource && notesBody) {
      notesBody.innerHTML = noteSource.innerHTML;
      if (notesSlideNumber) notesSlideNumber.textContent = slideIndex;
    }
  }

  // Go to specific slide
  window.goToSlide = function(slideIndex) {
    if (slideIndex < 1) slideIndex = 1;
    if (slideIndex > totalSlides) slideIndex = totalSlides;

    currentSlide = slideIndex;

    slides.forEach((slide, idx) => {
      if (idx + 1 === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update Indicators
    const dots = document.querySelectorAll('.indicator-dot');
    dots.forEach((dot, idx) => {
      if (idx + 1 === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update Progress Bar & Counter
    const progressPercent = (currentSlide / totalSlides) * 100;
    if (progressBar) progressBar.style.width = `${progressPercent}%`;
    if (slideCounter) slideCounter.textContent = `${currentSlide} / ${totalSlides}`;

    // Update Buttons State
    if (prevBtn) prevBtn.disabled = currentSlide === 1;
    if (nextBtn) nextBtn.disabled = currentSlide === totalSlides;

    // Update notes content
    updateNotes(currentSlide);

    // Update URL hash without jump
    history.replaceState(null, null, `#slide-${currentSlide}`);
  };

  window.nextSlide = function() {
    if (currentSlide < totalSlides) {
      goToSlide(currentSlide + 1);
    }
  };

  window.prevSlide = function() {
    if (currentSlide > 1) {
      goToSlide(currentSlide - 1);
    }
  };

  // Toggle Deck vs Summary Mode
  window.toggleViewMode = function() {
    isSummaryMode = !isSummaryMode;

    if (isSummaryMode) {
      document.body.classList.remove('deck-mode');
      document.body.classList.add('summary-mode');
      viewToggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        <span class="btn-text">Modo Diapositivas</span>
      `;
      // Scroll to current slide in view
      const target = document.getElementById(`slide-${currentSlide}`);
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 50);
      }
    } else {
      document.body.classList.remove('summary-mode');
      document.body.classList.add('deck-mode');
      viewToggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
        <span class="btn-text">Modo Lectura</span>
      `;
      goToSlide(currentSlide);
    }
  };

  // Speaker Notes Modal Toggle
  window.toggleNotes = function() {
    if (!notesModal) return;
    notesModal.classList.toggle('active');
    if (notesModal.classList.contains('active')) {
      updateNotes(currentSlide);
    }
  };

  // Fullscreen Toggle
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Error al activar pantalla completa: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // Interactive Diff Switcher
  window.switchDiff = function(type) {
    const tabNo = document.getElementById('tabNoStandard');
    const tabYes = document.getElementById('tabWithStandard');
    const diffBad = document.getElementById('diffBad');
    const diffGood = document.getElementById('diffGood');

    if (!tabNo || !tabYes || !diffBad || !diffGood) return;

    if (type === 'bad') {
      tabNo.classList.add('active');
      tabYes.classList.remove('active');
      diffBad.classList.remove('hidden');
      diffGood.classList.add('hidden');
    } else {
      tabYes.classList.add('active');
      tabNo.classList.remove('active');
      diffGood.classList.remove('hidden');
      diffBad.classList.add('hidden');
    }
  };

  // Keyboard Event Navigation
  document.addEventListener('keydown', (e) => {
    // Ignore keystrokes if focused in an input
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        nextSlide();
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        prevSlide();
        break;

      case 'Home':
        e.preventDefault();
        goToSlide(1);
        break;

      case 'End':
        e.preventDefault();
        goToSlide(totalSlides);
        break;

      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;

      case 'n':
      case 'N':
        e.preventDefault();
        toggleNotes();
        break;

      case 'm':
      case 'M':
      case 'v':
      case 'V':
        e.preventDefault();
        toggleViewMode();
        break;
    }
  });

  // Touch Navigation (Swiping on mobile/tablets)
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    if (isSummaryMode) return;
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
    }
  }

  // Button Listeners
  if (viewToggleBtn) viewToggleBtn.addEventListener('click', toggleViewMode);
  if (notesToggleBtn) notesToggleBtn.addEventListener('click', toggleNotes);
  if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);

  // Check URL hash on initial load
  function initFromHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#slide-')) {
      const num = parseInt(hash.replace('#slide-', ''), 10);
      if (!isNaN(num) && num >= 1 && num <= totalSlides) {
        return num;
      }
    }
    return 1;
  }

  // Bootstrap
  initIndicators();
  const initialSlide = initFromHash();
  goToSlide(initialSlide);
});
