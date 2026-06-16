// ─── PAGE ROUTING ───
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
let currentPage = 'home';

function goTo(pageId) {
  const prev = document.getElementById(currentPage);
  const next = document.getElementById(pageId);
  if (!next || currentPage === pageId) return;

  prev.classList.remove('visible');
  setTimeout(() => {
    prev.classList.remove('active');
    next.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
    setTimeout(() => {
      next.classList.add('visible');
      initPageAnimations(next);
    }, 50);
  }, 300);

  navLinks.forEach(l => {
    l.classList.toggle('active', l.dataset.page === pageId);
  });

  currentPage = pageId;
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    goTo(link.dataset.page);
    if (document.querySelector('.nav-links').classList.contains('open')) {
      document.querySelector('.nav-links').classList.remove('open');
    }
  });
});

// ─── HAMBURGER ───
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
});

// ─── NAV SCROLL ───
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

// ─── SCROLL REVEAL OBSERVER ───
function initPageAnimations(container) {
  const elements = container.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => {
    el.classList.remove('visible');
    observer.observe(el);
  });
}

// ─── COUNTER ANIMATION ───
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const duration = 1800;
    const start = performance.now();

    function update(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      counter.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  });
}

// ─── POSITION FILTER ───
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.player-card').forEach(card => {
      if (filter === 'all' || card.dataset.pos === filter) {
        card.classList.remove('hidden');
        card.classList.remove('fade-in-up', 'visible');
        void card.offsetWidth; // force reflow
        card.classList.add('fade-in-up');
        setTimeout(() => card.classList.add('visible'), 30);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ─── LEGEND CARD EASTER EGG ───
document.querySelectorAll('.legend-card').forEach(card => {
  card.addEventListener('dblclick', () => {
    const name = card.querySelector('.legend-name').textContent;
    const tributes = {
      'Thierry Henry': "Le Roi. Finished. Absolutely finished. There will never be another.",
      'Dennis Bergkamp': "The goal against Newcastle in 2002. Look it up. Go now. I'll wait.",
      'Patrick Vieira': "Midfield enforcer. Opponent nightmare. Legend. Full stop.",
      'Ian Wright': "Wright Wright WRIGHT! The original. The electric one.",
      'Gabriel Martinelli': "...still waiting for that second league goal. (CASS101, 2024)"
    };
    const msg = tributes[name] || "An Arsenal legend.";
    showToast('⚽ ' + msg);
  });
});

// ─── TOAST NOTIFICATION ───
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(80px);
      background: rgba(20,20,26,0.95); border: 1px solid rgba(204,0,0,0.5);
      color: #f5f0eb; padding: 14px 24px; border-radius: 8px;
      font-family: 'Barlow', sans-serif; font-size: 14px; font-weight: 300;
      max-width: 380px; text-align: center; line-height: 1.5;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 30px rgba(204,0,0,0.2);
      transition: transform 0.4s ease, opacity 0.4s ease;
      opacity: 0; z-index: 999; backdrop-filter: blur(10px);
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 4000);
}

// ─── SHOW MESSAGE (original button) ───
function showMessage() {
  showToast("Welcome to the Arsenal FC Archives 🔥 — Where legends live and the title wait continues.");
}

// ─── MOVING GRADIENT ON HERO ───
function animateHeroGradient() {
  const orbs = document.querySelectorAll('.gradient-orb');
  let t = 0;
  function tick() {
    t += 0.003;
    orbs.forEach((orb, i) => {
      const phase = t + i * (Math.PI * 2 / orbs.length);
      const x = Math.sin(phase) * 15;
      const y = Math.cos(phase * 0.7) * 10;
      orb.style.transform = `translate(${x}px, ${y}px)`;
    });
    requestAnimationFrame(tick);
  }
  tick();
}

// ─── CURSOR TRAIL (desktop only) ───
if (window.matchMedia('(pointer: fine)').matches) {
  const trail = [];
  const TRAIL_LENGTH = 8;
  for (let i = 0; i < TRAIL_LENGTH; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: ${6 - i * 0.5}px; height: ${6 - i * 0.5}px;
      border-radius: 50%;
      background: rgba(204, 0, 0, ${0.6 - i * 0.07});
      transition: transform 0.05s; mix-blend-mode: screen;
    `;
    document.body.appendChild(dot);
    trail.push({ el: dot, x: 0, y: 0 });
  }

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateTrail() {
    trail.forEach((dot, i) => {
      if (i === 0) {
        dot.x += (mouseX - dot.x) * 0.35;
        dot.y += (mouseY - dot.y) * 0.35;
      } else {
        dot.x += (trail[i-1].x - dot.x) * 0.55;
        dot.y += (trail[i-1].y - dot.y) * 0.55;
      }
      dot.el.style.left = dot.x - 3 + 'px';
      dot.el.style.top = dot.y - 3 + 'px';
    });
    requestAnimationFrame(updateTrail);
  }
  updateTrail();
}

// ─── KEYBOARD NAVIGATION ───
document.addEventListener('keydown', e => {
  const pageOrder = ['home', 'history', 'legends', 'trophies', 'squad'];
  const idx = pageOrder.indexOf(currentPage);
  if (e.key === 'ArrowRight' && idx < pageOrder.length - 1) goTo(pageOrder[idx + 1]);
  if (e.key === 'ArrowLeft' && idx > 0) goTo(pageOrder[idx - 1]);
});

// ─── INIT ───
(function init() {
  const homePage = document.getElementById('home');
  homePage.classList.add('active');
  setTimeout(() => {
    homePage.classList.add('visible');
    initPageAnimations(homePage);
    animateCounters();
    animateHeroGradient();

    // Show hint toast
    setTimeout(() => {
      showToast("💡 Tip: Double-click any legend card for a tribute. Use ← → arrow keys to navigate.");
    }, 2500);
  }, 100);
})();