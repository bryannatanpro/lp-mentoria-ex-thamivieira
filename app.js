const motionToggle=document.querySelector('.motion-toggle');
if(motionToggle)motionToggle.addEventListener('click',()=>{const paused=document.documentElement.classList.toggle('motion-paused');motionToggle.setAttribute('aria-pressed',String(paused));motionToggle.textContent=paused?'Ativar animações':'Pausar animações';});

// Entrada progressiva dos blocos, sem interferir na rolagem nativa.
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || reducedMotion.matches) return;
  const selectors = [
    '.hero-copy', '.hero-media', '.split-heading', '.method-grid article',
    '.fit-positive', '.fit-negative', '.authority-grid > div', '.results-title',
    '.result-card', '.student-proof', '.delivery-main', '.months article', '.vip',
    '.bonus-heading', '.bonus-grid article', '.content-carousel', '.offer-grid > div', '.guarantee',
    '.faq-grid > div:first-child', '.faq-list details', '.decision > h2',
    '.decision > p', '.decision-grid article', '.decision-close', '.support-panel', '.footer'
  ].join(',');
  const candidates = [...document.querySelectorAll(selectors)];
  const blocks = candidates.filter(block => !candidates.some(parent => parent !== block && parent.contains(block)));
  const reveal = block => {
    block.classList.remove('reveal-pending');
    block.classList.add('reveal-visible');
    observer.unobserve(block);
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
  }, { rootMargin: '0px 0px -4% 0px', threshold: 0 });
  blocks.forEach(block => {
    const rect = block.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;
    block.classList.add('scroll-reveal', 'reveal-pending');
    const siblings = [...block.parentElement.children].filter(child => blocks.includes(child));
    block.style.setProperty('--reveal-delay', Math.min(siblings.indexOf(block), 2) * 80 + 'ms');
    observer.observe(block);
  });
  const revealAll = () => blocks.forEach(reveal);
  reducedMotion.addEventListener('change', event => { if (event.matches) revealAll(); });
  motionToggle?.addEventListener('click', () => {
    if (document.documentElement.classList.contains('motion-paused')) revealAll();
  });
  document.addEventListener('focusin', event => {
    const block = event.target.closest('.reveal-pending');
    if (block) reveal(block);
  });
  window.addEventListener('pageshow', event => { if (event.persisted) revealAll(); });
})();

// Carrossel contínuo com três cards e repetição sem intervalo.
(() => {
  const carousel = document.querySelector('.content-carousel');
  if (!carousel) return;
  const track = carousel.querySelector('.content-carousel-track');
  const viewport = carousel.querySelector('.content-carousel-window');
  const slides = [...track.children];
  if (slides.length < 2) return;
  slides.forEach(slide => {
    const copy = slide.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    track.append(copy);
  });
  const measure = () => {
    const step = slides[1].getBoundingClientRect().left - slides[0].getBoundingClientRect().left;
    track.style.setProperty('--carousel-distance', (-step * slides.length) + 'px');
  };
  measure();
  new ResizeObserver(measure).observe(viewport);
})();
