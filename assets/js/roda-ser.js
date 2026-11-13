/* Roda do SER — rodas interativas do site.
   Dados e geometria das pétalas vêm do app da Roda do SER (scoring.js / roda.js, v5.7). */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const APP_URL = 'https://milenymatos.github.io/roda-do-ser/';

  // ordem das fatias na roda (alterna escura e clara)
  const ORDER = ['cuidadora', 'criativa', 'realizadora', 'essencia', 'gestora', 'companheira'];
  const ROLES = {
    cuidadora: {
      nome: 'Cuidadora', cor: '#3C203F', sub: 'mãe, filha, amiga, apoio de quem você ama',
      desc: 'O papel em que você acolhe, escuta e ajuda as pessoas que ama.',
      perfil: 'A Acolhedora', arte: 'Tecelagem',
      metodo: ['Compromisso', 'cuidar dos outros sem se deixar de fora.'],
      frase: 'Consigo acolher quem eu amo sem carregar os problemas dessas pessoas como se fossem meus.',
      r1: 'Carrego tudo nas costas', r10: 'Acolho e sigo leve'
    },
    realizadora: {
      nome: 'Realizadora', cor: '#5E3C66', sub: 'trabalho, estudos, projetos, sua independência',
      desc: 'O papel em que você produz e constrói o que quer para a sua vida, com ou sem salário.',
      perfil: 'A Construtora', arte: 'Bordado',
      metodo: ['Clareza', 'separar exigência real de cobrança que você mesma colocou.'],
      frase: 'Termino meu dia de trabalho ou de projetos com energia para outras partes da minha vida.',
      r1: 'Chego ao fim do dia sem energia', r10: 'Ainda sobra energia para mim'
    },
    gestora: {
      nome: 'Gestora do Lar', cor: '#7A4B5A', sub: 'a administradora da rotina',
      desc: 'A carga mental de organizar a casa, as contas, as refeições e a logística do dia a dia.',
      perfil: 'A Guardiã do Lar', arte: 'Flores prensadas',
      metodo: ['Ferramentas', 'aliviar a carga invisível de organizar tudo sozinha.'],
      frase: 'Consigo organizar a rotina da casa sem me sentir sobrecarregada por dentro.',
      r1: 'Minha cabeça não desliga', r10: 'Dou conta com leveza'
    },
    companheira: {
      nome: 'Companheira', cor: '#8C6E93', sub: 'vida afetiva e intimidade',
      desc: 'Como você vive o afeto e a intimidade: numa relação, nos seus vínculos mais próximos ou consigo mesma.',
      perfil: 'A Amorosa', arte: 'Vitral',
      metodo: ['Clareza', 'reconhecer necessidades e encontrar um jeito de expressá-las.'],
      frase: 'Tenho energia para viver o afeto e a intimidade, com alguém ou comigo mesma, sem que isso vire mais uma tarefa.',
      r1: 'O afeto virou obrigação', r10: 'Tenho energia para o afeto'
    },
    criativa: {
      nome: 'Criativa', cor: '#D4AE9C', sub: 'lazer, prazer e descobertas',
      desc: 'A parte de você que brinca, ri, dança, aprecia arte ou faz algo só porque gosta.',
      perfil: 'A Criadora', arte: 'Aquarela e ouro',
      metodo: ['Compromisso', 'reservar espaço para o que é só seu, sem precisar justificar.'],
      frase: 'No meu tempo livre, tenho energia para fazer algo de que gosto, além de descansar.',
      r1: 'Só quero apagar', r10: 'Tenho energia para o que amo'
    },
    essencia: {
      nome: 'Mulher Essência', cor: '#B8A7BC', sub: 'autoconhecimento, espiritualidade e corpo',
      desc: 'A sua conexão com você mesma: corpo, emoções, sentido e propósito (com ou sem religião).',
      perfil: 'A Intuitiva', arte: 'Cerâmica',
      metodo: ['Raiz e Ferramentas', 'retomar o contato com o corpo, o silêncio e o sentido.'],
      frase: 'Na maior parte dos dias, sinto meu corpo descansado e minha respiração tranquila.',
      r1: 'Corpo tenso, respiração curta', r10: 'Corpo descansado, respiração tranquila'
    }
  };

  // exemplos dos quatro desenhos de roda (valores ilustrativos)
  const PRESETS = {
    retraida: { cuidadora: 4, criativa: 2, realizadora: 3, essencia: 2.5, gestora: 3.5, companheira: 3 },
    irregular: { cuidadora: 9, criativa: 3, realizadora: 8, essencia: 2.5, gestora: 6.5, companheira: 4 },
    equilibrada: { cuidadora: 5.5, criativa: 5, realizadora: 6, essencia: 5, gestora: 6, companheira: 5.5 },
    expandida: { cuidadora: 8.5, criativa: 8, realizadora: 9, essencia: 7.5, gestora: 8, companheira: 8.5 }
  };
  const HERO_CYCLE = [
    { cuidadora: 8, criativa: 4, realizadora: 7, essencia: 3.5, gestora: 6, companheira: 5 },
    { cuidadora: 6, criativa: 7.5, realizadora: 5, essencia: 6.5, gestora: 4, companheira: 7 },
    { cuidadora: 9, criativa: 6, realizadora: 8, essencia: 7, gestora: 7.5, companheira: 6.5 },
    { cuidadora: 5, criativa: 3, realizadora: 9, essencia: 4, gestora: 8, companheira: 4.5 }
  ];

  /* ---------- geometria (igual ao app: centro 0,0, raio 100, miolo 20) ---------- */
  const R = 100, R0 = 20, GAP = 1.6;
  const rad = (g) => g * Math.PI / 180;
  const pt = (r, g) => [+(r * Math.cos(rad(g))).toFixed(2), +(r * Math.sin(rad(g))).toFixed(2)];
  const P = (p) => p[0] + ' ' + p[1];
  function petala(r0, r1, a0, a1) {
    const m = (a0 + a1) / 2, span = a1 - a0;
    const b0 = pt(r0, a0), b1 = pt(r0, a1);
    const o0 = pt(r1, a0 + span * 0.04), o1 = pt(r1, a1 - span * 0.04);
    const k = Math.max(r1 - r0, 1);
    const s0 = pt(r0 + k * 0.5, a0 - span * 0.03), s1 = pt(r0 + k * 0.5, a1 + span * 0.03);
    const c0 = pt(r1 * 1.1, a0 + span * 0.24), c1 = pt(r1 * 1.1, a1 - span * 0.24), tip = pt(r1 * 1.075, m);
    return 'M' + P(b0) + ' Q' + P(s0) + ' ' + P(o0) + ' Q' + P(c0) + ' ' + P(tip) + ' Q' + P(c1) + ' ' + P(o1) +
      ' Q' + P(s1) + ' ' + P(b1) + ' A' + r0 + ' ' + r0 + ' 0 0 0 ' + P(b0) + ' Z';
  }
  const angles = (i) => { const m = -90 + 60 * i; return { m, a0: m - 30 + GAP, a1: m + 30 - GAP }; };
  const valuePath = (i, v) => {
    if (!(v > 0.05)) return '';
    const { a0, a1 } = angles(i);
    return petala(R0, R0 + (R - R0) * Math.min(v, 10) / 10, a0, a1);
  };

  /* ---------- componente ---------- */
  class Wheel {
    constructor(el, opts = {}) {
      this.el = el;
      this.opts = Object.assign({ labels: false, rings: true, center: 'SER', explode: 9 }, opts);
      this.cur = Object.fromEntries(ORDER.map((id) => [id, 0]));
      this.anim = null;
      this.build();
    }
    build() {
      const o = this.opts, pad = o.labels ? 178 : 112; // com rótulos, folga para "Gestora do Lar" caber
      const parts = [];
      ORDER.forEach((id, i) => {
        const { m, a0, a1 } = angles(i);
        const [tx, ty] = pt(o.explode, m);
        parts.push(`<g class="wp" data-role="${id}" style="--tx:${tx}px;--ty:${ty}px">` +
          `<path class="wp-bg" d="${petala(R0, R, a0, a1)}" fill="${ROLES[id].cor}"/>` +
          `<path class="wp-val" d="" fill="${ROLES[id].cor}"/></g>`);
      });
      if (o.rings) [2, 4, 6, 8].forEach((k) => parts.push(`<circle class="w-ring" r="${R0 + (R - R0) * k / 10}"/>`));
      parts.push(`<circle class="w-rim" r="${R + 3}"/>`);
      parts.push(`<circle class="w-core" r="${R0}"/>`);
      if (o.center) parts.push(`<text class="w-center" x="0" y="1">${o.center}</text>`);
      if (o.labels) {
        ORDER.forEach((id, i) => {
          const { m } = angles(i);
          const [x, y] = pt(R + 26, m);
          const anchor = Math.abs(x) < 8 ? 'middle' : (x > 0 ? 'start' : 'end');
          parts.push(`<text class="w-label" data-role="${id}" x="${x}" y="${y}" text-anchor="${anchor}">${ROLES[id].nome}</text>`);
        });
      }
      this.el.innerHTML = `<svg viewBox="${-pad} ${-pad} ${pad * 2} ${pad * 2}" role="img" aria-hidden="true" focusable="false">${parts.join('')}</svg>`;
      this.svg = $('svg', this.el);
      this.vals = Object.fromEntries(ORDER.map((id) => [id, $(`.wp[data-role="${id}"] .wp-val`, this.svg)]));
      if (o.onSelect) {
        $$('.wp, .w-label', this.svg).forEach((g) => {
          g.style.cursor = 'pointer';
          g.addEventListener('mouseenter', () => o.onSelect(g.dataset.role, 'hover'));
          g.addEventListener('click', () => o.onSelect(g.dataset.role, 'click'));
        });
      }
    }
    draw(v) { ORDER.forEach((id, i) => this.vals[id].setAttribute('d', valuePath(i, v[id]))); }
    set(target, dur = 1100) {
      const from = { ...this.cur }, to = Object.assign({ ...this.cur }, target);
      cancelAnimationFrame(this.anim);
      if (reduced || dur === 0) { this.cur = to; this.draw(to); return; }
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        ORDER.forEach((id, i) => {
          // pequeno atraso em cascata entre as pétalas
          const local = Math.min(Math.max((p - i * 0.05) / 0.75, 0), 1);
          this.cur[id] = from[id] + (to[id] - from[id]) * (1 - Math.pow(1 - local, 3));
        });
        this.draw(this.cur);
        if (p < 1) this.anim = requestAnimationFrame(step);
        else { this.cur = to; this.draw(to); }
      };
      this.anim = requestAnimationFrame(step);
    }
    focus(id) {
      this.svg.classList.toggle('has-focus', !!id);
      $$('[data-role]', this.svg).forEach((g) => g.classList.toggle('is-focus', g.dataset.role === id));
    }
  }

  // roda inicia (ou age) só quando entra na tela
  function whenVisible(el, cb, once = true) {
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      cb(e.isIntersecting);
      if (e.isIntersecting && once) io.disconnect();
    }), { threshold: 0.25 });
    io.observe(el);
  }

  // rodas que "respiram" alternando desenhos (hero da página e chamada da home)
  $$('[data-wheel="cycle"]').forEach((el) => {
    const w = new Wheel(el, { labels: el.dataset.labels === 'true' });
    let i = 0, timer = null;
    const next = () => { w.set(HERO_CYCLE[i % HERO_CYCLE.length], 1600); i++; };
    whenVisible(el, (vis) => {
      clearInterval(timer);
      if (vis) { if (i === 0) setTimeout(next, 500); timer = reduced ? null : setInterval(next, 4200); }
    }, false);
    if (reduced) w.set(HERO_CYCLE[0], 0);
  });

  // quatro desenhos da roda
  $$('[data-wheel-pattern]').forEach((el) => {
    const w = new Wheel(el, { rings: true, center: '' });
    whenVisible(el, (vis) => { if (vis) setTimeout(() => w.set(PRESETS[el.dataset.wheelPattern], 1500), 250); });
  });

  /* ---------- explorador dos seis papéis ---------- */
  const explorer = $('[data-wheel="explorer"]');
  if (explorer) {
    const tabs = $$('[data-role-tab]');
    const panel = $('[data-role-panel]');
    let current = null, auto = null, userTouched = false;
    const show = (id) => {
      if (id === current) return;
      current = id;
      const r = ROLES[id];
      w.focus(id);
      tabs.forEach((t) => {
        const on = t.dataset.roleTab === id;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      panel.classList.remove('is-swap'); void panel.offsetWidth; panel.classList.add('is-swap');
      panel.style.setProperty('--role', r.cor);
      $('[data-f="nome"]', panel).textContent = 'A ' + r.nome;
      $('[data-f="sub"]', panel).textContent = r.sub;
      $('[data-f="desc"]', panel).textContent = r.desc;
      $('[data-f="frase"]', panel).textContent = '“' + r.frase + '”';
      $('[data-f="perfil"]', panel).textContent = r.perfil;
      $('[data-f="arte"]', panel).textContent = r.arte;
      $('[data-f="metodo"]', panel).innerHTML = `<strong>${r.metodo[0]}</strong>: ${r.metodo[1]}`;
    };
    const stopAuto = () => { userTouched = true; clearInterval(auto); };
    const w = new Wheel(explorer, {
      labels: true, explode: 10,
      onSelect: (id, how) => { if (how === 'click' || how === 'hover') { stopAuto(); show(id); } }
    });
    tabs.forEach((t, idx) => {
      t.addEventListener('click', () => { stopAuto(); show(t.dataset.roleTab); });
      t.addEventListener('mouseenter', () => { stopAuto(); show(t.dataset.roleTab); });
      t.addEventListener('keydown', (e) => {
        const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (!k) return;
        e.preventDefault(); stopAuto();
        const n = tabs[(idx + k + tabs.length) % tabs.length];
        n.focus(); show(n.dataset.roleTab);
      });
    });
    show('cuidadora');
    whenVisible(explorer, (vis) => {
      if (vis) w.set(Object.fromEntries(ORDER.map((id) => [id, 10])), 1400);
    });
    whenVisible(explorer, (vis) => {
      clearInterval(auto);
      if (vis && !userTouched && !reduced) {
        auto = setInterval(() => {
          const i = ORDER.indexOf(current);
          show(ORDER[(i + 1) % ORDER.length]);
        }, 3600);
      }
    }, false);
  }

  /* ---------- prévia interativa (6 das 24 frases) ---------- */
  const demo = $('[data-demo]');
  if (demo) {
    const w = new Wheel($('[data-wheel="demo"]', demo), { rings: true });
    const steps = ORDER.slice(0, 6).sort((a, b) => Object.keys(ROLES).indexOf(a) - Object.keys(ROLES).indexOf(b));
    const answers = {};
    let idx = 0;
    const q = $('[data-demo-q]', demo), done = $('[data-demo-done]', demo);
    const scale = $('[data-demo-scale]', demo);
    for (let n = 1; n <= 10; n++) {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = n; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', 'false');
      b.addEventListener('click', () => answer(n));
      scale.appendChild(b);
    }
    const render = () => {
      const id = steps[idx], r = ROLES[id];
      q.classList.remove('is-swap'); void q.offsetWidth; q.classList.add('is-swap');
      q.style.setProperty('--role', r.cor);
      $('[data-d="cont"]', demo).textContent = `${idx + 1} de ${steps.length}`;
      $('[data-d="bar"]', demo).style.transform = `scaleX(${(idx) / steps.length})`;
      $('[data-d="nome"]', demo).textContent = 'A ' + r.nome;
      $('[data-d="frase"]', demo).textContent = r.frase;
      $('[data-d="r1"]', demo).textContent = r.r1;
      $('[data-d="r10"]', demo).textContent = r.r10;
      $$('button', scale).forEach((b) => b.setAttribute('aria-checked', String(+b.textContent === answers[id])));
      $('[data-demo-back]', demo).hidden = idx === 0;
      w.focus(id);
    };
    const answer = (n) => {
      const id = steps[idx];
      answers[id] = n;
      $$('button', scale).forEach((b) => b.setAttribute('aria-checked', String(+b.textContent === n)));
      w.set({ [id]: n }, 700);
      setTimeout(() => {
        if (idx < steps.length - 1) { idx++; render(); }
        else finish();
      }, reduced ? 0 : 420);
    };
    const finish = () => {
      w.focus(null);
      $('[data-d="bar"]', demo).style.transform = 'scaleX(1)';
      q.hidden = true; done.hidden = false;
      const vals = steps.map((id) => answers[id]);
      const max = Math.max(...vals), min = Math.min(...vals);
      const alto = steps.filter((id) => answers[id] === max).map((id) => ROLES[id].nome);
      const baixo = steps.filter((id) => answers[id] === min).map((id) => ROLES[id].nome);
      const lista = (a) => a.length > 1 ? a.slice(0, -1).join(', ') + ' e ' + a[a.length - 1] : a[0];
      $('[data-d="leitura"]', done).innerHTML = max === min
        ? 'Nesta prévia, os seis papéis ficaram no mesmo nível. A roda completa olha cada papel por quatro frases e mostra nuances que seis respostas não alcançam.'
        : `Nesta prévia, <strong>${lista(alto)}</strong> ${alto.length > 1 ? 'aparecem' : 'aparece'} com mais energia, e <strong>${lista(baixo)}</strong> ${baixo.length > 1 ? 'pedem' : 'pede'} mais atenção. A roda completa confirma (ou não) esse desenho com as 24 frases.`;
      done.classList.remove('is-swap'); void done.offsetWidth; done.classList.add('is-swap');
    };
    $('[data-demo-back]', demo).addEventListener('click', () => { if (idx > 0) { idx--; render(); } });
    $('[data-demo-reset]', demo).addEventListener('click', () => {
      Object.keys(answers).forEach((k) => delete answers[k]);
      idx = 0; q.hidden = false; done.hidden = true;
      w.set(Object.fromEntries(ORDER.map((id) => [id, 0])), 600);
      render();
    });
    render();
  }

  // links "fazer a roda" apontam sempre para o app
  $$('[data-app-link]').forEach((a) => { a.href = APP_URL; });
})();
