/* HANI Quick Actions */

function createHaniQuickActions() {
  const body = document.querySelector(".hani-body");

  if (!body) return;

  if (document.querySelector(".hani-quick-actions")) return;

  const actions = document.createElement("div");

  actions.className = "hani-quick-actions";

  actions.innerHTML = `
    <button type="button" class="hani-quick-action" data-message="I need an Android app">
      Android app
    </button>

    <button type="button" class="hani-quick-action" data-message="I need a website">
      Website
    </button>

    <button type="button" class="hani-quick-action" data-message="I need automation">
      Automation
    </button>

    <button type="button" class="hani-quick-action" data-message="I need an AI agent">
      AI agent
    </button>

    <button type="button" class="hani-quick-action" data-message="I have a Google Play issue">
      Google Play issue
    </button>

    <button type="button" class="hani-quick-action" data-message="I'm not sure what I need">
      Not sure yet
    </button>
  `;

  body.appendChild(actions);

  actions.querySelectorAll(".hani-quick-action").forEach((button) => {
    button.addEventListener("click", () => {
      const message = button.dataset.message;

addHaniMessage(message, "user");

const intent = detectHaniIntent(message);

updateHaniState({
  intent: intent
});

setTimeout(() => {
  const response = getHaniDiscoveryQuestion();

  addHaniMessage(response, "hani");
}, 400);
    });
  });
}