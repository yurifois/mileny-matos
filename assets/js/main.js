/* Mileny Matos + Método SER — interações */
(() => {
  const doc = document.documentElement;
  const body = document.body;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Cortina: entrada e transição entre páginas ---------- */
  const curtain = $('.curtain');
  let pageRevealed = false;
  const revealPage = () => {
    if (pageRevealed) return;
    pageRevealed = true;
    if (!curtain) { body.classList.add('is-loaded'); startReveals(); return; }
    const firstVisit = !sessionStorageGet('mm-visited');
    const hold = reduced ? 0 : firstVisit ? 1100 : 250;
    sessionStorageSet('mm-visited', '1');
    setTimeout(() => {
      curtain.classList.remove('is-entering');
      curtain.classList.add('is-leaving');
      body.classList.add('is-loaded');
      setTimeout(startReveals, 280);
      setTimeout(() => curtain.classList.add('is-gone'), 1000);
    }, hold);
  };
  function sessionStorageGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function sessionStorageSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* noop */ } }

  // volta via histórico (bfcache)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted && curtain) {
      curtain.classList.remove('is-entering');
      curtain.classList.add('is-leaving', 'is-gone');
    }
  });

  // links internos entre páginas
  $$('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || a.target === '_blank' || /^(https?:|mailto:|tel:)/.test(href)) return;
    a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || reduced || !curtain) return;
      const url = new URL(href, location.href);
      if (url.pathname === location.pathname) return; // âncora na mesma página
      e.preventDefault();
      body.classList.remove('menu-open');
      curtain.classList.remove('is-leaving', 'is-gone');
      curtain.classList.add('is-entering');
      setTimeout(() => { location.href = url.href; }, 700);
    });
  });

  /* ---------- Divide títulos em palavras ---------- */
  $$('[data-split]').forEach((el) => {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'w';
            const inner = document.createElement('span');
            inner.textContent = part;
            inner.style.setProperty('--i', i++);
            w.appendChild(inner);
            frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
      });
    };
    walk(el);
    el.classList.add('split');
    if (!el.hasAttribute('data-reveal-split')) el.setAttribute('data-reveal-split', '');
  });

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = $$('[data-reveal], [data-reveal-split], .copper-arc[data-draw], .pillars, .check, .cta-card, [data-stagger]');
  // stagger automático em grupos
  $$('[data-stagger]').forEach((group) => {
    const step = parseFloat(group.dataset.stagger) || 0.1;
    [...group.children].forEach((child, idx) => {
      if (!child.hasAttribute('data-reveal')) child.setAttribute('data-reveal', group.dataset.staggerType || '');
      child.style.setProperty('--d', `${(idx * step).toFixed(2)}s`);
      revealTargets.push(child);
    });
  });
  // prepara comprimento dos arcos cobre
  $$('.copper-arc path').forEach((p) => {
    try { p.parentNode.style.setProperty('--len', Math.ceil(p.getTotalLength()) + 1); } catch (e) { /* noop */ }
  });

  // só começa depois que a cortina sobe, para a entrada do hero ser vista
  let revealsStarted = false;
  function startReveals() {
    if (revealsStarted) return;
    revealsStarted = true;
    if ('IntersectionObserver' in window && !reduced) {
      // elementos totalmente recortados por clip-path nunca "intersectam":
      // observa o pai e aplica a classe no alvo
      const proxies = new Map();
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (proxies.get(entry.target) || [entry.target]).forEach((t) => t.classList.add('is-in'));
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
      revealTargets.forEach((el) => {
        if (el.dataset.reveal === 'arch' && el.parentElement) {
          const parent = el.parentElement;
          if (!proxies.has(parent)) proxies.set(parent, []);
          proxies.get(parent).push(el);
          io.observe(parent);
        } else {
          io.observe(el);
        }
      });
    } else {
      revealTargets.forEach((el) => el.classList.add('is-in'));
    }
  }

  /* ---------- Header + barra de progresso + WhatsApp flutuante ---------- */
  const header = $('.site-header');
  const progress = $('.scroll-progress');
  const wa = $('.wa-float');
  const heroEl = $('.hero, .m-hero');
  let lastY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    const max = doc.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (header) {
      header.classList.toggle('is-scrolled', y > 30);
      const goingDown = y > lastY + 4;
      const goingUp = y < lastY - 4;
      if (goingDown && y > 520 && !body.classList.contains('menu-open')) header.classList.add('is-hidden');
      if (goingUp || y < 200) header.classList.remove('is-hidden');
    }
    if (wa && heroEl) wa.classList.toggle('is-visible', y > heroEl.offsetHeight * 0.7);
    lastY = y;
    updateParallax();
    updateTimeline();
    updateFill();
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', () => requestAnimationFrame(onScroll));

  /* ---------- Parallax suave ---------- */
  const parallaxEls = reduced ? [] : $$('[data-parallax]');
  function updateParallax() {
    const vh = window.innerHeight;
    parallaxEls.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      const center = r.top + r.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${(-center * speed).toFixed(1)}px, 0)`;
    });
  }

  /* ---------- Menu mobile ---------- */
  const toggle = $('.menu-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      header && header.classList.remove('is-hidden');
    });
    $$('.mobile-menu a').forEach((a) => a.addEventListener('click', () => {
      body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && body.classList.contains('menu-open')) {
        body.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---------- Contadores ---------- */
  const counters = $$('[data-count]');
  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    if (reduced) { el.textContent = target; return; }
    const dur = 1800;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach((c) => { c.textContent = '0'; cio.observe(c); });
  }

  /* ---------- Spotlight que segue o cursor ---------- */
  if (finePointer) {
    $$('.mirror-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });

    // botões magnéticos
    if (!reduced) {
      $$('[data-magnetic]').forEach((btn) => {
        btn.addEventListener('pointermove', (e) => {
          const r = btn.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * 0.18;
          const y = (e.clientY - r.top - r.height / 2) * 0.28;
          btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
      });
    }
  }

  /* ---------- FAQ ---------- */
  $$('.faq-item').forEach((item) => {
    const q = $('.faq-q', item);
    q.addEventListener('click', () => {
      const open = item.classList.toggle('is-open');
      q.setAttribute('aria-expanded', String(open));
      $$('.faq-item.is-open').forEach((other) => {
        if (other !== item) {
          other.classList.remove('is-open');
          $('.faq-q', other).setAttribute('aria-expanded', 'false');
        }
      });
    });
  });

  /* ---------- Carrossel com arraste ---------- */
  const carousel = $('.carousel');
  if (carousel) {
    const step = () => (carousel.firstElementChild?.getBoundingClientRect().width || 320) + 22;
    $('[data-carousel="prev"]')?.addEventListener('click', () => carousel.scrollBy({ left: -step(), behavior: 'smooth' }));
    $('[data-carousel="next"]')?.addEventListener('click', () => carousel.scrollBy({ left: step(), behavior: 'smooth' }));
    if (finePointer) {
      let down = false, startX = 0, startScroll = 0, moved = false;
      carousel.addEventListener('pointerdown', (e) => {
        down = true; moved = false; startX = e.clientX; startScroll = carousel.scrollLeft;
      });
      window.addEventListener('pointermove', (e) => {
        if (!down) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 4) { moved = true; carousel.classList.add('is-dragging'); }
        carousel.scrollLeft = startScroll - dx;
      });
      window.addEventListener('pointerup', () => {
        if (!down) return;
        down = false;
        carousel.classList.remove('is-dragging');
        if (moved) {
          const s = step();
          carousel.scrollTo({ left: Math.round(carousel.scrollLeft / s) * s, behavior: 'smooth' });
        }
      });
    }
  }

  /* ---------- Timeline dos 7 movimentos ---------- */
  const timeline = $('.timeline');
  const steps = $$('.step');
  function updateTimeline() {
    if (!timeline) return;
    const r = timeline.getBoundingClientRect();
    const mid = window.innerHeight * 0.55;
    const p = Math.min(Math.max((mid - r.top) / r.height, 0), 1);
    timeline.style.setProperty('--p', p.toFixed(4));
    steps.forEach((s) => {
      const dot = $('.step-dot', s).getBoundingClientRect();
      s.classList.toggle('is-active', dot.top + dot.height / 2 < mid);
    });
  }

  /* ---------- Texto que acende com a rolagem ---------- */
  const fillEl = $('[data-fill]');
  let fillWords = [];
  if (fillEl) {
    const wrap = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const s = document.createElement('span');
            s.className = 'fw';
            s.textContent = part;
            frag.appendChild(s);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) wrap(child);
      });
    };
    wrap(fillEl);
    fillWords = $$('.fw', fillEl);
  }
  function updateFill() {
    if (!fillEl || reduced) return;
    const r = fillEl.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(Math.max((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0), 1);
    const n = Math.round(p * fillWords.length);
    fillWords.forEach((w, i) => w.classList.toggle('on', i < n));
  }

  /* ---------- Pilares em scroll (página Método) ---------- */
  const blocks = $$('.story-block');
  const letters = $$('.story-letter');
  const tabs = $$('.story-caption button');
  const ring = $('.progress-ring circle');
  if (blocks.length) {
    const circ = ring ? 2 * Math.PI * ring.r.baseVal.value : 0;
    if (ring) { ring.style.strokeDasharray = circ; ring.style.strokeDashoffset = circ; }
    const activate = (idx) => {
      blocks.forEach((b, i) => b.classList.toggle('is-active', i === idx));
      letters.forEach((l, i) => l.classList.toggle('is-active', i === idx));
      tabs.forEach((t, i) => { t.classList.toggle('is-active', i === idx); t.setAttribute('aria-pressed', String(i === idx)); });
      if (ring) ring.style.strokeDashoffset = circ * (1 - (idx + 1) / blocks.length);
    };
    activate(0);
    const bio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) activate(blocks.indexOf(e.target)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    blocks.forEach((b) => bio.observe(b));
    tabs.forEach((t, i) => t.addEventListener('click', () => {
      blocks[i].scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    }));
  }

  /* ---------- Ano no rodapé ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  onScroll();

  if (document.readyState === 'complete') revealPage();
  else window.addEventListener('load', revealPage, { once: true });
  // segurança: nunca deixar a cortina presa se alguma imagem demorar
  setTimeout(revealPage, 2500);
})();
