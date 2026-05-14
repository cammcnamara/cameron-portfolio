class StockTicker extends HTMLElement {
    connectedCallback() {
        this.stocks = ['NVDA', 'CSCO', 'AMD'];
        this.render();
        this.listEl = this.querySelector('[data-stocks]');
        this.statusEl = this.querySelector('[data-status]');
        this.button = this.querySelector('button');
        this.button.addEventListener('click', () => this.loadStocks());
        this.loadStocks();
    }

    render() {
        this.innerHTML = `
            <article class="stock-card">
                <style>
                    stock-ticker { display: block; }

                    .stock-card {
                        background: var(--color-surface, #fff);
                        border: 2px solid var(--color-border, #eee);
                        border-radius: var(--radius-3, 1rem);
                        padding: var(--size-5, 1.25rem);
                        display: flex;
                        flex-direction: column;
                        gap: var(--size-4, 1rem);
                    }

                    .stock-card__header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .stock-card h2 {
                        margin: 0;
                        font-size: var(--font-size-3, 1.25rem);
                        font-weight: var(--font-weight-7, 700);
                        color: var(--color-text, #111);
                    }

                    .stock-card__badge {
                        background: var(--color-surface-2, #f0f0f0);
                        font-size: var(--font-size-0, 0.75rem);
                        font-weight: var(--font-weight-7, 700);
                        padding: 0.25rem 0.65rem;
                        border-radius: 999px;
                        color: var(--color-text-muted, #666);
                    }

                    .stock-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: var(--size-3, 0.75rem) 0;
                        border-bottom: 1px solid var(--color-border, #eee);
                    }

                    .stock-item:last-of-type {
                        border-bottom: none;
                    }

                    .stock-item__left {
                        display: flex;
                        flex-direction: column;
                        gap: 0.15rem;
                    }

                    .stock-item__ticker {
                        font-size: var(--font-size-2, 1rem);
                        font-weight: var(--font-weight-7, 700);
                        color: var(--color-text, #111);
                    }

                    .stock-item__name {
                        font-size: var(--font-size-0, 0.75rem);
                        color: var(--color-text-muted, #666);
                    }

                    .stock-item__right {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;
                        gap: 0.15rem;
                    }

                    .stock-item__price {
                        font-size: var(--font-size-2, 1rem);
                        font-weight: var(--font-weight-7, 700);
                        color: var(--color-text, #111);
                    }

                    .stock-item__change {
                        font-size: var(--font-size-0, 0.75rem);
                        font-weight: var(--font-weight-6, 600);
                        padding: 2px var(--size-2, 0.5rem);
                        border-radius: 999px;
                    }

                    .stock-item__change.up {
                        background: #d1fae5;
                        color: #065f46;
                    }

                    .stock-item__change.down {
                        background: #fee2e2;
                        color: #991b1b;
                    }

                    .stock-card__footer {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .stock-card button {
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

                    .stock-card button:hover { opacity: 0.75; }

                    .stock-card__status {
                        font-size: var(--font-size-0, 0.75rem);
                        color: var(--color-text-muted, #666);
                    }
                </style>

                <header class="stock-card__header">
                    <h2>📈 Watchlist</h2>
                    <span class="stock-card__badge">Live</span>
                </header>

                <section data-stocks aria-live="polite">
                    <p>Loading stocks...</p>
                </section>

                <footer class="stock-card__footer">
                    <button type="button">Refresh</button>
                    <p class="stock-card__status" data-status role="status"></p>
                </footer>
            </article>
        `;
    }

    async loadStocks() {
        this.setLoading(true);

        const names = {
            NVDA: 'NVIDIA',
            CSCO: 'Cisco',
            AMD: 'Advanced Micro Devices'
        };

        try {
            const results = await Promise.all(
                this.stocks.map(async ticker => {
                    const res = await fetch(`/stocks?symbol=${ticker}`);
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    const data = await res.json();
                    return { ticker, data, name: names[ticker] };
                })
            );

            this.listEl.innerHTML = results.map(({ ticker, name, data }) => {
                const price = data.c.toFixed(2);
                const change = data.d.toFixed(2);
                const changePct = data.dp.toFixed(2);
                const isUp = data.d >= 0;

                return `
                    <section class="stock-item">
                        <section class="stock-item__left">
                            <span class="stock-item__ticker">${ticker}</span>
                            <span class="stock-item__name">${name}</span>
                        </section>
                        <section class="stock-item__right">
                            <span class="stock-item__price">$${price}</span>
                            <span class="stock-item__change ${isUp ? 'up' : 'down'}">
                                ${isUp ? '▲' : '▼'} ${Math.abs(change)} (${Math.abs(changePct)}%)
                            </span>
                        </section>
                    </section>
                `;
            }).join('');

            this.statusEl.textContent = `Updated ${new Date().toLocaleTimeString()}`;

        } catch (err) {
            console.error(err);
            this.listEl.innerHTML = '<p>Could not load stock data.</p>';
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

customElements.define('stock-ticker', StockTicker);