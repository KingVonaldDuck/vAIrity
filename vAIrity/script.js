const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatWindow = document.getElementById('chatWindow');

function handleSend() {
    const text = userInput.value.trim();
    if (text === "") return;

    // Remove welcome screen on first message
    const welcome = document.querySelector('.welcome-screen');
    if (welcome) welcome.remove();

    // Add User Message
    const msgDiv = document.createElement('div');
    msgDiv.style.cssText = "background: #eef2f6; padding: 15px; border-radius: 12px; margin-bottom: 10px; align-self: flex-end; max-width: 80%; margin-left: auto;";
    msgDiv.textContent = text;
    chatWindow.appendChild(msgDiv);

    // Clear input
    userInput.value = "";
}

sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});