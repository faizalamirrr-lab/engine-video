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
