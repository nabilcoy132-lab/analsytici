window.ANALSYTICI_AUTH = {
  init() {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    document.querySelectorAll("[data-action]").forEach(button => {
      button.addEventListener("click", () => {
        const action = button.dataset.action;

        if (action === "show-signup") {
          this.showScreen("signupScreen");
        }

        if (action === "show-login") {
          this.showScreen("loginScreen");
        }

        if (action === "demo-login") {
          this.demoLogin();
        }

        if (action === "toggle-password") {
          const target = document.getElementById(
            button.dataset.target
          );

          if (target) {
            target.type =
              target.type === "password"
                ? "text"
                : "password";
          }
        }
      });
    });

    if (loginForm) {
      loginForm.addEventListener("submit", event => {
        event.preventDefault();

        const email =
          document.getElementById("loginEmail")?.value.trim();

        if (!email) {
          alert("Masukkan email terlebih dahulu.");
          return;
        }

        this.demoLogin();
      });
    }

    if (signupForm) {
      signupForm.addEventListener("submit", event => {
        event.preventDefault();

        const name =
          document.getElementById("signupName")?.value.trim();

        if (!name) {
          alert("Masukkan nama terlebih dahulu.");
          return;
        }

        this.showScreen("onboardingScreen");
      });
    }
  },

  showScreen(screenId) {
    document
      .querySelectorAll(".auth-screen, .onboarding-screen")
      .forEach(screen => {
        screen.classList.add("hidden");
      });

    const screen = document.getElementById(screenId);

    if (screen) {
      screen.classList.remove("hidden");
    }
  },

  demoLogin() {
    const authApp = document.getElementById("authApp");
    const mainApp = document.getElementById("mainApp");

    if (authApp) {
      authApp.classList.add("hidden");
    }

    if (mainApp) {
      mainApp.classList.remove("hidden");
    }

    if (window.ANALSYTICI_ROUTER) {
      window.ANALSYTICI_ROUTER.init();
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  window.ANALSYTICI_AUTH.init();
});
