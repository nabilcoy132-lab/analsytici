// =========================================================
// ANALSYTICI — UTILS
// =========================================================

window.ANALSYTICI_UTILS = {

  // -------------------------------------------------------
  // ID
  // -------------------------------------------------------

  createId(prefix = "id") {
    return (
      prefix +
      "_" +
      Date.now().toString(36) +
      "_" +
      Math.random().toString(36).substring(2, 8)
    );
  },


  // -------------------------------------------------------
  // DATE
  // -------------------------------------------------------

  formatDate(date = new Date()) {
    const d = new Date(date);

    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  },


  formatDateTime(date = new Date()) {
    const d = new Date(date);

    return d.toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  },


  // -------------------------------------------------------
  // TEXT
  // -------------------------------------------------------

  escapeHTML(value = "") {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },


  truncate(text = "", length = 120) {
    const value = String(text);

    if (value.length <= length) {
      return value;
    }

    return value.substring(0, length).trim() + "...";
  },


  capitalize(text = "") {
    if (!text) return "";

    return (
      text.charAt(0).toUpperCase() +
      text.slice(1)
    );
  },


  // -------------------------------------------------------
  // NUMBER
  // -------------------------------------------------------

  formatNumber(value = 0) {
    return Number(value || 0).toLocaleString("id-ID");
  },


  formatPercentage(value = 0) {
    return `${Number(value || 0).toFixed(1)}%`;
  },


  // -------------------------------------------------------
  // ARRAY
  // -------------------------------------------------------

  unique(array = []) {
    return [...new Set(array)];
  },


  // -------------------------------------------------------
  // DOM
  // -------------------------------------------------------

  $(selector) {
    return document.querySelector(selector);
  },


  $$(selector) {
    return [...document.querySelectorAll(selector)];
  },


  show(element) {
    if (!element) return;

    element.classList.remove("hidden");
  },


  hide(element) {
    if (!element) return;

    element.classList.add("hidden");
  },


  // -------------------------------------------------------
  // TOAST
  // -------------------------------------------------------

  toast(message, type = "info") {

    const container =
      document.getElementById("toastContainer");

    if (!container) {
      console.log(`[${type}] ${message}`);
      return;
    }

    const toast =
      document.createElement("div");

    toast.className =
      `toast toast-${type}`;

    toast.innerHTML = `
      <div class="toast-message">
        ${this.escapeHTML(message)}
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-hide");

      setTimeout(() => {
        toast.remove();
      }, 300);

    }, 3000);
  },


  // -------------------------------------------------------
  // SAFE JSON
  // -------------------------------------------------------

  parseJSON(value, fallback = null) {

    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }

  },


  stringifyJSON(value) {

    try {
      return JSON.stringify(value);
    } catch (error) {
      console.error(
        "ANALSYTICI JSON stringify error:",
        error
      );

      return null;
    }

  }

};


console.log("ANALSYTICI Utils loaded");
