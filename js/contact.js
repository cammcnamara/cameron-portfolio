const params = new URLSearchParams(window.location.search);
const success = document.getElementById('contact-success');
if (params.get('success') === 'true' && success) {
    success.hidden = false;
}
