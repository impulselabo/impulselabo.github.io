(() => {
  'use strict';

  const form = document.getElementById('feedback-form');
  const status = document.getElementById('feedback-status');
  if (!form || !status) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const button = form.querySelector('button[type="submit"]');
    const originalLabel = button ? button.textContent : '';

    status.className = 'feedback-status';
    status.textContent = '送信しています…';
    if (button) {
      button.disabled = true;
      button.textContent = '送信中…';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      form.reset();
      status.className = 'feedback-status is-success';
      status.textContent = '送信しました。ありがとうございます。';
    } catch (error) {
      status.className = 'feedback-status is-error';
      status.textContent = '送信できませんでした。通信状態を確認して、もう一度お試しください。';
      console.error('Feedback form submission failed:', error);
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalLabel;
      }
    }
  });
})();
