export async function onRequestGet(context) {
    const symbol = new URL(context.request.url).searchParams.get('symbol');

    if (!symbol) {
        return new Response('Missing symbol', { status: 400 });
    }

    const res = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${context.env.FINNHUB_API_KEY}`
    );

    const data = await res.json();

    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}