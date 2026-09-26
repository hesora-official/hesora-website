/* HANI Input */

function createHaniInput() {
  const windowInner = document.querySelector(".hani-window-inner");

  if (!windowInner) return;

  if (document.querySelector(".hani-input-area")) return;

  const inputArea = document.createElement("div");

  inputArea.className = "hani-input-area";

  inputArea.innerHTML = `
    <div class="hani-input-row">
      <input
        type="text"
        class="hani-input"
        placeholder="Type your message..."
        aria-label="Message HANI"
      />

      <button
        type="button"
        class="hani-send"
        aria-label="Send message"
      >
        Send
      </button>
    </div>
  `;

  windowInner.appendChild(inputArea);

  const input = inputArea.querySelector(".hani-input");
  const sendButton = inputArea.querySelector(".hani-send");

  function sendMessage() {
    const text = input.value.trim();

    if (!text) return;

    addHaniMessage(text, "user");

    input.value = "";

    setTimeout(() => {
      addHaniMessage(
        "I can help with that. Tell me a little more about what you want to achieve.",
        "hani"
      );
    }, 400);

    input.focus();
  }

  sendButton.addEventListener("click", sendMessage);

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
}