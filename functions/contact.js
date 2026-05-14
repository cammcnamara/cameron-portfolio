export async function onRequestPost(context) {
    const formData = await context.request.formData();

    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    if (!name || !email || !message) {
        return new Response('Missing fields', { status: 400 });
    }

    const RESEND_API_KEY = context.env.RESEND_API_KEY;

    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: 'Portfolio <onboarding@resend.dev>',
            to: 'cameronmcnamara04@gmail.com',
            subject: `New message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        })
    });

    if (res.ok) {
        return Response.redirect(`${new URL(context.request.url).origin}/contact.html?success=true`, 302);
    }

    return new Response('Failed to send', { status: 500 });
}