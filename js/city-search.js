document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('city-input');
    const btn = document.getElementById('city-search-btn');
    const error = document.getElementById('city-search-error');

    async function search() {
        const city = input.value.trim();
        if (!city) return;

        error.hidden = true;
        btn.textContent = 'Searching...';
        btn.disabled = true;

        try {
            const res = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
            );
            const data = await res.json();

            if (!data.results?.length) {
                error.hidden = false;
                return;
            }

            const { latitude, longitude, name, country } = data.results[0];
            document.dispatchEvent(new CustomEvent('city-selected', {
                detail: { latitude, longitude, name, country }
            }));

        } catch (err) {
            error.hidden = false;
            console.error(err);
        } finally {
            btn.textContent = 'Search';
            btn.disabled = false;
        }
    }

    btn.addEventListener('click', search);
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') search();
    });
});