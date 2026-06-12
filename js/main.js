/* ══════════════════════════════════════════
   PANDEY'S HOMESTAY — main.js  (v2 fixed)
══════════════════════════════════════════ */
'use strict';

/* ─── 1. LOADER ─── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 700);
});

/* ─── 2. NAVBAR scroll + hamburger (FIX 3 & 4) ─── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

// Scroll effect
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });
if (window.scrollY > 50) navbar.classList.add('scrolled');

// FIX 4: Toggle full-screen menu
hamburger?.addEventListener('click', (e) => {
  e.stopPropagation();
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
  // prevent body scroll when menu open
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

function closeMenu() {
  hamburger?.classList.remove('open');
  navMenu?.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on link click
navMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

// Close on outside click / overlay click
document.addEventListener('click', (e) => {
  if (navMenu?.classList.contains('open') && !navbar.contains(e.target)) closeMenu();
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

/* ─── 3. HERO SWIPER ─── */
if (document.querySelector('.hero-swiper')) {
  new Swiper('.hero-swiper', {
    loop: true, speed: 1400,
    autoplay: { delay: 5000, disableOnInteraction: false },
    effect: 'fade', fadeEffect: { crossFade: true },
  });
}

/* ─── 4. GALLERY SWIPER — mobile (FIX 5) ─── */
if (document.querySelector('.gallery-swiper')) {
  new Swiper('.gallery-swiper', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 16,
    navigation: {
      nextEl: '.gallery-swiper .swiper-button-next',
      prevEl: '.gallery-swiper .swiper-button-prev',
    },
    pagination: {
      el: '.gallery-swiper .swiper-pagination',
      clickable: true,
    },
    autoplay: { delay: 4000, disableOnInteraction: true },
  });
}

/* ─── 5. SMOOTH SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const navH = navbar ? navbar.offsetHeight : 70;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 10, behavior: 'smooth' });
    }
  });
});

/* ─── 6. CUSTOM AOS ─── */
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        setTimeout(() => el.classList.add('aos-animate'), parseInt(el.dataset.aosDelay || 0));
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => obs.observe(el));
}
document.addEventListener('DOMContentLoaded', initAOS);

/* ─── 7. GALLERY LIGHTBOX (desktop) ─── */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lb-img');
const lbClose  = document.getElementById('lb-close');
const lbPrev   = document.getElementById('lb-prev');
const lbNext   = document.getElementById('lb-next');

const galleryImages = [];
let currentLbIndex  = 0;

document.querySelectorAll('.gallery-masonry .gallery-item img').forEach((img, idx) => {
  galleryImages.push({ src: img.src, alt: img.alt });
  img.parentElement.addEventListener('click', () => openLightbox(idx));
});

function openLightbox(index) {
  if (!lightbox || !galleryImages.length) return;
  currentLbIndex = index;
  lbImg.src = galleryImages[index].src;
  lbImg.alt = galleryImages[index].alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox?.classList.remove('active');
  document.body.style.overflow = '';
}
function showLbPrev() {
  currentLbIndex = (currentLbIndex - 1 + galleryImages.length) % galleryImages.length;
  lbImg.src = galleryImages[currentLbIndex].src;
}
function showLbNext() {
  currentLbIndex = (currentLbIndex + 1) % galleryImages.length;
  lbImg.src = galleryImages[currentLbIndex].src;
}

lbClose?.addEventListener('click', closeLightbox);
lbPrev?.addEventListener('click', showLbPrev);
lbNext?.addEventListener('click', showLbNext);
lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox?.classList.contains('active')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  showLbPrev();
  if (e.key === 'ArrowRight') showLbNext();
});

/* ─── 8. STAR PICKER ─── */
const starPicker    = document.getElementById('starPicker');
const rRatingHidden = document.getElementById('rRating');

starPicker?.querySelectorAll('span').forEach(star => {
  star.addEventListener('click', () => {
    const val = parseInt(star.dataset.val);
    if (rRatingHidden) rRatingHidden.value = val;
    starPicker.querySelectorAll('span').forEach((s, i) => s.classList.toggle('active', i < val));
  });
  star.addEventListener('mouseenter', () => {
    const val = parseInt(star.dataset.val);
    starPicker.querySelectorAll('span').forEach((s, i) => { s.style.color = i < val ? '#C9A96E' : '#ddd'; });
  });
  star.addEventListener('mouseleave', () => {
    const current = parseInt(rRatingHidden?.value || 0);
    starPicker.querySelectorAll('span').forEach((s, i) => { s.style.color = i < current ? '#C9A96E' : '#ddd'; });
  });
});

/* ─── 9. REVIEW SUBMISSION ─── */
const REVIEWS_KEY = 'pandeys_reviews_v1';
function getStoredReviews() { try { return JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]'); } catch { return []; } }
function saveReview(r) { const arr = getStoredReviews(); arr.push(r); localStorage.setItem(REVIEWS_KEY, JSON.stringify(arr)); }

function createReviewCard(r) {
  const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
  const card = document.createElement('div');
  card.className = 'review-card';
  card.innerHTML = `
    <div class="rv-header">
      <div class="rv-avatar">${r.name.charAt(0).toUpperCase()}</div>
      <div><div class="rv-name">${escapeHtml(r.name)}</div><div class="rv-location"><i class="fas fa-map-pin"></i> ${escapeHtml(r.city||'India')}</div></div>
      <div class="rv-stars">${stars}</div>
    </div>
    <p class="rv-text">"${escapeHtml(r.text)}"</p>
    <div class="rv-date">${r.date}</div>`;
  return card;
}

function updateRatingSummary() {
  const stored = getStoredReviews();
  const total  = stored.length + 3;
  const sum    = stored.reduce((a, b) => a + b.rating, 0) + (5 + 5 + 4);
  const avg    = sum / total;
  const scoreEl = document.getElementById('ratingScore');
  const countEl = document.getElementById('reviewCount');
  const starsEl = document.getElementById('starsDisplay');
  if (scoreEl) scoreEl.textContent = avg.toFixed(1);
  if (countEl) countEl.textContent = total;
  if (starsEl) { const f = Math.round(avg); starsEl.textContent = '★'.repeat(f) + '☆'.repeat(5 - f); }
}

function loadStoredReviews() {
  const grid = document.getElementById('reviewsGrid');
  getStoredReviews().forEach(r => { if (grid) grid.appendChild(createReviewCard(r)); });
  updateRatingSummary();
}

window.submitReview = function () {
  const name   = document.getElementById('rName')?.value.trim();
  const city   = document.getElementById('rCity')?.value.trim();
  const text   = document.getElementById('rText')?.value.trim();
  const rating = parseInt(document.getElementById('rRating')?.value || '0');
  if (!name || !text) { showToast('⚠️ Please enter your name and review.', 'warn'); return; }
  if (!rating)        { showToast('⚠️ Please select a star rating.', 'warn'); return; }
  const review = { name, city, text, rating, date: new Date().toLocaleDateString('en-IN', { month:'long', year:'numeric' }) };
  saveReview(review);
  document.getElementById('reviewsGrid')?.appendChild(createReviewCard(review));
  updateRatingSummary();
  document.getElementById('reviewFormArea').style.display = 'none';
  document.getElementById('reviewThanks').style.display = 'block';
  showToast('🙏 Thank you for your review!', 'success');
};

document.addEventListener('DOMContentLoaded', loadStoredReviews);

function escapeHtml(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }

/* ─── 10. TOAST ─── */
function showToast(message, type = 'info') {
  document.querySelector('.ph-toast')?.remove();
  const t = document.createElement('div');
  t.className = 'ph-toast';
  t.textContent = message;
  Object.assign(t.style, {
    position:'fixed', bottom:'90px', right:'16px',
    background: type==='success'?'#25D366':type==='warn'?'#E8680A':'#1A4080',
    color:'#fff', padding:'13px 20px', borderRadius:'6px',
    fontSize:'0.88rem', fontWeight:'600', zIndex:'9999',
    boxShadow:'0 6px 25px rgba(0,0,0,0.25)', maxWidth:'300px',
    transform:'translateX(120%)', transition:'transform 0.35s ease',
  });
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.style.transform = 'translateX(0)'; });
  setTimeout(() => { t.style.transform = 'translateX(120%)'; setTimeout(() => t.remove(), 400); }, 3500);
}

/* ─── 11. SCROLL TO TOP ─── */
function addScrollTopBtn() {
  const btn = document.createElement('button');
  btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  Object.assign(btn.style, {
    position:'fixed', bottom:'90px', right:'20px', width:'44px', height:'44px',
    borderRadius:'50%', background:'rgba(232,104,10,0.9)', color:'white',
    border:'none', cursor:'pointer', fontSize:'1rem',
    display:'flex', alignItems:'center', justifyContent:'center',
    zIndex:'800', opacity:'0', transform:'translateY(20px)',
    transition:'all 0.35s ease', boxShadow:'0 4px 20px rgba(232,104,10,0.4)',
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    btn.style.opacity   = show ? '1' : '0';
    btn.style.transform = show ? 'translateY(0)' : 'translateY(20px)';
  }, { passive: true });
}
document.addEventListener('DOMContentLoaded', addScrollTopBtn);

/* ─── 12. IMAGE FALLBACK ─── */
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function () {
    this.style.display = 'none';
    const grads = ['linear-gradient(135deg,#3D1010,#6B1A1A)','linear-gradient(135deg,#102030,#1A4060)','linear-gradient(135deg,#103020,#1A6040)'];
    if (this.parentElement) this.parentElement.style.background = grads[Math.floor(Math.random()*grads.length)];
  });
});
