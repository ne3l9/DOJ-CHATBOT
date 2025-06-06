const chat = document.getElementById("chat");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const languageSelect = document.getElementById("language");

// Add message to chat window
function addMessage(sender, text) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.textContent = text;
  chat.appendChild(messageDiv);
  chat.scrollTop = chat.scrollHeight;
  return messageDiv;
}

// Basic keyword-based intent classifier
function classifyIntent(text) {
  const lower = text.toLowerCase();
  if (lower.includes("legal aid") || lower.includes("free lawyer")) return "legal_aid";
  if (lower.includes("domestic violence") || lower.includes("abuse")) return "domestic_violence";
  if (lower.includes("child") || lower.includes("juvenile")) return "child_rights";
  if (lower.includes("sc/st") || lower.includes("caste")) return "sc_st_protection";
  return "general_legal_help";
}

// Send message to backend (non-streaming)
async function sendMessage() {
  const message = userInput.value.trim();
  const lang = languageSelect.value;

  if (!message) return;

  addMessage("user", message);
  userInput.value = "";

  const typingDiv = addMessage("bot", "Typing...");

  const intent = classifyIntent(message);

  try {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: message,
        language: lang,
        intent: intent
      })
    });

    const data = await response.json();

    if (data.response) {
      typingDiv.textContent = data.response;
    } else {
      typingDiv.textContent = "⚠️ No response from server.";
    }

  } catch (error) {
    console.error("Request error:", error);
    typingDiv.textContent = "⚠️ Failed to connect to server.";
  }
}

// Button + Enter key support
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
