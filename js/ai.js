window.ANALSYTICI_AI = {
  messages: [],

  init() {
    console.log("AI Analyst module loaded");
  },

  ask(question) {
    if (!question || !question.trim()) {
      return "Silakan masukkan pertanyaan.";
    }

    return "AI Analyst menerima pertanyaan: " + question;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  window.ANALSYTICI_AI.init();
});
