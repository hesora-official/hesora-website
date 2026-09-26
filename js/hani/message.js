/* HANI Message Helpers */

function addHaniMessage(text, type = "hani") {
  const body = document.querySelector(".hani-body");

  if (!body) return;

  const message = document.createElement("div");

  message.className = `hani-message hani-message-${type}`;
  message.textContent = text;

  body.appendChild(message);

  body.scrollTop = body.scrollHeight;
}