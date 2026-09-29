(function () {
  // 1. Get Widget ID from the script tag src URL
  const scriptTag = document.currentScript;
  const urlParams = new URLSearchParams(scriptTag.src.split('?')[1]);
  const widgetId = urlParams.get('id');

  // 2. Build floating UI container
  const container = document.createElement('div');
  container.id = 'my-custom-widget';
  container.innerHTML = `
    <div style="position: fixed; bottom: 20px; right: 20px; background: white; padding: 15px; border: 1px solid #ccc; z-index: 9999;">
      <h3>Send us a message</h3>
      <form id="widget-form">
        <input type="text" id="w-name" placeholder="Name" required /><br/>
        <input type="email" id="w-email" placeholder="Email" required /><br/>
        <textarea id="w-msg" placeholder="Message" required></textarea><br/>
        <button type="submit">Submit</button>
      </form>
    </div>
  `;
  document.body.appendChild(container);

  // 3. Handle Form Submit
  document.getElementById('widget-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      widgetId,
      name: document.getElementById('w-name').value,
      email: document.getElementById('w-email').value,
      message: document.getElementById('w-msg').value,
    };

    await fetch('http://localhost:4000/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    alert('Message sent!');
  });
})();