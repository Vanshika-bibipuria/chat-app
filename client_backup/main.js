const socket = io("http://localhost:5000"); // If you're using port 5000

const form = document.getElementById("chat-form");
const input = document.getElementById("messageInput");
const messages = document.getElementById("messages");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = input.value.trim();
  if (msg) {
    socket.emit("chat message", msg);
    input.value = "";
  }
});

socket.on("chat message", (msg) => {
  const para = document.createElement("p");
  para.textContent = msg;
  messages.appendChild(para);
});
