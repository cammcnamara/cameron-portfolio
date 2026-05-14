class SeattleWeather extends HTMLElement {
    connectedCallback() {
        this.lat = 47.6062;
        this.lon = -122.3321;
        this.render();
        this.tempEl = this.querySelector('[data-temp]');
        this.descEl = this.querySelector('[data-desc]');
        this.windEl = this.querySelector('[data-wind]');
        this.humidEl = this.querySelector('[data-humid]');
        this.iconEl = this.querySelector('[data-icon]');
        this.statusEl = this.querySelector('[data-status]');
        this.button = this.querySelector('[data-refresh]');

        this.button.addEventListener('click', () => this.loadWeather());

        document.addEventListener('city-selected', e => {
            const { latitude, longitude, name, country } = e.detail;
            this.lat = latitude;
            this.lon = longitude;
            this.querySelector('[data-city-title]').textContent = `🌤️ ${name}, ${country}`;
            this.loadWeather();
        });

        this.loadWeather();
    }

    getIcon(code) {
        if (code === 0) return '☀️';
        if (code <= 2) return '⛅';
        if (code <= 3) return '☁️';
        if (code <= 49) return '🌫️';
        if (code <= 59) return '🌦️';
        if (code <= 69) return '🌧️';
        if (code <= 79) return '🌨️';
        if (code <= 84) return '🌧️';
        if (code <= 99) return '⛈️';
        return '🌡️';
    }

    getDesc(code) {
        if (code === 0) return 'Clear sky';
        if (code <= 2) return 'Partly cloudy';
        if (code <= 3) return 'Overcast';
        if (code <= 49) return 'Foggy';
        if (code <= 59) return 'Drizzle';
        if (code <= 69) return 'Rainy';
        if (code <= 79) return 'Snowy';
        if (code <= 84) return 'Rain showers';
        if (code <= 99) return 'Thunderstorm';
        return 'Unknown';
    }

    render() {
        this.innerHTML = `
            <article class="weather-card">
                <style>
                    seattle-weather { display: block; }

                    .weather-card {
                        background: var(--color-surface, #fff);
                        border: 2px solid var(--color-border, #eee);
                        border-radius: var(--radius-3, 1rem);
                        padding: var(--size-5, 1.25rem);
                        display: flex;
                        flex-direction: column;
                        gap: var(--size-4, 1rem);
                        width: 100%;
                        box-sizing: border-box;
                    }

                    .weather-card__header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .weather-card h2 {
                        margin: 0;
                        font-size: var(--font-size-3, 1.25rem);
                        font-weight: var(--font-weight-7, 700);
                        color: var(--color-text, #111);
                    }

                    .weather-card__badge {
                        background: var(--color-surface-2, #f0f0f0);
                        font-size: var(--font-size-0, 0.75rem);
                        font-weight: var(--font-weight-7, 700);
                        padding: 0.25rem 0.65rem;
                        border-radius: 999px;
                        color: var(--color-text-muted, #666);
                        white-space: nowrap;
                    }

                    .weather-card__main {
                        display: flex;
                        align-items: center;
                        gap: var(--size-4, 1rem);
                    }

                    .weather-card__icon {
                        font-size: 4rem;
                        line-height: 1;
                    }

                    .weather-card__temp {
                        font-size: var(--font-size-7, 3rem);
                        font-weight: var(--font-weight-9, 900);
                        color: var(--color-text, #111);
                        line-height: 1;
                        margin: 0;
                    }

                    .weather-card__desc {
                        font-size: var(--font-size-1, 0.875rem);
                        color: var(--color-text-muted, #666);
                        margin: var(--size-1, 0.25rem) 0 0;
                    }

                    .weather-card__details {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: var(--size-2, 0.5rem);
                        padding-top: var(--size-3, 0.75rem);
                        border-top: 1px solid var(--color-border, #eee);
                    }

                    .weather-card__detail {
                        display: flex;
                        flex-direction: column;
                        gap: 0.15rem;
                    }

                    .weather-card__detail-label {
                        font-size: var(--font-size-0, 0.75rem);
                        color: var(--color-text-muted, #666);
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }

                    .weather-card__detail-value {
                        font-size: var(--font-size-2, 1rem);
                        font-weight: var(--font-weight-7, 700);
                        color: var(--color-text, #111);
                    }

                    .weather-card__footer {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .weather-card__footer button {
                        background: var(--color-surface-2, #f0f0f0);
                        color: var(--color-text, #111);
                        border: none;
                        border-radius: 999px;
                        padding: 0.5rem 1rem;
                        font: inherit;
                        font-size: var(--font-size-0, 0.75rem);
                        font-weight: var(--font-weight-7, 700);
                        cursor: pointer;
                        transition: opacity 200ms;
                    }

                    .weather-card__footer button:hover { opacity: 0.75; }

                    .weather-card__status {
                        font-size: var(--font-size-0, 0.75rem);
                        color: var(--color-text-muted, #666);
                    }
                </style>

                <header class="weather-card__header">
                    <h2 data-city-title>🌧️ Seattle, USA</h2>
                    <span class="weather-card__badge">Live</span>
                </header>

                <section class="weather-card__main">
                    <span class="weather-card__icon" data-icon>⏳</span>
                    <section>
                        <p class="weather-card__temp" data-temp>--°</p>
                        <p class="weather-card__desc" data-desc>Loading...</p>
                    </section>
                </section>

                <section class="weather-card__details">
                    <section class="weather-card__detail">
                        <span class="weather-card__detail-label">Wind</span>
                        <span class="weather-card__detail-value" data-wind>--</span>
                    </section>
                    <section class="weather-card__detail">
                        <span class="weather-card__detail-label">Humidity</span>
                        <span class="weather-card__detail-value" data-humid>--</span>
                    </section>
                </section>

                <footer class="weather-card__footer">
                    <button type="button" data-refresh>Refresh</button>
                    <p class="weather-card__status" data-status role="status"></p>
                </footer>
            </article>
        `;
    }

    async loadWeather() {
        this.setLoading(true);

        try {
            const res = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph`
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            const c = data.current;

            this.tempEl.textContent = `${Math.round(c.temperature_2m)}°F`;
            this.descEl.textContent = this.getDesc(c.weather_code);
            this.iconEl.textContent = this.getIcon(c.weather_code);
            this.windEl.textContent = `${Math.round(c.wind_speed_10m)} mph`;
            this.humidEl.textContent = `${c.relative_humidity_2m}%`;
            this.statusEl.textContent = `Updated ${new Date().toLocaleTimeString()}`;

        } catch (err) {
            console.error(err);
            this.descEl.textContent = 'Could not load weather.';
            this.statusEl.textContent = 'Error loading data.';
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(isLoading) {
        if (!this.button) return;
        this.button.disabled = isLoading;
        this.button.textContent = isLoading ? 'Loading...' : 'Refresh';
    }
}

customElements.define('city-weather', SeattleWeather);