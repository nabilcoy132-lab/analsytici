window.ANALSYTICI_IMPORTER = {
  init() {
    const input =
      document.getElementById("universalFileInput");

    if (!input) return;

    input.addEventListener("change", event => {
      const file = event.target.files?.[0];

      if (!file) return;

      console.log("File selected:", file.name);

      if (file.name.endsWith(".csv")) {
        this.readCSV(file);
      }

      if (file.name.endsWith(".json")) {
        this.readJSON(file);
      }
    });
  },

  readCSV(file) {
    const reader = new FileReader();

    reader.onload = event => {
      const text = event.target.result;

      const rows = text
        .split(/\r?\n/)
        .filter(row => row.trim());

      console.log("CSV imported:", rows.length, "rows");

      window.dispatchEvent(
        new CustomEvent("analsytici:import", {
          detail: {
            type: "csv",
            fileName: file.name,
            rows
          }
        })
      );
    };

    reader.readAsText(file);
  },

  readJSON(file) {
    const reader = new FileReader();

    reader.onload = event => {
      try {
        const data = JSON.parse(event.target.result);

        window.dispatchEvent(
          new CustomEvent("analsytici:import", {
            detail: {
              type: "json",
              fileName: file.name,
              data
            }
          })
        );
      } catch {
        alert("File JSON tidak valid.");
      }
    };

    reader.readAsText(file);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  window.ANALSYTICI_IMPORTER.init();
});
