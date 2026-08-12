window.ANALSYTICI_CUSTOMER = {
  signals: [],
  comments: [],

  init() {
    console.log("Customer Intelligence module loaded");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  window.ANALSYTICI_CUSTOMER.init();
});
