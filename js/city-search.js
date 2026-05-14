document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('city-input');
    const btn = document.getElementById('city-search-btn');

    async function search() {
        const city = input.value.trim();
        if (!city) return;

        const res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
        );
        const data = await res.json();

        if (!data.results?.length) return;

        const { latitude, longitude, name, country } = data.results[0];

        // Fire a custom event both components listen for
        document.dispatchEvent(new CustomEvent('city-selected', {
            detail: { latitude, longitude, name, country }
        }));
    }

    btn.addEventListener('click', search);
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') search();
    });
});