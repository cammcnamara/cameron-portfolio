const params = new URLSearchParams(window.location.search);
const success = document.getElementById('contact-success');
if (params.get('success') === 'true' && success) {
    success.hidden = false;
}

export async function onRequestPost(context) {
    const formData = await context.request.formData();

    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    if (!name || !email || !message) {
        return new Response('Missing fields', { status: 400 });
    }

    const emailRes = await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            personalizations: [{
                to: [{ email: 'cameronmcnamara@sandiego.edu' }]
            }],
            from: { email: 'noreply@yourdomain.com', name: 'Portfolio Contact' },
            subject: `New message from ${name}`,
            content: [{
                type: 'text/plain',
                value: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
            }]
        })
    });

    if (emailRes.ok) {
        return Response.redirect(context.request.headers.get('referer') + '?success=true', 302);
    }

    return new Response('Failed to send', { status: 500 });
}