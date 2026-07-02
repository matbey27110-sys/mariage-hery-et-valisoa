// Envelope opening intro
// Set to true to re-enable the envelope animation on page load.
const ENVELOPE_INTRO_ENABLED = false;

const envelopeIntro = document.getElementById('envelopeIntro');
if (envelopeIntro) {
  if (ENVELOPE_INTRO_ENABLED) {
    document.documentElement.classList.add('intro-lock');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const introDuration = prefersReducedMotion ? 200 : 2100;

    const revealSite = () => {
      envelopeIntro.classList.add('is-hidden');
      document.documentElement.classList.remove('intro-lock');
    };
    setTimeout(revealSite, introDuration);

    envelopeIntro.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'opacity') {
        envelopeIntro.remove();
      }
    });
  } else {
    envelopeIntro.remove();
  }
}

// Countdown to the wedding day
const WEDDING_DATE = new Date('2026-12-26T09:00:00');

function updateCountdown() {
  const now = new Date();
  let diff = WEDDING_DATE - now;
  if (diff < 0) diff = 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const pad = (n) => String(n).padStart(2, '0');
  document.getElementById('cd-days').textContent = pad(days);
  document.getElementById('cd-hours').textContent = pad(hours);
  document.getElementById('cd-minutes').textContent = pad(minutes);
  document.getElementById('cd-seconds').textContent = pad(seconds);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Solid header once scrolled past the hero
const navEl = document.getElementById('nav');
function updateNavBackground() {
  navEl.classList.toggle('nav--scrolled', window.scrollY > 60);
}
updateNavBackground();
window.addEventListener('scroll', updateNavBackground, { passive: true });

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function setMenuOpen(isOpen) {
  navLinks.classList.toggle('is-open', isOpen);
  navToggle.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
}

navToggle.addEventListener('click', () => {
  setMenuOpen(!navLinks.classList.contains('is-open'));
});
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

// Scroll reveal animations
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => revealObserver.observe(el));

// RSVP form -> Google Sheets
// 1. Suis les instructions dans rsvp-apps-script.gs pour créer ton Google Sheet.
// 2. Colle ici l'URL de déploiement de ton Apps Script (se termine par /exec).
const RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwe5WwND8BD4NRxfFIO9A0cVKTbbHZUkaT5EKVZ-JzWEh1NXbsrsGJuyK01EXdNRG-F7w/exec';

const rsvpForm = document.getElementById('rsvpForm');
const rsvpThanks = document.getElementById('rsvpThanks');
const rsvpError = document.getElementById('rsvpError');

rsvpForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (RSVP_ENDPOINT === 'REMPLACE_PAR_TON_URL_APPS_SCRIPT') {
    console.warn('RSVP_ENDPOINT non configuré : voir rsvp-apps-script.gs pour le mettre en place.');
  }

  const submitButton = rsvpForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  rsvpError.hidden = true;

  fetch(RSVP_ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    body: new FormData(rsvpForm),
  })
    .then(() => {
      rsvpForm.hidden = true;
      rsvpThanks.hidden = false;
    })
    .catch(() => {
      submitButton.disabled = false;
      rsvpError.hidden = false;
    });
});
