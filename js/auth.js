// =========================================================
// ANALSYTICI — AUTH
// Local authentication / demo workspace
// =========================================================

window.ANALSYTICI_AUTH = {

  currentUser: null,

  // -------------------------------------------------------
  // INIT
  // -------------------------------------------------------

  init() {

    const session =
      window.ANALSYTICI_STORAGE.getSession();

    const user =
      window.ANALSYTICI_STORAGE.getUser();

    if (session && user) {

      this.currentUser = user;

      this.showMainApp();

    } else {

      this.showAuthApp();
      this.showLogin();

    }

    this.bindEvents();

    console.log("ANALSYTICI Auth loaded");

  },


  // -------------------------------------------------------
  // EVENTS
  // -------------------------------------------------------

  bindEvents() {

    const loginForm =
      document.getElementById("loginForm");

    if (loginForm) {

      loginForm.addEventListener(
        "submit",
        (event) => {

          event.preventDefault();

          this.login();

        }
      );

    }


    const signupForm =
      document.getElementById("signupForm");

    if (signupForm) {

      signupForm.addEventListener(
        "submit",
        (event) => {

          event.preventDefault();

          this.signup();

        }
      );

    }


    document.addEventListener(
      "click",
      (event) => {

        const actionElement =
          event.target.closest(
            "[data-action]"
          );

        if (!actionElement) {
          return;
        }

        const action =
          actionElement.dataset.action;


        if (action === "show-signup") {
          this.showSignup();
        }


        if (action === "show-login") {
          this.showLogin();
        }


        if (action === "demo-login") {
          this.demoLogin();
        }


        if (action === "toggle-password") {

          const targetId =
            actionElement.dataset.target;

          this.togglePassword(targetId);

        }


        if (action === "forgot-password") {

          this.forgotPassword();

        }

      }
    );

  },


  // -------------------------------------------------------
  // LOGIN
  // -------------------------------------------------------

  login() {

    const email =
      document
        .getElementById("loginEmail")
        ?.value
        .trim();

    const password =
      document
        .getElementById("loginPassword")
        ?.value;


    this.clearErrors();


    if (!email) {

      this.showFieldError(
        "loginEmailError",
        "Email wajib diisi."
      );

      return;

    }


    if (!this.isValidEmail(email)) {

      this.showFieldError(
        "loginEmailError",
        "Format email tidak valid."
      );

      return;

    }


    if (!password) {

      this.showFieldError(
        "loginPasswordError",
        "Password wajib diisi."
      );

      return;

    }


    const savedUser =
      window.ANALSYTICI_STORAGE.getUser();


    if (
      !savedUser ||
      savedUser.email !== email
    ) {

      this.showFieldError(
        "loginEmailError",
        "Workspace belum ditemukan. Coba Demo atau buat akun."
      );

      return;

    }


    /*
      Untuk versi local-first ini password
      tidak disimpan sebagai password asli.
      Login hanya digunakan sebagai simulasi
      workspace lokal.
    */

    this.currentUser =
      savedUser;


    window.ANALSYTICI_STORAGE.saveSession({
      loggedIn: true,
      userId: savedUser.id,
      loggedAt: new Date().toISOString()
    });


    this.showMainApp();


    window.ANALSYTICI_UTILS.toast(
      "Berhasil masuk ke workspace.",
      "success"
    );

  },


  // -------------------------------------------------------
  // SIGNUP
  // -------------------------------------------------------

  signup() {

    const name =
      document
        .getElementById("signupName")
        ?.value
        .trim();

    const email =
      document
        .getElementById("signupEmail")
        ?.value
        .trim();

    const password =
      document
        .getElementById("signupPassword")
        ?.value;

    const company =
      document
        .getElementById("signupCompany")
        ?.value
        .trim();

    const role =
      document
        .getElementById("signupRole")
        ?.value;


    if (!name) {

      window.ANALSYTICI_UTILS.toast(
        "Nama wajib diisi.",
        "error"
      );

      return;

    }


    if (!this.isValidEmail(email)) {

      window.ANALSYTICI_UTILS.toast(
        "Masukkan email yang valid.",
        "error"
      );

      return;

    }


    if (!password || password.length < 6) {

      window.ANALSYTICI_UTILS.toast(
        "Password minimal 6 karakter.",
        "error"
      );

      return;

    }


    if (!role) {

      window.ANALSYTICI_UTILS.toast(
        "Pilih role kamu.",
        "error"
      );

      return;

    }


    const user = {

      id:
        window.ANALSYTICI_UTILS.createId(
          "user"
        ),

      name,

      email,

      company,

      role,

      createdAt:
        new Date().toISOString()

    };


    window.ANALSYTICI_STORAGE.saveUser(
      user
    );


    window.ANALSYTICI_STORAGE.saveSession({
      loggedIn: true,
      userId: user.id,
      loggedAt: new Date().toISOString()
    });


    this.currentUser = user;


    this.showOnboarding();


    window.ANALSYTICI_UTILS.toast(
      "Workspace berhasil dibuat.",
      "success"
    );

  },


  // -------------------------------------------------------
  // DEMO LOGIN
  // -------------------------------------------------------

  demoLogin() {

    const existingUser =
      window.ANALSYTICI_STORAGE.getUser();


    const user =
      existingUser || {

        id: "demo_user",

        name: "Demo Analyst",

        email: "demo@analsytici.local",

        company: "Demo Brand",

        role: "marketer",

        createdAt:
          new Date().toISOString(),

        isDemo: true

      };


    window.ANALSYTICI_STORAGE.saveUser(
      user
    );


    window.ANALSYTICI_STORAGE.saveSession({
      loggedIn: true,
      userId: user.id,
      loggedAt: new Date().toISOString()
    });


    this.currentUser = user;


    /*
      Demo langsung masuk dashboard.
      Kalau onboarding belum pernah diselesaikan,
      tetap bisa digunakan sebagai demo workspace.
    */

    this.showMainApp();


    window.ANALSYTICI_UTILS.toast(
      "Demo Workspace aktif.",
      "success"
    );

  },


  // -------------------------------------------------------
  // LOGOUT
  // -------------------------------------------------------

  logout() {

    window.ANALSYTICI_STORAGE.clearSession();

    this.currentUser = null;

    this.showAuthApp();
    this.showLogin();

    window.ANALSYTICI_UTILS.toast(
      "Kamu sudah keluar dari workspace.",
      "info"
    );

  },


  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------

  showAuthApp() {

    const authApp =
      document.getElementById("authApp");

    const mainApp =
      document.getElementById("mainApp");

    if (authApp) {
      authApp.classList.remove("hidden");
    }

    if (mainApp) {
      mainApp.classList.add("hidden");
    }

  },


  showMainApp() {

    const authApp =
      document.getElementById("authApp");

    const mainApp =
      document.getElementById("mainApp");

    if (authApp) {
      authApp.classList.add("hidden");
    }

    if (mainApp) {
      mainApp.classList.remove("hidden");
    }


    this.updateProfileUI();

  },


  showLogin() {

    this.hideAuthScreens();

    const screen =
      document.getElementById("loginScreen");

    if (screen) {
      screen.classList.remove("hidden");
    }

  },


  showSignup() {

    this.hideAuthScreens();

    const screen =
      document.getElementById("signupScreen");

    if (screen) {
      screen.classList.remove("hidden");
    }

  },


  showOnboarding() {

    this.hideAuthScreens();

    const screen =
      document.getElementById(
        "onboardingScreen"
      );

    if (screen) {
      screen.classList.remove("hidden");
    }

  },


  hideAuthScreens() {

    [
      "loginScreen",
      "signupScreen",
      "onboardingScreen"
    ].forEach(id => {

      const element =
        document.getElementById(id);

      if (element) {
        element.classList.add("hidden");
      }

    });

  },


  // -------------------------------------------------------
  // PROFILE UI
  // -------------------------------------------------------

  updateProfileUI() {

    const user =
      this.currentUser ||
      window.ANALSYTICI_STORAGE.getUser();


    if (!user) {
      return;
    }


    const name =
      user.name ||
      "Analyst";


    const role =
      this.formatRole(
        user.role
      );


    const initials =
      name
        .split(" ")
        .map(word =>
          word.charAt(0)
        )
        .join("")
        .substring(0, 2)
        .toUpperCase();


    const elements = {

      profileName:
        document.getElementById(
          "profileName"
        ),

      topbarProfileName:
        document.getElementById(
          "topbarProfileName"
        ),

      profileRole:
        document.getElementById(
          "profileRole"
        ),

      profileAvatar:
        document.getElementById(
          "profileAvatar"
        ),

      topbarProfileAvatar:
        document.getElementById(
          "topbarProfileAvatar"
        )

    };


    if (elements.profileName) {
      elements.profileName.textContent =
        name;
    }


    if (elements.topbarProfileName) {
      elements.topbarProfileName.textContent =
        name;
    }


    if (elements.profileRole) {
      elements.profileRole.textContent =
        role;
    }


    if (elements.profileAvatar) {
      elements.profileAvatar.textContent =
        initials;
    }


    if (elements.topbarProfileAvatar) {
      elements.topbarProfileAvatar.textContent =
        initials;
    }

  },


  // -------------------------------------------------------
  // PASSWORD
  // -------------------------------------------------------

  togglePassword(targetId) {

    const input =
      document.getElementById(
        targetId
      );

    if (!input) {
      return;
    }


    input.type =
      input.type === "password"
        ? "text"
        : "password";

  },


  // -------------------------------------------------------
  // FORGOT PASSWORD
  // -------------------------------------------------------

  forgotPassword() {

    window.ANALSYTICI_UTILS.toast(
      "Password reset belum tersedia pada versi local workspace.",
      "info"
    );

  },


  // -------------------------------------------------------
  // VALIDATION
  // -------------------------------------------------------

  isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(email);

  },


  clearErrors() {

    document
      .querySelectorAll(
        ".field-error"
      )
      .forEach(element => {

        element.textContent = "";

      });

  },


  showFieldError(
    elementId,
    message
  ) {

    const element =
      document.getElementById(
        elementId
      );

    if (element) {
      element.textContent =
        message;
    }

  },


  // -------------------------------------------------------
  // ROLE LABEL
  // -------------------------------------------------------

  formatRole(role) {

    const roles = {

      marketer: "Marketer",

      founder: "Founder",

      "business-owner":
        "Business Owner",

      "brand-strategist":
        "Brand Strategist",

      "product-marketer":
        "Product Marketer",

      "content-marketer":
        "Content Marketer",

      agency: "Agency",

      student: "Student"

    };


    return (
      roles[role] ||
      "Analyst"
    );

  }

};


// =========================================================
// AUTO INIT
// =========================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    window.ANALSYTICI_AUTH.init();

  }
);
