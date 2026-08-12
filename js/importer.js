/*
 * ANALSYTICI
 * Universal Importer
 *
 * Fungsi:
 * - Import CSV
 * - Import JSON
 * - Parse CSV menjadi object
 * - Menghubungkan hasil import ke storage
 * - Menyediakan universal file picker
 */

(function () {
  "use strict";

  const STORAGE = window.ANALSYTICI_STORAGE;


  // =========================================================
  // CSV PARSER
  // =========================================================

  function parseCSV(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];

      if (char === '"' && insideQuotes && next === '"') {
        cell += '"';
        i++;
        continue;
      }

      if (char === '"') {
        insideQuotes = !insideQuotes;
        continue;
      }

      if (char === "," && !insideQuotes) {
        row.push(cell.trim());
        cell = "";
        continue;
      }

      if (
        (char === "\n" || char === "\r") &&
        !insideQuotes
      ) {
        if (char === "\r" && next === "\n") {
          i++;
        }

        row.push(cell.trim());

        if (row.some((value) => value !== "")) {
          rows.push(row);
        }

        row = [];
        cell = "";

        continue;
      }

      cell += char;
    }

    if (cell !== "" || row.length > 0) {
      row.push(cell.trim());

      if (row.some((value) => value !== "")) {
        rows.push(row);
      }
    }

    if (rows.length === 0) {
      return [];
    }

    const headers = rows[0].map((header, index) => {
      const cleanHeader = header
        .replace(/^\uFEFF/, "")
        .trim();

      return cleanHeader || `column_${index + 1}`;
    });

    return rows.slice(1).map((values) => {
      const object = {};

      headers.forEach((header, index) => {
        object[header] =
          values[index] !== undefined
            ? values[index]
            : "";
      });

      return object;
    });
  }


  // =========================================================
  // JSON PARSER
  // =========================================================

  function parseJSON(text) {
    const parsed = JSON.parse(text);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    if (
      parsed &&
      typeof parsed === "object"
    ) {
      return [parsed];
    }

    throw new Error(
      "Format JSON tidak valid."
    );
  }


  // =========================================================
  // FILE READER
  // =========================================================

  function readFile(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(
          new Error("File tidak ditemukan.")
        );

        return;
      }

      const reader = new FileReader();

      reader.onload = function (event) {
        resolve(event.target.result);
      };

      reader.onerror = function () {
        reject(
          new Error(
            "Gagal membaca file."
          )
        );
      };

      reader.readAsText(file);
    });
  }


  // =========================================================
  // DETECT FILE TYPE
  // =========================================================

  function detectFileType(file) {
    const name =
      file.name.toLowerCase();

    if (name.endsWith(".csv")) {
      return "csv";
    }

    if (name.endsWith(".json")) {
      return "json";
    }

    return null;
  }


  // =========================================================
  // PARSE FILE
  // =========================================================

  async function parseFile(file) {
    const type =
      detectFileType(file);

    if (!type) {
      throw new Error(
        "Format file belum didukung. Gunakan CSV atau JSON."
      );
    }

    const text =
      await readFile(file);

    let data;

    if (type === "csv") {
      data = parseCSV(text);
    }

    if (type === "json") {
      data = parseJSON(text);
    }

    return {
      file,
      fileName: file.name,
      type,
      rows: data,
      rowCount: data.length,
      importedAt:
        new Date().toISOString()
    };
  }


  // =========================================================
  // NORMALIZE DATA
  // =========================================================

  function normalizeRow(row) {
    const normalized = {};

    Object.keys(row).forEach((key) => {
      const cleanKey = key
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_");

      normalized[cleanKey] = row[key];
    });

    return normalized;
  }


  function normalizeRows(rows) {
    return rows.map(normalizeRow);
  }


  // =========================================================
  // IMPORT TO RESEARCH
  // =========================================================

  function importToResearch(data, options = {}) {
    if (!STORAGE) {
      throw new Error(
        "Storage engine belum tersedia."
      );
    }

    const rows =
      normalizeRows(data.rows);

    const project =
      STORAGE.addResearch({
        name:
          options.name ||
          data.fileName.replace(
            /\.[^/.]+$/,
            ""
          ),

        type:
          options.type ||
          "imported-data",

        source:
          options.source ||
          data.type.toUpperCase(),

        description:
          options.description ||
          `Imported ${data.rowCount} rows dari ${data.fileName}`,

        data: rows,

        rowCount:
          rows.length,

        status: "active"
      });

    return project;
  }


  // =========================================================
  // IMPORT COMMENTS
  // =========================================================

  function importComments(data) {
    if (!STORAGE) {
      throw new Error(
        "Storage engine belum tersedia."
      );
    }

    const rows =
      normalizeRows(data.rows);

    const imported = [];

    rows.forEach((row) => {
      const comment =
        row.comment ||
        row.comments ||
        row.text ||
        row.content ||
        row.message ||
        "";

      if (!comment) {
        return;
      }

      const signal =
        STORAGE.addCustomerSignal({
          type: "comment",

          text: comment,

          source:
            row.source ||
            row.platform ||
            "import",

          author:
            row.author ||
            row.username ||
            "",

          sentiment:
            row.sentiment ||
            "unknown",

          intent:
            row.intent ||
            "unknown",

          pain:
            row.pain ||
            "",

          desire:
            row.desire ||
            "",

          objection:
            row.objection ||
            "",

          rawData: row
        });

      imported.push(signal);
    });

    return imported;
  }


  // =========================================================
  // IMPORT CONTENT
  // =========================================================

  function importContent(data) {
    if (!STORAGE) {
      throw new Error(
        "Storage engine belum tersedia."
      );
    }

    const rows =
      normalizeRows(data.rows);

    const imported = [];

    rows.forEach((row) => {
      const content =
        STORAGE.addContent({
          title:
            row.title ||
            row.caption ||
            row.content ||
            "Untitled Content",

          platform:
            row.platform ||
            "Unknown",

          url:
            row.url ||
            row.link ||
            "",

          views:
            toNumber(
              row.views ||
              row.view ||
              0
            ),

          likes:
            toNumber(
              row.likes ||
              row.like ||
              0
            ),

          comments:
            toNumber(
              row.comments ||
              row.comment_count ||
              0
            ),

          shares:
            toNumber(
              row.shares ||
              row.share ||
              0
            ),

          saves:
            toNumber(
              row.saves ||
              row.save ||
              0
            ),

          engagement:
            toNumber(
              row.engagement ||
              row.engagement_rate ||
              0
            ),

          rawData: row
        });

      imported.push(content);
    });

    return imported;
  }


  // =========================================================
  // IMPORT COMPETITORS
  // =========================================================

  function importCompetitors(data) {
    if (!STORAGE) {
      throw new Error(
        "Storage engine belum tersedia."
      );
    }

    const rows =
      normalizeRows(data.rows);

    const imported = [];

    rows.forEach((row) => {
      const competitor =
        STORAGE.addCompetitor({
          name:
            row.name ||
            row.brand ||
            row.competitor ||
            "Unknown Brand",

          website:
            row.website ||
            row.url ||
            "",

          industry:
            row.industry ||
            "",

          positioning:
            row.positioning ||
            "",

          price:
            row.price ||
            "",

          product:
            row.product ||
            "",

          audience:
            row.audience ||
            "",

          rawData: row
        });

      imported.push(competitor);
    });

    return imported;
  }


  // =========================================================
  // IMPORT CAMPAIGNS
  // =========================================================

  function importCampaigns(data) {
    if (!STORAGE) {
      throw new Error(
        "Storage engine belum tersedia."
      );
    }

    const rows =
      normalizeRows(data.rows);

    const imported = [];

    rows.forEach((row) => {
      const campaign =
        STORAGE.addCampaign({
          name:
            row.name ||
            row.campaign ||
            "Untitled Campaign",

          platform:
            row.platform ||
            "",

          impressions:
            toNumber(
              row.impressions ||
              0
            ),

          clicks:
            toNumber(
              row.clicks ||
              0
            ),

          conversions:
            toNumber(
              row.conversions ||
              row.conversion ||
              0
            ),

          spend:
            toNumber(
              row.spend ||
              row.cost ||
              0
            ),

          revenue:
            toNumber(
              row.revenue ||
              0
            ),

          ctr:
            toNumber(
              row.ctr ||
              0
            ),

          cvr:
            toNumber(
              row.cvr ||
              row.conversion_rate ||
              0
            ),

          roas:
            toNumber(
              row.roas ||
              0
            ),

          rawData: row
        });

      imported.push(campaign);
    });

    return imported;
  }


  // =========================================================
  // NUMBER HELPER
  // =========================================================

  function toNumber(value) {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return 0;
    }

    if (typeof value === "number") {
      return value;
    }

    const cleaned =
      String(value)
        .replace(/[%,$]/g, "")
        .replace(/\s/g, "")
        .replace(",", ".");

    const number =
      Number(cleaned);

    return Number.isNaN(number)
      ? 0
      : number;
  }


  // =========================================================
  // UNIVERSAL IMPORT
  // =========================================================

  async function importFile(
    file,
    options = {}
  ) {
    const data =
      await parseFile(file);

    const destination =
      options.destination ||
      "research";

    let result;

    switch (destination) {

      case "comments":
        result =
          importComments(data);
        break;

      case "content":
        result =
          importContent(data);
        break;

      case "competitors":
        result =
          importCompetitors(data);
        break;

      case "campaigns":
        result =
          importCampaigns(data);
        break;

      case "research":
      default:
        result =
          importToResearch(
            data,
            options
          );
        break;
    }

    return {
      success: true,
      destination,
      sourceFile: data.fileName,
      rowsImported:
        Array.isArray(result)
          ? result.length
          : data.rowCount,
      result
    };
  }


  // =========================================================
  // FILE PICKER
  // =========================================================

  function openFilePicker(options = {}) {
    const input =
      document.getElementById(
        "universalFileInput"
      );

    if (!input) {
      console.error(
        "universalFileInput tidak ditemukan."
      );

      return;
    }

    input.value = "";

    input.accept =
      options.accept ||
      ".csv,.json";

    input.dataset.destination =
      options.destination ||
      "research";

    input.dataset.name =
      options.name ||
      "";

    input.dataset.type =
      options.type ||
      "";

    input.dataset.source =
      options.source ||
      "";

    input.click();
  }


  // =========================================================
  // HANDLE FILE INPUT
  // =========================================================

  async function handleFileInput(file) {
    if (!file) {
      return null;
    }

    const input =
      document.getElementById(
        "universalFileInput"
      );

    const options = {
      destination:
        input?.dataset.destination ||
        "research",

      name:
        input?.dataset.name ||
        "",

      type:
        input?.dataset.type ||
        "",

      source:
        input?.dataset.source ||
        ""
    };

    try {
      const result =
        await importFile(
          file,
          options
        );

      console.log(
        "ANALSYTICI Import Success:",
        result
      );

      showImportToast(
        `Berhasil mengimport ${result.rowsImported} data.`
      );

      return result;

    } catch (error) {

      console.error(
        "ANALSYTICI Import Error:",
        error
      );

      showImportToast(
        error.message ||
        "Gagal mengimport file.",
        true
      );

      return null;
    }
  }


  // =========================================================
  // TOAST
  // =========================================================

  function showImportToast(
    message,
    isError = false
  ) {
    const container =
      document.getElementById(
        "toastContainer"
      );

    if (!container) {
      return;
    }

    const toast =
      document.createElement("div");

    toast.className =
      `toast ${
        isError
          ? "toast-error"
          : "toast-success"
      }`;

    toast.innerHTML = `
      <strong>
        ${isError ? "Import gagal" : "Import berhasil"}
      </strong>
      <span>${escapeHTML(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3500);
  }


  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  // =========================================================
  // INITIALIZE
  // =========================================================

  function init() {
    const input =
      document.getElementById(
        "universalFileInput"
      );

    if (!input) {
      return;
    }

    input.addEventListener(
      "change",
      async function () {
        const file =
          this.files &&
          this.files[0];

        await handleFileInput(file);
      }
    );

    console.log(
      "ANALSYTICI Importer initialized."
    );
  }


  // =========================================================
  // PUBLIC API
  // =========================================================

  window.ANALSYTICI_IMPORTER = {

    parseCSV,
    parseJSON,
    parseFile,

    normalizeRow,
    normalizeRows,

    importFile,
    importComments,
    importContent,
    importCompetitors,
    importCampaigns,
    importToResearch,

    openFilePicker,
    handleFileInput,

    toNumber
  };


  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();
