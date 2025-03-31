document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const fileInput = document.getElementById('file-input');

    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'user-message' : 'ai-message';
        
        const avatar = document.createElement('img');
        avatar.className = 'message-avatar';
        avatar.src = isUser ? 
            "{{ url_for('static', filename='img/温度计.svg') }}" : 
            "{{ url_for('static', filename='img/温度计.svg') }}";
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        userInput.value = '';

        try {
            const response = await fetch('/api/deepseek', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            addMessage(data.response);
        } catch (error) {
            addMessage('抱歉,AI服务暂时不可用。请稍后再试。');
            console.error('Error:', error);
        }
    }

    // Set up event listeners
    document.querySelector('.send-button').addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });

    // Initial greeting
    addMessage('您好！我是您的植物养护AI助手，请问有什么可以帮您的吗？');
});
