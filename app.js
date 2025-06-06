    const form = document.getElementById('chatForm');
    const input = document.getElementById('messageInput');
    const chat = document.getElementById('chat');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const message = input.value.trim();
      if (message) {
        const userMsg = document.createElement('div');
        userMsg.className = 'message user';
        userMsg.textContent = message;
        chat.appendChild(userMsg);
        chat.scrollTop = chat.scrollHeight;
        input.value = '';
      }
    });
