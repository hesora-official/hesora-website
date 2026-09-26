/* HESORA Application */

window.HESORA = window.HESORA || {};

window.HESORA.app = {
  initialized: false,

  init() {
    if (this.initialized) return;

    this.initialized = true;

    console.log("HESORA application initialized.");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  window.HESORA.app.init();
});