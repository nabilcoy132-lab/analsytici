window.ANALSYTICI_UTILS = {
  escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
  },

  formatNumber(value) {
    return new Intl.NumberFormat("id-ID").format(Number(value) || 0);
  },

  getInitials(name) {
    return String(name || "A")
      .split(" ")
      .map(word => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
};
