window.DATA_VIDEO = [
  {
    durasi: 6,
    kategori: "WHAT IF SCIENCE",
    warnaJudul: "#38bdf8",
    bg: "linear-gradient(135deg, #0b1b3a, #1d4e89)",
    ikon: `<svg viewBox="0 0 120 120" width="110" height="110">
      <circle cx="60" cy="60" r="52" fill="#0f172a" stroke="#38bdf8" stroke-width="6"/>
      <text x="60" y="76" text-anchor="middle" fill="#ff8c24" font-size="44" font-weight="900">5s</text>
    </svg>`,
    teksUtama: "WHAT IF EARTH LOST OXYGEN?",
    subTeks: "Hold your breath for five seconds. Easy, right? But Earth with zero percent oxygen is instantly fatal."
  },
  {
    durasi: 7,
    kategori: "FACT #1 • STRUCTURES",
    warnaJudul: "#ff8c24",
    bg: "linear-gradient(135deg, #1a1a2e, #5a2f2a)",
    ikon: `<svg viewBox="0 0 120 120" width="110" height="110">
      <polygon points="60,12 105,35 60,58 15,35" fill="#e2e8f0"/>
      <polygon points="15,35 60,58 60,108 15,85" fill="#94a3b8"/>
      <polygon points="105,35 60,58 60,108 105,85" fill="#64748b"/>
      <circle cx="35" cy="98" r="5" fill="#ff8c24"/>
      <circle cx="85" cy="95" r="4" fill="#ff8c24"/>
    </svg>`,
    teksUtama: "CONCRETE TURNS INTO DUST!",
    subTeks: "Oxygen acts as a chemical glue. Without it, every concrete building, bridge, and dam instantly crumbles."
  },
  {
    durasi: 8,
    kategori: "FACT #2 • ATMOSPHERE",
    warnaJudul: "#c084fc",
    bg: "linear-gradient(135deg, #02030a, #1e1b4b)",
    ikon: `<svg viewBox="0 0 120 120" width="110" height="110">
      <circle cx="60" cy="60" r="36" fill="#fde047"/>
      <path d="M 15 95 Q 60 65 105 95" stroke="#c084fc" stroke-width="6" stroke-dasharray="8 6" fill="none"/>
    </svg>`,
    teksUtama: "DAYTIME SKY GOES BLACK!",
    subTeks: "With fewer particles to scatter light, the sky turns pitch black while the ozone vanishes, cooking bare skin with UV rays."
  },
  {
    durasi: 8,
    kategori: "FACT #3 • PRESSURE",
    warnaJudul: "#f43f5e",
    bg: "linear-gradient(135deg, #0a1128, #3b0764)",
    ikon: `<svg viewBox="0 0 120 120" width="110" height="110">
      <polygon points="20,65 105,35 75,95 55,72" fill="#f8fafc"/>
      <polygon points="20,65 55,72 45,90" fill="#f43f5e"/>
    </svg>`,
    teksUtama: "AIR PRESSURE DROPS -21%!",
    subTeks: "Everyone's inner ear explodes from the sudden pressure drop, and every combustion engine stalls in mid-air."
  },
  {
    durasi: 7,
    kategori: "FINAL CLIMAX",
    warnaJudul: "#facc15",
    bg: "linear-gradient(135deg, #1b0f0a, #4a2a14)",
    ikon: `<svg viewBox="0 0 120 120" width="110" height="110">
      <polygon points="60,20 110,50 60,80 10,50" fill="#ca8a04"/>
      <polygon points="10,50 60,80 60,105 10,75" fill="#a16207"/>
      <polygon points="110,50 60,80 60,105 110,75" fill="#713f12"/>
      <polyline points="35,45 60,60 80,42" stroke="#090d16" stroke-width="5" fill="none"/>
    </svg>`,
    teksUtama: "EARTH'S CRUST IS 45% OXYGEN!",
    subTeks: "Even the ground beneath your feet crumbles away. Five seconds is all it takes to erase civilization."
  }
];
let currentScene = 0;
let sceneTimer = null;
let exitTimer = null;
let activeAnimations = [];

function clearAllTimers() {
  if (sceneTimer) clearTimeout(sceneTimer);
  if (exitTimer) clearTimeout(exitTimer);
  activeAnimations.forEach(anim => anim.cancel());
  activeAnimations = [];
}

function createParticles(container) {
  let html = '';
  for (let i = 0; i < 14; i++) {
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    html += `<div class="particle" style="width:${size}px; height:${size}px; left:${left}%; top:${top}%; opacity:${Math.random()*0.6 + 0.2}"></div>`;
  }
  container.innerHTML = html;

  const particles = container.querySelectorAll('.particle');
  particles.forEach((p, idx) => {
    const anim = p.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: p.style.opacity },
      { transform: `translate(${(Math.random() - 0.5) * 50}px, -${Math.random() * 120 + 60}px) scale(0.2)`, opacity: 0 }
    ], {
      duration: Math.random() * 2500 + 2000,
      iterations: Infinity,
      delay: idx * 120,
      easing: 'ease-out'
    });
    activeAnimations.push(anim);
  });
}

function renderScene(index) {
  const container = document.getElementById('canvas-9-16');
  const scenes = window.DATA_VIDEO || [];
  if (!container || scenes.length === 0) return;

  clearAllTimers();

  const s = scenes[index];
  const durasiMs = (s.durasi || 4) * 1000;
  const warnaJudul = s.warnaJudul || '#38bdf8';

  // Pecah kalimat menjadi array kata untuk Kinetic Typography
  const judulWords = (s.teksUtama || '').split(' ').filter(Boolean);
  const subWords = (s.subTeks || '').split(' ').filter(Boolean);

  const judulHtml = judulWords.map((w, i) => {
    // Beri warna aksen pada kata-kata penting / terakhir
    const isHighlight = (i === judulWords.length - 1 || w.includes('?') || w.includes('!'));
    const color = isHighlight ? warnaJudul : '#ffffff';
    return `<span class="word-judul" style="color: ${color}">${w}</span>`;
  }).join('');

  const subHtml = subWords.map(w => `<span class="word-sub">${w}</span>`).join('');

  container.innerHTML = `
    <div class="bg-layer" id="bg-layer" style="background: ${s.bg || 'linear-gradient(135deg, #0f172a, #1e1b4b)'}"></div>
    <div class="grid-overlay" id="grid-layer"></div>
    <div class="glow-orb" id="glow-orb" style="background: ${warnaJudul}"></div>
    <div class="orbit-ring" id="orbit-outer"></div>
    <div class="orbit-ring-inner" id="orbit-inner"></div>
    <div class="particles-container" id="particles"></div>

    <div class="scene-stage" id="scene-stage">
      ${s.kategori ? `<div class="badge" id="el-badge">${s.kategori}</div>` : ''}
      <div class="ikon-wrapper">
        <div class="ikon-shockwave" id="el-wave"></div>
        <div class="ikon-utama" id="el-ikon">${s.ikon || '✨'}</div>
      </div>
      <div class="judul-wrap" id="el-judul">${judulHtml}</div>
      <div class="subteks-wrap" id="el-sub">${subHtml}</div>
    </div>

    <div id="progress-bar"></div>
  `;

  // 1. Hidupkan partikel dan rotasi latar
  createParticles(document.getElementById('particles'));

  const bgLayer = document.getElementById('bg-layer');
  activeAnimations.push(bgLayer.animate([
    { transform: 'scale(1) rotate(0deg)' },
    { transform: 'scale(1.12) rotate(1.5deg)' }
  ], { duration: durasiMs, fill: 'forwards', easing: 'ease-out' }));

  const orbitOuter = document.getElementById('orbit-outer');
  activeAnimations.push(orbitOuter.animate([
    { transform: 'rotate(0deg) scale(0.9)' },
    { transform: 'rotate(90deg) scale(1.05)' }
  ], { duration: durasiMs, fill: 'forwards', easing: 'linear' }));

  const orbitInner = document.getElementById('orbit-inner');
  activeAnimations.push(orbitInner.animate([
    { transform: 'rotate(360deg) scale(1.1)' },
    { transform: 'rotate(180deg) scale(0.95)' }
  ], { duration: durasiMs, fill: 'forwards', easing: 'linear' }));

  const glowOrb = document.getElementById('glow-orb');
  activeAnimations.push(glowOrb.animate([
    { transform: 'translate(-30px, -40px) scale(0.8)', opacity: 0.3 },
    { transform: 'translate(30px, 30px) scale(1.2)', opacity: 0.55 }
  ], { duration: durasiMs, direction: 'alternate', iterations: Infinity, easing: 'ease-in-out' }));

  // 2. Animasi Spring Masuk: Badge
  const badge = document.getElementById('el-badge');
  if (badge) {
    activeAnimations.push(badge.animate([
      { opacity: 0, transform: 'translateY(-35px) scale(0.5)', filter: 'blur(8px)' },
      { opacity: 1, transform: 'translateY(4px) scale(1.06)', filter: 'blur(0px)', offset: 0.7 },
      { opacity: 1, transform: 'translateY(0px) scale(1)', filter: 'blur(0px)' }
    ], { duration: 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }));
  }

  // 3. Animasi Spring Masuk + Floating Kontinu: Ikon & Gelombang Kejut
  const ikon = document.getElementById('el-ikon');
  const wave = document.getElementById('el-wave');
  if (ikon) {
    activeAnimations.push(ikon.animate([
      { opacity: 0, transform: 'scale(0.1) rotate(-25deg)', filter: 'blur(12px)' },
      { opacity: 1, transform: 'scale(1.22) rotate(8deg)', filter: 'blur(0px)', offset: 0.55 },
      { opacity: 1, transform: 'scale(0.93) rotate(-4deg)', offset: 0.78 },
      { opacity: 1, transform: 'scale(1) rotate(0deg)' }
    ], { duration: 850, delay: 80, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }));

    // Gerakan mengambang terus-menerus setelah muncul agar tidak mati/kaku
    activeAnimations.push(ikon.animate([
      { transform: 'translateY(0px) rotate(0deg) scale(1)' },
      { transform: 'translateY(-10px) rotate(4deg) scale(1.05)' },
      { transform: 'translateY(0px) rotate(0deg) scale(1)' }
    ], { duration: 2200, delay: 900, iterations: Infinity, easing: 'ease-in-out' }));
  }

  if (wave) {
    activeAnimations.push(wave.animate([
      { opacity: 0.9, transform: 'scale(0.4)' },
      { opacity: 0, transform: 'scale(2.2)' }
    ], { duration: 1000, delay: 180, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }));
  }

  // 4. Staggered Kinetic Typography: Kata demi Kata pada Judul
  const wordEls = container.querySelectorAll('.word-judul');
  wordEls.forEach((el, i) => {
    activeAnimations.push(el.animate([
      { opacity: 0, transform: 'translateY(45px) scale(0.65) rotateX(-45deg)', filter: 'blur(8px)' },
      { opacity: 1, transform: 'translateY(-5px) scale(1.06) rotateX(0deg)', filter: 'blur(0
