const select = document.getElementById('theme-select');
const saved = localStorage.getItem('theme');

if (saved) document.documentElement.className = saved;
if (select) select.value = saved || '';

select?.addEventListener('change', e => {
    document.documentElement.className = e.target.value;
    localStorage.setItem('theme', e.target.value);
});