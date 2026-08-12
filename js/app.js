/*
  ANALSYTICI
  Main Application Bootstrap
*/

(function () {
  "use strict";

  const App = {
    initialized: false,

    state: {
      currentRoute: "dashboard",
      sidebarCollapsed: false,
      mobileMenuOpen: false
    },

    init() {
      if (this.initialized) return;

      console.log("ANALSYTICI starting...");

      this.bindGlobalEvents();
      this.initializeModules();
      this.initializeUI();
      this.hideBootScreen();

      this.initialized = true;

      console.log("ANALSYTICI ready.");
    },

    initializeModules() {
      /*
        Initialize modules if they expose init()
      */

      const modules = [
        window.Storage,
        window.Auth,
        window.Router,
        window.Importer,
        window.Research,
        window.Customer,
        window.Competitor,
        window.Content,
        window.Campaign,
        window.Strategy,
        window.AI,
        window.Tools
      ];

      modules.forEach((module) => {
        if (
          module &&
          typeof module.init === "function"
        ) {
          try {
            module.init();
          } catch (error) {
            console.error(
              "Module initialization error:",
              error
            );
          }
        }
      });
    },

    initializeUI() {
      this.updateProfileUI();
      this.updateWorkspaceUI();
      this.updateDashboard();

      /*
        Give router a moment to initialize
      */
      setTimeout(() => {
        if (
          window.Router &&
          typeof window.Router.navigate === "function"
        ) {
          const hash =
            window.location.hash.replace("#/", "");

          const route =
            hash || "dashboard";

          window.Router.navigate(route);
        } else {
          this.showRoute(
            window.location.hash
              .replace("#/", "") ||
              "dashboard"
          );
        }
      }, 50);
    },

    bindGlobalEvents() {
      document.addEventListener(
        "click",
        (event) => {
          const actionElement =
            event.target.closest(
              "[data-action]"
            );

          if (!actionElement) return;

          const action =
            actionElement.dataset.action;

          this.handleAction(
            action,
            actionElement
          );
        }
      );

      document.addEventListener(
        "keydown",
        (event) => {
          this.handleKeyboard(event);
        }
      );

      window.addEventListener(
        "hashchange",
        () => {
          this.handleRouteChange();
        }
      );

      window.addEventListener(
        "error",
        (event) => {
          console.error(
            "Global error:",
            event.error
          );
        }
      );
    },

    handleAction(action, element) {
      switch (action) {
        case "toggle-password":
          this.togglePassword(element);
          break;

        case "forgot-password":
          this.showToast(
            "Fitur reset password tersedia untuk workspace lokal.",
            "info"
          );
          break;

        case "demo-login":
          this.demoLogin();
          break;

        case "show-signup":
          this.showAuthScreen("signup");
          break;

        case "show-login":
          this.showAuthScreen("login");
          break;

        case "new-research":
          this.openNewResearch();
          break;

        case "import-comments":
          this.openImporter("comments");
          break;

        case "import-content":
          this.openImporter("content");
          break;

        case "open-ai":
          this.navigate("ai");
          break;

        case "notifications":
          this.openNotifications();
          break;

        case "close-notifications":
          this.closeNotifications();
          break;

        case "close-modal":
          this.closeModal();
          break;

        case "close-command":
          this.closeCommandPalette();
          break;

        case "mobile-more":
          this.toggleSidebar();
          break;

        case "market-details":
          this.navigate("market");
          break;

        case "reload-app":
          window.location.reload();
          break;

        case "dismiss-error":
          this.dismissError();
          this.navigate("dashboard");
          break;

        case "profile-menu":
          this.openProfileMenu();
          break;

        case "workspace-menu":
          this.openWorkspaceMenu();
          break;

        case "new-market-analysis":
          this.openNewMarketAnalysis();
          break;

        case "add-competitor":
          this.openAddCompetitor();
          break;

        case "compare-competitors":
          this.openCompareCompetitors();
          break;

        case "generate-swot":
          this.generateSWOT();
          break;

        case "add-content":
          this.openAddContent();
          break;

        case "analyze-content":
          this.analyzeContent();
          break;

        case "add-campaign":
          this.openAddCampaign();
          break;

        case "generate-experiment":
          this.generateExperiment();
          break;

        case "generate-strategy":
          this.generateStrategy();
          break;

        case "analyze-comments":
          this.openImporter("comments");
          break;

        case "analyze-competitor":
          this.navigate("competitors");
          break;

        case "analyze-campaign":
          this.navigate("campaigns");
          break;

        case "customer-persona":
          this.showToast(
            "Persona Builder akan menggunakan customer signals.",
            "info"
          );
          break;

        case "customer-journey":
          this.showToast(
            "Customer Journey siap setelah customer data tersedia.",
            "info"
          );
          break;

        case "customer-survey":
          this.showToast(
            "Survey Generator siap digunakan.",
            "info"
          );
          break;

        default:
          console.log(
            "Action belum memiliki handler:",
            action
          );
      }
    },

    handleKeyboard(event) {
      /*
        "/" membuka global search
      */
      if (
        event.key === "/" &&
        !this.isTyping(event.target)
      ) {
        event.preventDefault();

        const input =
          document.getElementById(
            "globalSearchInput"
          );

        if (input) {
          input.focus();
        }
      }

      /*
        ESC
      */
      if (event.key === "Escape") {
        this.closeModal();
        this.closeCommandPalette();
        this.closeNotifications();
      }
    },

    handleRouteChange() {
      const route =
        window.location.hash
          .replace("#/", "")
          .split("?")[0] ||
        "dashboard";

      this.showRoute(route);
    },

    navigate(route) {
      window.location.hash =
        `#/${route}`;
    },

    showRoute(route) {
      const validRoutes = [
        "dashboard",
        "research",
        "market",
        "competitors",
        "customers",
        "content",
        "campaigns",
        "strategy",
        "ai",
        "tools",
        "settings"
      ];

      if (!validRoutes.includes(route)) {
        route = "dashboard";
      }

      this.state.currentRoute = route;

      document
        .querySelectorAll(".route-view")
        .forEach((view) => {
          view.classList.toggle(
            "hidden",
            view.dataset.view !== route
          );
        });

      document
        .querySelectorAll(
          "[data-route]"
        )
        .forEach((item) => {
          item.classList.toggle(
            "active",
            item.dataset.route === route
          );
        });

      this.updatePageHeader(route);

      this.closeSidebarMobile();

      /*
        Refresh module-specific content
      */
      this.refreshRoute(route);
    },

    refreshRoute(route) {
      try {
        switch (route) {
          case "dashboard":
            this.updateDashboard();
            break;

          case "research":
            if (
              window.Research &&
              typeof window.Research.render ===
                "function"
            ) {
              window.Research.render();
            }
            break;

          case "customers":
            if (
              window.Customer &&
              typeof window.Customer.render ===
                "function"
            ) {
              window.Customer.render();
            }
            break;

          case "competitors":
            if (
              window.Competitor &&
              typeof window.Competitor.render ===
                "function"
            ) {
              window.Competitor.render();
            }
            break;

          case "content":
            if (
              window.Content &&
              typeof window.Content.render ===
                "function"
            ) {
              window.Content.render();
            }
            break;

          case "campaigns":
            if (
              window.Campaign &&
              typeof window.Campaign.render ===
                "function"
            ) {
              window.Campaign.render();
            }
            break;

          case "strategy":
            if (
              window.Strategy &&
              typeof window.Strategy.render ===
                "function"
            ) {
              window.Strategy.render();
            }
            break;

          case "ai":
            if (
              window.AI &&
              typeof window.AI.render ===
                "function"
            ) {
              window.AI.render();
            }
            break;

          case "tools":
            if (
              window.Tools &&
              typeof window.Tools.render ===
                "function"
            ) {
              window.Tools.render();
            }
            break;

          default:
            break;
        }
      } catch (error) {
        console.error(
          `Route ${route} error:`,
          error
        );
      }
    },

    updatePageHeader(route) {
      const pages = {
        dashboard: {
          eyebrow: "OVERVIEW",
          title: "Dashboard",
          description:
            "Satu workspace untuk memahami market, customer, competitor, content, dan campaign."
        },

        research: {
          eyebrow: "RESEARCH",
          title: "Research",
          description:
            "Kelola seluruh research project dan intelligence."
        },

        market: {
          eyebrow: "MARKET INTELLIGENCE",
          title: "Market Intelligence",
          description:
            "Pahami demand, competition, trend, threat, dan opportunity."
        },

        competitors: {
          eyebrow: "COMPETITOR INTELLIGENCE",
          title: "Competitor Intelligence",
          description:
            "Bandingkan positioning, offer, messaging, content, dan customer perception."
        },

        customers: {
          eyebrow: "CUSTOMER INTELLIGENCE",
          title: "Customer Intelligence",
          description:
            "Dengarkan customer melalui pain, desire, objection, need, dan intent."
        },

        content: {
          eyebrow: "CONTENT INTELLIGENCE",
          title: "Content Intelligence",
          description:
            "Temukan pola konten yang bekerja dan mengapa."
        },

        campaigns: {
          eyebrow: "CAMPAIGN INTELLIGENCE",
          title: "Campaign Intelligence",
          description:
            "Temukan bottleneck campaign dan peluang eksperimen."
        },

        strategy: {
          eyebrow: "DECISION",
          title: "Strategy",
          description:
            "Ubah intelligence menjadi keputusan marketing."
        },

        ai: {
          eyebrow: "AI ANALYST",
          title: "AI Analyst",
          description:
            "Tanyakan keputusan marketing berdasarkan data workspace."
        },

        tools: {
          eyebrow: "WORKBENCH",
          title: "Marketing Tools",
          description:
            "Tools untuk mempercepat proses research dan keputusan."
        },

        settings: {
          eyebrow: "SETTINGS",
          title: "Settings",
          description:
            "Kelola profile, workspace, preferences, AI, dan data."
        }
      };

      const page =
        pages[route] ||
        pages.dashboard;

      const eyebrow =
        document.getElementById(
          "pageEyebrow"
        );

      const title =
        document.getElementById(
          "pageTitle"
        );

      const description =
        document.getElementById(
          "pageDescription"
        );

      if (eyebrow) {
        eyebrow.textContent =
          page.eyebrow;
      }

      if (title) {
        title.textContent =
          page.title;
      }

      if (description) {
        description.textContent =
          page.description;
      }

      const breadcrumbPage =
        document.getElementById(
          "breadcrumbPage"
        );

      if (breadcrumbPage) {
        breadcrumbPage.textContent =
          page.title;
      }
    },

    updateDashboard() {
      this.updateGreeting();
      this.updateWorkspaceUI();

      /*
        Demo / stored data
      */
      const data =
        this.getAppData();

      const projects =
        data.researchProjects || [];

      const competitors =
        data.competitors || [];

      const customerSignals =
        data.customerSignals || [];

      const opportunities =
        data.opportunities || [];

      this.setText(
        "metricProjects",
        projects.length
      );

      this.setText(
        "metricBrands",
        competitors.length
      );

      this.setText(
        "metricCustomerSignals",
        customerSignals.length
      );

      this.setText(
        "metricOpportunities",
        opportunities.length
      );

      this.renderDailyBrief(data);
      this.renderMarketHealth(data);
      this.renderRecentResearch(projects);
    },

    renderDailyBrief(data) {
      const container =
        document.getElementById(
          "dailyBriefList"
        );

      if (!container) return;

      const briefs =
        data.dailyBrief ||
        [
          {
            title:
              "Workspace siap digunakan",
            description:
              "Mulai dengan membuat research pertama.",
            type: "ACTION"
          },
          {
            title:
              "Import customer comments",
            description:
              "Gunakan Comment Analyzer untuk menemukan customer signals.",
            type: "OPPORTUNITY"
          },
          {
            title:
              "Track competitor",
            description:
              "Tambahkan competitor untuk membangun competitive landscape.",
            type: "NEXT"
          }
        ];

      container.innerHTML =
        briefs
          .slice(0, 3)
          .map(
            (item, index) => `
              <div class="daily-brief-item">
                <span class="daily-brief-number">
                  0${index + 1}
                </span>

                <div>
                  <strong>
                    ${this.escapeHTML(
                      item.title
                    )}
                  </strong>

                  <p>
                    ${this.escapeHTML(
                      item.description
                    )}
                  </p>
                </div>

                <span class="daily-brief-type">
                  ${this.escapeHTML(
                    item.type || "INSIGHT"
                  )}
                </span>
              </div>
            `
          )
          .join("");
    },

    renderMarketHealth(data) {
      const container =
        document.getElementById(
          "marketHealth"
        );

      if (!container) return;

      const health =
        data.marketHealth || {
          score: 0,
          label: "Belum ada data",
          description:
            "Tambahkan market research untuk melihat kondisi market."
        };

      container.innerHTML = `
        <div class="market-health-score">
          <strong>
            ${health.score}
          </strong>

          <span>
            /100
          </span>
        </div>

        <div class="market-health-info">
          <strong>
            ${this.escapeHTML(
              health.label
            )}
          </strong>

          <p>
            ${this.escapeHTML(
              health.description
            )}
          </p>
        </div>
      `;
    },

    renderRecentResearch(projects) {
      const container =
        document.getElementById(
          "recentResearch"
        );

      if (!container) return;

      if (!projects.length) {
        container.innerHTML = `
          <div class="empty-state">
            <h3>
              Belum ada research
            </h3>

            <p>
              Buat research pertama untuk mulai membangun intelligence.
            </p>

            <button
              type="button"
              class="button button-primary"
              data-action="new-research"
            >
              + New Research
            </button>
          </div>
        `;

        return;
      }

      container.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Type</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>

          <tbody>
            ${projects
              .slice(0, 5)
              .map(
                (project) => `
                  <tr>
                    <td>
                      <strong>
                        ${this.escapeHTML(
                          project.name ||
                            "Untitled Research"
                        )}
                      </strong>
                    </td>

                    <td>
                      ${this.escapeHTML(
                        project.type ||
                          "Research"
                      )}
                    </td>

                    <td>
                      <span class="status-badge">
                        ${this.escapeHTML(
                          project.status ||
                            "Active"
                        )}
                      </span>
                    </td>

                    <td>
                      ${this.escapeHTML(
                        project.updatedAt ||
                          "-"
                      )}
                    </td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      `;
    },

    getAppData() {
      /*
        Prioritaskan Storage jika tersedia
      */
      if (
        window.Storage &&
        typeof window.Storage.getAll ===
          "function"
      ) {
        try {
          return (
            window.Storage.getAll() || {}
          );
        } catch (error) {
          console.warn(
            "Storage getAll gagal:",
            error
          );
        }
      }

      /*
        Fallback demo data
      */
      if (window.DEMO_DATA) {
        return window.DEMO_DATA;
      }

      return {};
    },

    updateWorkspaceUI() {
      const data =
        this.getAppData();

      const workspace =
        data.workspace || {};

      const name =
        workspace.name ||
        "My Workspace";

      const user =
        data.user || {};

      const userName =
        user.name ||
        "Analyst";

      const role =
        user.role ||
        "Marketer";

      this.setText(
        "sidebarWorkspaceName",
        name
      );

      this.setText(
        "workspacePreviewName",
        name
      );

      this.setText(
        "profileName",
        userName
      );

      this.setText(
        "topbarProfileName",
        userName
      );

      this.setText(
        "profileRole",
        role
      );

      const initial =
        name
          .charAt(0)
          .toUpperCase();

      this.setText(
        "workspaceAvatar",
        initial
      );

      this.setText(
        "profileAvatar",
        userName
          .charAt(0)
          .toUpperCase()
      );

      this.setText(
        "topbarProfileAvatar",
        userName
          .charAt(0)
          .toUpperCase()
      );

      this.setText(
        "breadcrumbWorkspace",
        name
      );
    },

    updateProfileUI() {
      this.updateWorkspaceUI();
    },

    updateGreeting() {
      const hour =
        new Date().getHours();

      let greeting =
        "Good morning.";

      if (hour >= 12 && hour < 18) {
        greeting =
          "Good afternoon.";
      }

      if (hour >= 18) {
        greeting =
          "Good evening.";
      }

      this.setText(
        "dashboardGreeting",
        greeting
      );
    },

    openNewResearch() {
      this.openModal({
        eyebrow: "RESEARCH",
        title: "New Research",
        description:
          "Buat research project baru.",
        body: `
          <form id="newResearchForm">

            <div class="field">
              <label>
                Research name
              </label>

              <input
                id="researchName"
                type="text"
                placeholder="Contoh: Gen Z Fashion Market Research"
                required
              />
            </div>

            <div class="field">
              <label>
                Research type
              </label>

              <select id="researchType">
                <option value="market">
                  Market Research
                </option>

                <option value="customer">
                  Customer Research
                </option>

                <option value="competitor">
                  Competitor Research
                </option>

                <option value="content">
                  Content Research
                </option>

                <option value="product">
                  Product Research
                </option>

                <option value="brand">
                  Brand Research
                </option>

                <option value="campaign">
                  Campaign Research
                </option>
              </select>
            </div>

          </form>
        `,
        footer: `
          <button
            type="button"
            class="button button-secondary"
            data-action="close-modal"
          >
            Batal
          </button>

          <button
            type="button"
            class="button button-primary"
            id="createResearchButton"
          >
            Buat Research
          </button>
        `
      });

      const button =
        document.getElementById(
          "createResearchButton"
        );

      if (button) {
        button.addEventListener(
          "click",
          () => {
            const name =
              document.getElementById(
                "researchName"
              )?.value
                .trim();

            const type =
              document.getElementById(
                "researchType"
              )?.value;

            if (!name) {
              this.showToast(
                "Masukkan nama research.",
                "error"
              );

              return;
            }

            const project = {
              id:
                "research_" +
                Date.now(),

              name,

              type,

              status: "Active",

              createdAt:
                new Date().toLocaleDateString(
                  "id-ID"
                ),

              updatedAt:
                new Date().toLocaleDateString(
                  "id-ID"
                )
            };

            this.saveArrayItem(
              "researchProjects",
              project
            );

            this.closeModal();

            this.showToast(
              "Research berhasil dibuat.",
              "success"
            );

            this.updateDashboard();

            this.navigate(
              "research"
            );
          }
        );
      }
    },

    openImporter(type) {
      if (
        window.Importer &&
        typeof window.Importer.open ===
          "function"
      ) {
        window.Importer.open({
          type,

          onComplete: (result) => {
            this.handleImportedData(
              type,
              result
            );
          }
        });

        return;
      }

      this.showToast(
        "Importer belum siap.",
        "error"
      );
    },

    handleImportedData(type, result) {
      if (!result || !result.data) {
        return;
      }

      if (type === "comments") {
        this.saveImportedData(
          "customerSignals",
          result.data
        );

        this.showToast(
          `${result.data.length} customer data berhasil diimport.`,
          "success"
        );

        this.navigate(
          "customers"
        );

        return;
      }

      if (type === "content") {
        this.saveImportedData(
          "contentData",
          result.data
        );

        this.showToast(
          `${result.data.length} content berhasil diimport.`,
          "success"
        );

        this.navigate(
          "content"
        );

        return;
      }

      this.showToast(
        "Data berhasil diimport.",
        "success"
      );
    },

    saveImportedData(key, data) {
      if (
        window.Storage &&
        typeof window.Storage.set ===
          "function"
      ) {
        window.Storage.set(
          key,
          data
        );

        return;
      }

      try {
        localStorage.setItem(
          "analsytici_" + key,
          JSON.stringify(data)
        );
      } catch (error) {
        console.error(
          "Gagal menyimpan data:",
          error
        );
      }
    },

    saveArrayItem(key, item) {
      const data =
        this.getAppData();

      const array =
        Array.isArray(data[key])
          ? data[key]
          : [];

      array.push(item);

      if (
        window.Storage &&
        typeof window.Storage.set ===
          "function"
      ) {
        window.Storage.set(
          key,
          array
        );
      } else {
        localStorage.setItem(
          "analsytici_" + key,
          JSON.stringify(array)
        );
      }
    },

    openNewMarketAnalysis() {
      this.showToast(
        "Market Analysis workspace siap dikembangkan.",
        "info"
      );
    },

    openAddCompetitor() {
      this.showToast(
        "Competitor form siap digunakan.",
        "info"
      );
    },

    openCompareCompetitors() {
      this.showToast(
        "Pilih competitor untuk dibandingkan.",
        "info"
      );
    },

    generateSWOT() {
      this.showToast(
        "SWOT akan dibuat berdasarkan competitor data.",
        "info"
      );
    },

    openAddContent() {
      this.showToast(
        "Content form siap digunakan.",
        "info"
      );
    },

    analyzeContent() {
      this.showToast(
        "Content analysis dijalankan.",
        "success"
      );

      if (
        window.Content &&
        typeof window.Content.analyze ===
          "function"
      ) {
        window.Content.analyze();
      }
    },

    openAddCampaign() {
      this.showToast(
        "Campaign form siap digunakan.",
        "info"
      );
    },

    generateExperiment() {
      this.showToast(
        "Experiment recommendation dibuat.",
        "success"
      );
    },

    generateStrategy() {
      this.navigate("strategy");

      setTimeout(() => {
        if (
          window.Strategy &&
          typeof window.Strategy.generate ===
            "function"
        ) {
          window.Strategy.generate();
        } else {
          this.showToast(
            "Strategy membutuhkan intelligence data.",
            "info"
          );
        }
      }, 100);
    },

    openProfileMenu() {
      this.showToast(
        "Profile menu.",
        "info"
      );
    },

    openWorkspaceMenu() {
      this.showToast(
        "Workspace menu.",
        "info"
      );
    },

    togglePassword(element) {
      const targetId =
        element.dataset.target;

      const input =
        document.getElementById(
          targetId
        );

      if (!input) return;

      input.type =
        input.type === "password"
          ? "text"
          : "password";
    },

    demoLogin() {
      /*
        Demo login akan dilewati jika Auth
        sudah memiliki handler sendiri.
      */
      if (
        window.Auth &&
        typeof window.Auth.demoLogin ===
          "function"
      ) {
        window.Auth.demoLogin();
        return;
      }

      this.enterApplication();
    },

    enterApplication() {
      const authApp =
        document.getElementById(
          "authApp"
        );

      const mainApp =
        document.getElementById(
          "mainApp"
        );

      if (authApp) {
        authApp.classList.add(
          "hidden"
        );
      }

      if (mainApp) {
        mainApp.classList.remove(
          "hidden"
        );
      }

      this.navigate("dashboard");
    },

    showAuthScreen(screen) {
      const login =
        document.getElementById(
          "loginScreen"
        );

      const signup =
        document.getElementById(
          "signupScreen"
        );

      const onboarding =
        document.getElementById(
          "onboardingScreen"
        );

      if (login) {
        login.classList.toggle(
          "hidden",
          screen !== "login"
        );
      }

      if (signup) {
        signup.classList.toggle(
          "hidden",
          screen !== "signup"
        );
      }

      if (onboarding) {
        onboarding.classList.add(
          "hidden"
        );
      }
    },

    openNotifications() {
      const drawer =
        document.getElementById(
          "notificationDrawer"
        );

      if (!drawer) return;

      drawer.classList.add(
        "open"
      );

      drawer.setAttribute(
        "aria-hidden",
        "false"
      );
    },

    closeNotifications() {
      const drawer =
        document.getElementById(
          "notificationDrawer"
        );

      if (!drawer) return;

      drawer.classList.remove(
        "open"
      );

      drawer.setAttribute(
        "aria-hidden",
        "true"
      );
    },

    openModal(options = {}) {
      const layer =
        document.getElementById(
          "globalModal"
        );

      if (!layer) return;

      this.setText(
        "modalEyebrow",
        options.eyebrow || ""
      );

      this.setText(
        "modalTitle",
        options.title || "Modal"
      );

      this.setText(
        "modalDescription",
        options.description || ""
      );

      const body =
        document.getElementById(
          "modalBody"
        );

      const footer =
        document.getElementById(
          "modalFooter"
        );

      if (body) {
        body.innerHTML =
          options.body || "";
      }

      if (footer) {
        footer.innerHTML =
          options.footer || "";
      }

      layer.classList.remove(
        "hidden"
      );

      layer.setAttribute(
        "aria-hidden",
        "false"
      );
    },

    closeModal() {
      const layer =
        document.getElementById(
          "globalModal"
        );

      if (!layer) return;

      layer.classList.add(
        "hidden"
      );

      layer.setAttribute(
        "aria-hidden",
        "true"
      );
    },

    closeCommandPalette() {
      const palette =
        document.getElementById(
          "commandPalette"
        );

      if (!palette) return;

      palette.classList.add(
        "hidden"
      );
    },

    toggleSidebar() {
      const sidebar =
        document.getElementById(
          "appSidebar"
        );

      if (!sidebar) return;

      if (
        window.innerWidth <= 900
      ) {
        sidebar.classList.toggle(
          "mobile-open"
        );

        return;
      }

      sidebar.classList.toggle(
        "collapsed"
      );

      this.state.sidebarCollapsed =
        sidebar.classList.contains(
          "collapsed"
        );
    },

    closeSidebarMobile() {
      const sidebar =
        document.getElementById(
          "appSidebar"
        );

      if (!sidebar) return;

      sidebar.classList.remove(
        "mobile-open"
      );
    },

    dismissError() {
      const error =
        document.getElementById(
          "globalError"
        );

      if (error) {
        error.classList.add(
          "hidden"
        );
      }
    },

    showToast(message, type = "info") {
      const container =
        document.getElementById(
          "toastContainer"
        );

      if (!container) {
        console.log(
          `[${type}]`,
          message
        );

        return;
      }

      const toast =
        document.createElement(
          "div"
        );

      toast.className =
        `toast toast-${type}`;

      toast.innerHTML = `
        <span class="toast-message">
          ${this.escapeHTML(message)}
        </span>

        <button
          type="button"
          class="toast-close"
        >
          ×
        </button>
      `;

      const close =
        toast.querySelector(
          ".toast-close"
        );

      close.addEventListener(
        "click",
        () => {
          toast.remove();
        }
      );

      container.appendChild(
        toast
      );

      setTimeout(() => {
        toast.remove();
      }, 4000);
    },

    hideBootScreen() {
      const boot =
        document.getElementById(
          "appBoot"
        );

      if (!boot) return;

      setTimeout(() => {
        boot.classList.add(
          "hidden"
        );
      }, 300);
    },

    isTyping(element) {
      if (!element) return false;

      const tag =
        element.tagName?.toLowerCase();

      return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        element.isContentEditable
      );
    },

    setText(id, value) {
      const element =
        document.getElementById(id);

      if (element) {
        element.textContent =
          value ?? "";
      }
    },

    escapeHTML(value) {
      const div =
        document.createElement(
          "div"
        );

      div.textContent =
        String(value ?? "");

      return div.innerHTML;
    }
  };

  /*
    Expose globally
  */

  window.App = App;

  /*
    Start application
  */

  document.addEventListener(
    "DOMContentLoaded",
    () => {
      App.init();
    }
  );

})();
