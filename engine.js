let currentScene = 0;
let timer = null;

function renderScene(index) {
  const container = document.getElementById('canvas-9-16');
  const scenes = window.DATA_VIDEO || [];
  if (!container || scenes.length === 0) return;

  const s = scenes[index];
  const animClass = s.animasi ? `anim-${s.animasi}` : 'anim-pop';
  const durasiMs = (s.durasi || 3) * 1000;

  container.style.background = s.bg || 'linear-gradient(135deg, #0f172a, #1e1b4b)';
  container.style.color = s.warnaTeks || '#ffffff';

  container.innerHTML = `
    ${s.kategori ? `<div class="badge">${s.kategori}</div>` : ''}
    <div class="ikon ${animClass}">${s.ikon || ''}</div>
    <div class="judul ${animClass}" style="color: ${s.warnaJudul || s.warnaTeks || '#fff'}">${s.teksUtama || ''}</div>
    <div class="subteks ${animClass}">${s.subTeks || ''}</div>
    <div id="progress-bar" style="transition: width ${durasiMs}ms linear; width: 0%;"></div>
  `;

  // Jalankan animasi progress bar
  setTimeout(() => {
    const bar = document.getElementById('progress-bar');
    if (bar) bar.style.width = '100%';
  }, 50);

  clearTimeout(timer);
  timer = setTimeout(() => {
    currentScene = (currentScene + 1) % scenes.length;
    renderScene(currentScene);
  }, durasiMs);
}

function setupControls() {
  const ctrl = document.createElement('div');
  ctrl.className = 'controls';
  ctrl.innerHTML = `
    <button class="btn" onclick=" currentScene = 0; renderScene(0);">⏮ Ulangi dari Awal</button>
    <button class="btn" onclick=" currentScene = (currentScene + 1) % window.DATA_VIDEO.length; renderScene(currentScene);">⏭ Scene Berikutnya</button>
  `;
  document.body.appendChild(ctrl);
}

window.addEventListener('DOMContentLoaded', () => {
  setupControls();
  renderScene(0);
});
