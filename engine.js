let currentScene = 0;
let timer = null;

function renderScene(index) {
  const container = document.getElementById('canvas-9-16');
  const scenes = window.DATA_VIDEO || [];
  if (!container || scenes.length === 0) return;

  const s = scenes[index];
  const durasiMs = (s.durasi || 3) * 1000;

  container.style.background = s.bg || 'linear-gradient(135deg, #0f172a, #1e1b4b)';

  container.innerHTML = `
    <div class="orbit-ring"></div>
    ${s.kategori ? `<div class="badge">${s.kategori}</div>` : ''}
    <div class="ikon-container">${s.ikon || ''}</div>
    <div class="judul" style="color: ${s.warnaJudul || '#fff'}">${s.teksUtama || ''}</div>
    <div class="subteks" style="color: ${s.warnaTeks || '#fff'}">${s.subTeks || ''}</div>
    <div id="progress-bar" style="transition: width ${durasiMs}ms linear; width: 0%;"></div>
  `;

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
