/* HANI Launcher */

function createHaniLauncher() {
  if (document.querySelector(".hani-launcher")) return;

  const launcher = document.createElement("button");

  launcher.type = "button";
  launcher.className = "hani-launcher";
  launcher.setAttribute("aria-label", "Open HANI");
  launcher.textContent = "HANI";

  launcher.addEventListener("click", openHani);

  document.body.appendChild(launcher);
}

function openHani() {
  const existing = document.querySelector(".hani-window");

  if (existing) {
    existing.classList.add("open");
    return;
  }

  const windowElement = document.createElement("div");

  windowElement.className = "hani-window open";

  windowElement.innerHTML = `
  <div class="hani-window-inner">

    <div class="hani-header">
      <div>
        <strong>HANI</strong>
        <span>HESORA AI</span>
      </div>

      <button
        type="button"
        class="hani-close"
        aria-label="Close HANI"
      >
        ×
      </button>
    </div>

    <div class="hani-body">
      <p>Hi, I'm HANI — HESORA's intelligent front desk.</p>
      <p>What are you looking to build, publish, improve or solve?</p>
    </div>

  </div>
`;

windowElement
  .querySelector(".hani-close")
  .addEventListener("click", closeHani);
  document.body.appendChild(windowElement);

createHaniQuickActions();
createHaniInput();
}

function closeHani() {
  const windowElement = document.querySelector(".hani-window");

  if (windowElement) {
    windowElement.classList.remove("open");
  }
}

document.addEventListener("DOMContentLoaded", createHaniLauncher);