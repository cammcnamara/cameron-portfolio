class MlbScores extends HTMLElement {
    constructor() {
        super();
        this.teamId = 111; // Red Sox team ID in MLB Stats API
    }

    connectedCallback() {
        this.render();
        this.scoresList = this.querySelector('[data-scores]');
        this.status = this.querySelector('[data-status]');
        this.button = this.querySelector('button');
        this.button.addEventListener('click', () => this.loadScores());
        this.loadScores();
    }

    render() {
        this.innerHTML = `
            <article class="mlb-card">
                <style>
                    mlb-scores {
                        display: block;
                    }

                    .mlb-card {
                        background: var(--color-surface, #fff);
                        border: 2px solid var(--color-border, #eee);
                        border-radius: var(--radius-3, 1rem);
                        padding: var(--size-5, 1.25rem);
                        display: flex;
                        flex-direction: column;
                        gap: var(--size-4, 1rem);
                    }

                    .mlb-card__header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }

                    .mlb-card h2 {
                        margin: 0;
                        font-size: var(--font-size-3, 1.25rem);
                        font-weight: var(--font-weight-7, 700);
                        color: var(--color-text, #111);
                    }

                    .mlb-card__badge {
                        background: #bd3039;
                        color: #fff;
                        font-size: var(--font-size-0, 0.75rem);
                        font-weight: var(--font-weight-7, 700);
                        padding: 0.25rem 0.65rem;
                        border-radius: 999px;
                    }

                    .mlb-game {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: var(--size-3, 0.75rem) 0;
                        border-bottom: 1px solid var(--color-border, #eee);
                        gap: var(--size-4, 1rem);
                    }

                    .mlb-game:last-of-type {
                        border-bottom: none;
                    }

                    .mlb-game__teams {
                        display: flex;
                        flex-direction: column;
                        gap: 0.25rem;
                        font-size: var(--font-size-1, 0.875rem);
                        color: var(--color-text, #111);
                    }

                    .mlb-game__team {
                        display: flex;
                        justify-content: space-between;
                        gap: var(--size-6, 1.5rem);
                        width: 14rem;
                    }

                    .mlb-game__team.winner {
                        font-weight: var(--font-weight-7, 700);
                        color: var(--color-accent, #111);
                    }

                    .mlb-game__score {
                        font-weight: var(--font-weight-7, 700);
                        min-width: 1.5rem;
                        text-align: right;
                    }

                    .mlb-game__status {
                        font-size: var(--font-size-0, 0.75rem);
                        color: var(--color-text-muted, #666);
                        white-space: nowrap;
                        text-align: right;
                    }

                    .mlb-card__status {
                        font-size: var(--font-size-0, 0.75rem);
                        color: var(--color-text-muted, #666);
                    }

                    .mlb-card button {
                        align-self: flex-start;
                        background: var(--color-surface-2, #f0f0f0);
                        color: var(--color-text, #111);
                        border: none;
                        border-radius: 999px;
                        padding: 0.5rem 0.5rem;
                        margin-right: var(--size-4, 1rem);
                        font: inherit;
                        font-size: var(--font-size-0, 0.75rem);
                        font-weight: var(--font-weight-7, 700);
                        cursor: pointer;
                        transition: opacity 200ms;
                    }

                    .mlb-card button:hover {
                        opacity: 0.85;
                    }

                    .mlb-card button[aria-busy="true"] {
                        opacity: 0.6;
                        cursor: wait;
                    }
                </style>

                <header class="mlb-card__header">
                    <h2>Red Sox Scores</h2>
                    <span class="mlb-card__badge">MLB</span>
                </header>

                <section data-scores aria-live="polite">
                    <p>Loading games...</p>
                </section>

                <footer class="mlb-card__footer">
                    <button type="button">Refresh</button>
                    <p class="mlb-card__status" data-status role="status"></p>
                </footer>
            </article>
        `;
    }

    async loadScores() {
        this.setLoading(true);

        try {
            // MLB Stats API — free, no key needed
            const today = new Date();
            const dates = [];
            for (let i = 0; i < 7; i++) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                dates.push(d.toISOString().split('T')[0]);
            }

            // Fetch last 7 days and find Red Sox games
            const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=${this.teamId}&startDate=${dates[6]}&endDate=${dates[0]}&gameType=R&fields=dates,date,games,gamePk,status,abstractGameState,teams,away,home,team,name,score,isWinner`;

            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();

            const games = data.dates?.flatMap(d => d.games) ?? [];

            if (games.length === 0) {
                this.scoresList.innerHTML = '<p>No recent games found.</p>';
                this.status.textContent = 'No games in the last 7 days.';
                return;
            }

            // Show most recent 5
            const recent = games.slice(-3).reverse();

            this.scoresList.innerHTML = recent.map(game => {
                const away = game.teams.away;
                const home = game.teams.home;
                const state = game.status.abstractGameState;
                const isLive = state === 'Live';
                const isFinal = state === 'Final';

                const awayWinner = isFinal && away.isWinner;
                const homeWinner = isFinal && home.isWinner;

                const statusText = isLive ? '🔴 Live' : isFinal ? 'Final' : 'Scheduled';

                return `
                    <section class="mlb-game">
                        <section class="mlb-game__teams">
                            <section class="mlb-game__team ${awayWinner ? 'winner' : ''}">
                                <span>${away.team.name}</span>
                                <span class="mlb-game__score">${isFinal || isLive ? away.score ?? '-' : ''}</span>
                            </section>
                            <section class="mlb-game__team ${homeWinner ? 'winner' : ''}">
                                <span>${home.team.name}</span>
                                <span class="mlb-game__score">${isFinal || isLive ? home.score ?? '-' : ''}</span>
                            </section>
                        </section>
                        <span class="mlb-game__status">${statusText}</span>
                    </section>
                `;
            }).join('');

            this.status.textContent = `Updated ${new Date().toLocaleTimeString()}`;

        } catch (err) {
            console.error(err);
            this.scoresList.innerHTML = '<p>Could not load scores. Try again.</p>';
            this.status.textContent = 'Error loading scores.';
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(isLoading) {
        if (!this.button) return;
        this.button.disabled = isLoading;
        this.button.setAttribute('aria-busy', String(isLoading));
        this.button.textContent = isLoading ? 'Loading...' : 'Refresh';
    }
}

customElements.define('mlb-scores', MlbScores);