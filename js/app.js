document.addEventListener("DOMContentLoaded", () => {
  const boot = document.getElementById("appBoot");

  setTimeout(() => {
    if (boot) {
      boot.classList.add("hidden");
    }

    const authApp = document.getElementById("authApp");

    if (authApp) {
      authApp.classList.remove("hidden");
    }

    initializeApp();
  }, 800);
});

function initializeApp() {
  console.log("ANALSYTICI initialized");

  if (window.ANALSYTICI_IMPORTER) {
    window.ANALSYTICI_IMPORTER.init();
  }

  initializeGlobalActions();
}

function initializeGlobalActions() {
  document.addEventListener("click", event => {
    const element =
      event.target.closest("[data-action]");

    if (!element) return;

    const action = element.dataset.action;

    switch (action) {
      case "close-modal":
        closeModal();
        break;

      case "reload-app":
        window.location.reload();
        break;

      case "dismiss-error":
        hideGlobalError();
        window.location.hash = "#/dashboard";
        break;

      case "mobile-menu":
        toggleMobileMenu();
        break;

      default:
        break;
    }
  });
}

function closeModal() {
  const modal = document.getElementById("globalModal");

  if (modal) {
    modal.classList.add("hidden");
  }
}

function hideGlobalError() {
  const error =
    document.getElementById("globalError");

  if (error) {
    error.classList.add("hidden");
  }
}

function toggleMobileMenu() {
  const sidebar =
    document.getElementById("appSidebar");

  if (sidebar) {
    sidebar.classList.toggle("mobile-open");
  }
}

window.showGlobalError = function(message) {
  const error =
    document.getElementById("globalError");

  const messageElement =
    document.getElementById("globalErrorMessage");

  if (messageElement) {
    messageElement.textContent =
      message || "Terjadi error.";
  }

  if (error) {
    error.classList.remove("hidden");
  }
};
