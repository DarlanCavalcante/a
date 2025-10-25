// Minimal site interactions for Alimentação Solidária
// - toggleMenu(): toggles navigation visibility on small screens
// - handleSubmit(event): validates and shows success message on the volunteer form

function toggleMenu() {
  try {
    const menu = document.getElementById('navMenu');
    if (!menu) return;

    // Toggle inline display to avoid relying on missing mobile CSS
    const currentlyHidden = menu.style.display === 'none';
    if (currentlyHidden) {
      menu.style.display = '';
    } else {
      menu.style.display = 'none';
    }
  } catch (e) {
    // no-op
  }
}

function handleSubmit(event) {
  try {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();

    const form = document.getElementById('volunteerForm');
    if (form) {
      if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
        // Let the browser show built-in validation messages
        if (typeof form.reportValidity === 'function') form.reportValidity();
        return false;
      }
    }

    const msg = document.getElementById('successMessage');
    if (msg) {
      msg.style.display = 'block';
      // Announce and focus for accessibility
      msg.setAttribute('role', 'status');
      msg.setAttribute('aria-live', 'polite');
      if (typeof msg.scrollIntoView === 'function') msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (form && typeof form.reset === 'function') form.reset();

    return false;
  } catch (e) {
    // Fallback: do nothing special
    return false;
  }
}

/* Carousel functionality for .carousel elements */
(function initCarousel(){
  const carousel = document.getElementById('mainCarousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const items = Array.from(carousel.querySelectorAll('.carousel-item'));
  const prev = carousel.querySelector('.carousel-control.prev');
  const next = carousel.querySelector('.carousel-control.next');
  let index = 0;
  let timer = null;

  function show(i) {
    index = (i + items.length) % items.length;
    const item = items[index];
    if (item) {
      const left = item.offsetLeft - (track.clientWidth - item.clientWidth)/2;
      track.scrollTo({ left, behavior: 'smooth' });
    }
  }

  function start() {
    stop();
    timer = setInterval(()=> show(index+1), 3500);
  }
  function stop(){ if (timer) { clearInterval(timer); timer = null; } }

  if (prev) prev.addEventListener('click', ()=> { show(index-1); start(); });
  if (next) next.addEventListener('click', ()=> { show(index+1); start(); });
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);

  // start centered on first item after images load
  window.addEventListener('load', ()=> { show(0); start(); });
})();

/* Copy PIX key to clipboard */
(function initPixCopy(){
  const copyBtn = document.getElementById('copyPix');
  const pixKeyEl = document.getElementById('pixKey');
  const feedback = document.getElementById('copyFeedback');
  const donateNow = document.getElementById('donateNow');

  if (!copyBtn || !pixKeyEl) return;
  // Default example PIX key; change as needed
  const PIX_KEY = 'pix@alimentacaosolidaria.org.br';
  pixKeyEl.textContent = PIX_KEY;

  copyBtn.addEventListener('click', async (e)=>{
    e.preventDefault();
    try{
      await navigator.clipboard.writeText(PIX_KEY);
      if (feedback) feedback.textContent = 'Chave PIX copiada para a área de transferência!';
      setTimeout(()=> { if (feedback) feedback.textContent = ''; }, 3000);
    }catch(err){
      if (feedback) feedback.textContent = 'Não foi possível copiar. Copie manualmente.';
    }
  });

  // Donate now can point to a payment page or scroll to donate block; here we'll focus donate block
  if (donateNow) donateNow.addEventListener('click', (e)=>{ e.preventDefault(); document.getElementById('comoDoar').scrollIntoView({behavior:'smooth'}); });
})();

/* Hero background slideshow: cycles slides behind the hero text every 10s */
(function initHeroBg(){
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const track = document.querySelector('.hero-track');
  if (!track) return;
  const slides = Array.from(track.querySelectorAll('.hero-slide'));
  if (!slides.length) return;
  const captionEl = document.getElementById('heroCaption');
  let idx = 0;

  function show(i){
    idx = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    // update caption from first img in slide
    try{
      const img = slides[idx].querySelector('img');
      const text = (img && img.dataset && img.dataset.caption) ? img.dataset.caption : '';
      if (captionEl) captionEl.textContent = text;
    }catch(e){}
  }

  // initialize
  show(0);

  let heroTimer = setInterval(()=> show(idx+1), 10000);
  hero.addEventListener('mouseenter', ()=> { clearInterval(heroTimer); heroTimer = null; });
  hero.addEventListener('mouseleave', ()=> { if (!heroTimer) heroTimer = setInterval(()=> show(idx+1), 10000); });
})();

/* Add indicators and keyboard navigation to hero; add lightbox opening for images */
(function enhanceHeroAndLightbox(){
  const track = document.querySelector('.hero-track');
  if (!track) return;
  const slides = Array.from(track.querySelectorAll('.hero-slide'));
  const indicatorsEl = document.getElementById('heroIndicators');
  const captionEl = document.getElementById('heroCaption');
  if (indicatorsEl) {
    slides.forEach((s,i)=>{
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', 'Slide ' + (i+1));
      if (i===0) btn.classList.add('active');
      btn.addEventListener('click', ()=>{ window._heroShow && window._heroShow(i); updateIndicators(i); });
      indicatorsEl.appendChild(btn);
    });
  }

  function updateIndicators(activeIdx){
    if (!indicatorsEl) return;
    Array.from(indicatorsEl.children).forEach((b,bi)=> b.classList.toggle('active', bi===activeIdx));
  }

  // expose hero show function used by indicators
  window._heroShow = window._heroShow || function(i){
    const heroTrack = document.querySelector('.hero-track');
    const slides = Array.from(heroTrack.querySelectorAll('.hero-slide'));
    const idx = (i + slides.length) % slides.length;
    heroTrack.style.transform = `translateX(-${idx*100}%)`;
    // update caption
    const img = slides[idx].querySelector('img');
    if (captionEl) captionEl.textContent = img && img.dataset.caption ? img.dataset.caption : '';
    updateIndicators(idx);
  };

  // keyboard navigation (left/right) for hero
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'ArrowLeft') { window._heroShow((getCurrentHeroIndex()||0)-1); }
    if (e.key === 'ArrowRight') { window._heroShow((getCurrentHeroIndex()||0)+1); }
    if (e.key === 'Escape') closeLightbox();
  });

  function getCurrentHeroIndex(){
    const trackStyle = getComputedStyle(track).transform;
    if (!trackStyle || trackStyle === 'none') return 0;
    const match = trackStyle.match(/matrix\((.+)\)/);
    if (!match) return 0;
    const values = match[1].split(',');
    const tx = parseFloat(values[4]);
    const width = track.clientWidth;
    const idx = Math.round(-tx/width);
    return idx;
  }

  // lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, alt, caption){
    if (!lightbox) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightboxCaption.textContent = caption || alt || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden','true');
    lightboxImg.src='';
    document.body.style.overflow = '';
  }

  lightbox && lightboxClose && lightboxClose.addEventListener('click', closeLightbox);
  lightbox && lightbox.addEventListener('click', (e)=>{ if (e.target === lightbox) closeLightbox(); });

  // open lightbox on click for hero slides and carousel images
  document.querySelectorAll('.hero-slide img, .carousel-item img').forEach(img=>{
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', ()=> openLightbox(img.src, img.alt, img.dataset && img.dataset.caption ? img.dataset.caption : img.alt));
  });
})();

/* When a link to cadastro.html is clicked, set a flag so the cadastro page can scroll to top on load */
(function linkToCadastroScrollFlag(){
  document.addEventListener('click', function(e){
    const a = e.target.closest && e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (href.indexOf('cadastro.html') !== -1) {
      try { sessionStorage.setItem('scrollToCadastro', '1'); } catch(e) {}
    }
  });

  // On load, if we're on cadastro.html and the flag exists, scroll to top smoothly
  window.addEventListener('DOMContentLoaded', function(){
    try {
      const path = window.location.pathname || '';
      if (path.indexOf('cadastro.html') !== -1 && sessionStorage.getItem('scrollToCadastro')) {
        // small timeout to ensure rendering
        setTimeout(()=> {
          try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch(e) { window.scrollTo(0,0); }
          sessionStorage.removeItem('scrollToCadastro');
        }, 50);
      }
    } catch(e) {}
  });
})();
