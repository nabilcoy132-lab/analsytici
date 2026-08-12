(function () {
  "use strict";

  const STORAGE_KEY = "analsytici_auth";

  function getAuth() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
    } catch (error) {
      return null;
    }
  }

  function saveAuth(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  function showElement(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove("hidden");
    }
  }

  function hideElement(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add("hidden");
    }
  }

  function showLogin() {
    showElement("authApp");

    showElement("loginScreen");
    hideElement("signupScreen");
    hideElement("onboardingScreen");

    hideElement("mainApp");
  }

  function showSignup() {
    showElement("authApp");

    hideElement("loginScreen");
    showElement("signupScreen");
    hideElement("onboardingScreen");

    hideElement("mainApp");
  }

  function showOnboarding() {
    showElement("authApp");

    hideElement("loginScreen");
    hideElement("signupScreen");
    showElement("onboardingScreen");

    hideElement("mainApp");
  }

  function showMainApp() {
    hideElement("appBoot");
    hideElement("authApp");
    showElement("mainApp");

    // Beri tahu app.js bahwa user sudah masuk
    window.dispatchEvent(
      new CustomEvent("analsytici:authenticated")
    );
  }

  function createDemoUser() {
    const user = {
      id: "demo-user",
      name: "Demo Analyst",
      email: "demo@analsytici.local",
      company: "Demo Brand",
      role: "marketer",
      isDemo: true,
      createdAt: new Date().toISOString()
    };

    saveAuth(user);

    return user;
  }

  function demoLogin() {
    const user = createDemoUser();

    console.log("ANALSYTICI Demo Login:", user);

    showMainApp();

    // Masuk ke dashboard
    window.location.hash = "#/dashboard";
  }

  function handleLogin(event) {
    event.preventDefault();

    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");

    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    if (!email) {
      alert("Masukkan email terlebih dahulu.");
      return;
    }

    if (!password) {
      alert("Masukkan password terlebih dahulu.");
      return;
    }

    const user = {
      id: "user-" + Date.now(),
      name: email.split("@")[0],
      email: email,
      company: "",
      role: "marketer",
      isDemo: false,
      createdAt: new Date().toISOString()
    };

    saveAuth(user);

    showMainApp();

    window.location.hash = "#/dashboard";
  }

  function handleSignup(event) {
    event.preventDefault();

    const name =
      document.getElementById("signupName")?.value.trim() || "";

    const email =
      document.getElementById("signupEmail")?.value.trim() || "";

    const password =
      document.getElementById("signupPassword")?.value || "";

    const company =
      document.getElementById("signupCompany")?.value.trim() || "";

    const role =
      document.getElementById("signupRole")?.value || "";

    if (!name) {
      alert("Masukkan nama.");
      return;
    }

    if (!email) {
      alert("Masukkan email.");
      return;
    }

    if (password.length < 6) {
      alert("Password minimal 6 karakter.");
      return;
    }

    if (!role) {
      alert("Pilih role terlebih dahulu.");
      return;
    }

    const user = {
      id: "user-" + Date.now(),
      name,
      email,
      company,
      role,
      isDemo: false,
      createdAt: new Date().toISOString()
    };

    saveAuth(user);

    showOnboarding();

    console.log("Workspace created:", user);
  }

  function bindEvents() {
    // Demo Login
    document.querySelectorAll(
      '[data-action="demo-login"]'
    ).forEach(function (button) {
      button.addEventListener("click", demoLogin);
    });

    // Show signup
    document.querySelectorAll(
      '[data-action="show-signup"]'
    ).forEach(function (button) {
      button.addEventListener("click", showSignup);
    });

    // Show login
    document.querySelectorAll(
      '[data-action="show-login"]'
    ).forEach(function (button) {
      button.addEventListener("click", showLogin);
    });

    // Login form
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
      loginForm.addEventListener("submit", handleLogin);
    }

    // Signup form
    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
      signupForm.addEventListener("submit", handleSignup);
    }

    // Toggle password
    document.querySelectorAll(
      '[data-action="toggle-password"]'
    ).forEach(function (button) {
      button.addEventListener("click", function () {
        const targetId = button.dataset.target;
        const input = document.getElementById(targetId);

        if (!input) return;

        if (input.type === "password") {
          input.type = "text";
          button.textContent = "◉";
        } else {
          input.type = "password";
          button.textContent = "◉";
        }
      });
    });

    // Forgot password
    document.querySelectorAll(
      '[data-action="forgot-password"]'
    ).forEach(function (button) {
      button.addEventListener("click", function () {
        alert(
          "Password recovery akan tersedia ketika backend authentication sudah dipasang."
        );
      });
    });
  }

  function init() {
    bindEvents();

    const existingAuth = getAuth();

    // Untuk sekarang jangan otomatis masuk.
    // User tetap melihat halaman login.
    if (existingAuth) {
      console.log(
        "Saved ANALSYTICI workspace ditemukan:",
        existingAuth
      );
    }

    hideElement("appBoot");
    showElement("authApp");

    showLogin();
  }

  // Expose API
  window.ANALSYTICI_AUTH = {
    getAuth,
    saveAuth,
    showLogin,
    showSignup,
    showOnboarding,
    showMainApp,
    demoLogin
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
