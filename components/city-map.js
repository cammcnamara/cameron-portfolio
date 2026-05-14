class CityMap extends HTMLElement {
    connectedCallback() {
        this.token = 'YOUR_MAPBOX_TOKEN';
        this.defaultLat = 47.6062;
        this.defaultLon = -122.3321;
        this.render();
        this.initMap();

        document.addEventListener('city-selected', e => {
            const { latitude, longitude, name, country } = e.detail;
            this.map.flyTo({
                center: [longitude, latitude],
                zoom: 10,
                essential: true
            });
            new mapboxgl.Marker({ color: 'var(--color-accent)' })
                .setLngLat([longitude, latitude])
                .setPopup(new mapboxgl.Popup().setHTML(`<strong>${name}, ${country}</strong>`))
                .addTo(this.map)
                .togglePopup();
        });
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

                    #map {
                        width: 100%;
                        height: 300px;
                        border-radius: var(--radius-2, 0.5rem);
                        overflow: hidden;
                    }
                </style>

                <header class="map-card__header">
                    <h2>🗺️ City Map</h2>
                    <span class="map-card__badge">Mapbox</span>
                </header>

                <section id="map"></section>
            </article>
        `;
    }

    initMap() {
        // Load Mapbox GL JS dynamically
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js';
        script.onload = () => {
            mapboxgl.accessToken = this.token;
            this.map = new mapboxgl.Map({
                container: this.querySelector('#map'),
                style: 'mapbox://styles/mapbox/dark-v11',
                center: [this.defaultLon, this.defaultLat],
                zoom: 9
            });

            // Default marker on Seattle
            new mapboxgl.Marker({ color: '#3b82f6' })
                .setLngLat([this.defaultLon, this.defaultLat])
                .setPopup(new mapboxgl.Popup().setHTML('<strong>Seattle, WA</strong><br>BlackRock · Starting 2026'))
                .addTo(this.map)
                .togglePopup();

            this.map.addControl(new mapboxgl.NavigationControl());
        };
        document.head.appendChild(script);
    }
}

customElements.define('city-map', CityMap);