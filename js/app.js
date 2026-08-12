document.addEventListener("DOMContentLoaded", () => {
  const boot = document.getElementById("appBoot");
  const authApp = document.getElementById("authApp");
  const mainApp = document.getElementById("mainApp");

  setTimeout(() => {
    if (boot) {
      boot.classList.add("hidden");
    }

    if (authApp) {
      authApp.classList.remove("hidden");
    }
  }, 800);

  console.log("ANALSYTICI initialized");
});
