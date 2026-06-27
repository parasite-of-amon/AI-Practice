const STORAGE_KEY = 'stylehub-theme';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'light' ? 'dark' : 'light');
}

// Apply saved theme immediately (before paint to avoid flash)
const saved = localStorage.getItem(STORAGE_KEY);
if (saved === 'dark' || saved === 'light') applyTheme(saved);

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.addEventListener('click', toggleTheme);
});
