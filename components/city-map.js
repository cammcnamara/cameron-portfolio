class CityMap extends HTMLElement {
    connectedCallback() {
        this.lat = 47.6062;
        this.lon = -122.3321;
        this.cityName = 'Seattle, WA';
        this.render();
        this.loadLeaflet().then(() => this.initMap());

        document.addEventListener('city-selected', e => {
            const { latitude, longitude, name, country } = e.detail;
            this.lat = latitude;
            this.lon = longitude;
            this.cityName = `${name}, ${country}`;
            this.updateMap();
        });
    }

    async loadLeaflet() {
        if (window.L) return;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        await new Promise(resolve => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }

    initMap() {
        this.map = L.map(this.querySelector('#map-container'), {
            center: [this.lat, this.lon],
            zoom: 10,
            zoomControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'OpenStreetMap'
        }).addTo(this.map);

        this.marker = L.marker([this.lat, this.lon])
            .addTo(this.map)
            .bindPopup(`<strong>${this.cityName}</strong>`)
            .openPopup();
    }

    updateMap() {
        if (!this.map) return;
        this.map.flyTo([this.lat, this.lon], 10);
        this.marker.setLatLng([this.lat, this.lon])
            .setPopupContent(`<strong>${this.cityName}</strong>`)
            .openPopup();
    }

    render() {
        this.innerHTML = `
            <article class="map-card">
                <style>
                    city-map { display: block; }

                    .map-card {
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

                    .map-card__header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .map-card h2 {
                        margin: 0;
                        font-size: var(--font-size-3, 1.25rem);
                        font-weight: var(--font-weight-7, 700);
                        color: var(--color-text, #111);
                    }

                    .map-card__badge {
                        background: var(--color-surface-2, #f0f0f0);
                        font-size: var(--font-size-0, 0.75rem);
                        font-weight: var(--font-weight-7, 700);
                        padding: 0.25rem 0.65rem;
                        border-radius: 999px;
                        color: var(--color-text-muted, #666);
                    }

                    #map-container {
                        width: 100%;
                        height: 300px;
                        border-radius: var(--radius-2, 0.5rem);
                        overflow: hidden;
                        z-index: 0;
                    }
                </style>

                <header class="map-card__header">
                    <h2>City Map</h2>
                    <span class="map-card__badge">OpenStreetMap</span>
                </header>

                <section id="map-container"></section>
            </article>
        `;
    }
}

customElements.define('city-map', CityMap);