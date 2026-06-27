export function showToast(msg, duration = 2800) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add('toast-exit');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }, duration);
}
