// =========================================================
// ANALSYTICI — ROUTER
// Hash-based routing for GitHub Pages
// =========================================================

window.ANALSYTICI_ROUTER = {

  currentRoute: "dashboard",

  routes: {
    dashboard: {
      title: "Dashboard",
      eyebrow: "OVERVIEW",
      description:
        "Satu workspace untuk memahami market, customer, competitor, content, dan campaign."
    },

    research: {
      title: "Research",
      eyebrow: "RESEARCH WORKSPACE",
      description:
        "Kelola seluruh project research dan intelligence."
    },

    market: {
      title: "Market Intelligence",
      eyebrow: "MARKET INTELLIGENCE",
      description:
        "Pahami market, demand, trends, threats, dan opportunity."
    },

    competitors: {
      title: "Competitor Intelligence",
      eyebrow: "COMPETITOR INTELLIGENCE",
      description:
        "Pahami positioning, offer, pricing, messaging, dan competitive gap."
    },

    customers: {
      title: "Customer Intelligence",
      eyebrow: "CUSTOMER INTELLIGENCE",
      description:
        "Dengarkan customer melalui pain, desire, objection, need, dan buying signals."
    },

    content: {
      title: "Content Intelligence",
      eyebrow: "CONTENT INTELLIGENCE",
      description:
        "Temukan pola konten yang bekerja dan peluang content berikutnya."
    },

    campaigns: {
      title: "Campaign Intelligence",
      eyebrow: "CAMPAIGN INTELLIGENCE",
      description:
        "Analisis funnel, conversion, efficiency, dan campaign bottleneck."
    },

    strategy: {
      title: "Strategy",
      eyebrow: "DECISION",
      description:
        "Ubah intelligence menjadi keputusan marketing."
    },

    ai: {
      title: "AI Analyst",
      eyebrow: "AI ANALYST",
      description:
        "Tanyakan keputusan marketing berdasarkan data workspace."
    },

    tools: {
      title: "Tools",
      eyebrow: "MARKETING WORKBENCH",
      description:
        "Gunakan tools untuk mempercepat research dan keputusan marketing."
    },

    settings: {
      title: "Settings",
      eyebrow: "SETTINGS",
      description:
        "Kelola profile, workspace, preferences, AI, dan data."
    }
  },


  // -------------------------------------------------------
  // INIT
  // -------------------------------------------------------

  init() {

    window.addEventListener(
      "hashchange",
      () => this.handleRoute()
    );

    document.addEventListener(
      "click",
      (event) => {

        const link =
          event.target.closest(
            "[data-route-link]"
          );

        if (!link) {
          return;
        }

        const href =
          link.getAttribute("href");

        if (
          href &&
          href.startsWith("#/")
        ) {

          this.closeMobileSidebar();

        }

      }
    );

    this.handleRoute();

    console.log(
      "ANALSYTICI Router loaded"
    );

  },


  // -------------------------------------------------------
  // HANDLE ROUTE
  // -------------------------------------------------------

  handleRoute() {

    let route =
      window.location.hash
        .replace("#/", "")
        .split("?")[0]
        .trim();


    if (!route) {
      route = "dashboard";
    }


    if (!this.routes[route]) {
      route = "dashboard";
    }


    this.currentRoute = route;

    this.render(route);

  },


  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------

  render(route) {

    this.hideAllViews();

    this.showView(route);

    this.updateNavigation(route);

    this.updatePageHeader(route);

    this.updateBreadcrumb(route);

    this.runRouteModule(route);

    this.closeMobileSidebar();

  },


  // -------------------------------------------------------
  // VIEWS
  // -------------------------------------------------------

  hideAllViews() {

    document
      .querySelectorAll(".route-view")
      .forEach(view => {

        view.classList.add("hidden");

        view.classList.remove("active");

      });

  },


  showView(route) {

    const view =
      document.getElementById(
        `view-${route}`
      );

    if (!view) {

      console.warn(
        `ANALSYTICI: View "${route}" tidak ditemukan.`
      );

      return;

    }


    view.classList.remove("hidden");

    view.classList.add("active");

  },


  // -------------------------------------------------------
  // NAVIGATION
  // -------------------------------------------------------

  updateNavigation(route) {

    document
      .querySelectorAll(
        "[data-route]"
      )
      .forEach(item => {

        const itemRoute =
          item.dataset.route;

        item.classList.toggle(
          "active",
          itemRoute === route
        );

      });

  },


  // -------------------------------------------------------
  // PAGE HEADER
  // -------------------------------------------------------

  updatePageHeader(route) {

    const config =
      this.routes[route];

    if (!config) {
      return;
    }


    const title =
      document.getElementById(
        "pageTitle"
      );

    const eyebrow =
      document.getElementById(
        "pageEyebrow"
      );

    const description =
      document.getElementById(
        "pageDescription"
      );


    if (title) {
      title.textContent =
        config.title;
    }


    if (eyebrow) {
      eyebrow.textContent =
        config.eyebrow;
    }


    if (description) {
      description.textContent =
        config.description;
    }

  },


  // -------------------------------------------------------
  // BREADCRUMB
  // -------------------------------------------------------

  updateBreadcrumb(route) {

    const config =
      this.routes[route];

    if (!config) {
      return;
    }


    const workspace =
      window.ANALSYTICI_STORAGE
        ?.getWorkspace();


    const workspaceName =
      workspace?.name ||
      "Workspace";


    const breadcrumbWorkspace =
      document.getElementById(
        "breadcrumbWorkspace"
      );

    const breadcrumbPage =
      document.getElementById(
        "breadcrumbPage"
      );


    if (breadcrumbWorkspace) {

      breadcrumbWorkspace.textContent =
        workspaceName;

    }


    if (breadcrumbPage) {

      breadcrumbPage.textContent =
        config.title;

    }

  },


  // -------------------------------------------------------
  // ROUTE MODULE
  // -------------------------------------------------------

  runRouteModule(route) {

    /*
      Module akan otomatis dijalankan jika
      mempunyai function render().
    */

    const modules = {

      dashboard:
        window.ANALSYTICI_APP,

      research:
        window.ANALSYTICI_RESEARCH,

      market:
        window.ANALSYTICI_MARKET,

      competitors:
        window.ANALSYTICI_COMPETITOR,

      customers:
        window.ANALSYTICI_CUSTOMER,

      content:
        window.ANALSYTICI_CONTENT,

      campaigns:
        window.ANALSYTICI_CAMPAIGN,

      strategy:
        window.ANALSYTICI_STRATEGY,

      ai:
        window.ANALSYTICI_AI,

      tools:
        window.ANALSYTICI_TOOLS

    };


    const module =
      modules[route];


    if (!module) {
      return;
    }


    try {

      if (
        typeof module.render ===
        "function"
      ) {

        module.render();

      } else if (
        typeof module.load ===
        "function"
      ) {

        module.load();

      }

    } catch (error) {

      console.error(
        `Error pada module ${route}:`,
        error
      );

    }

  },


  // -------------------------------------------------------
  // NAVIGATE
  // -------------------------------------------------------

  navigate(route) {

    if (!this.routes[route]) {
      route = "dashboard";
    }


    window.location.hash =
      `#/${route}`;

  },


  // -------------------------------------------------------
  // GET CURRENT ROUTE
  // -------------------------------------------------------

  getCurrentRoute() {

    return this.currentRoute;

  },


  // -------------------------------------------------------
  // MOBILE SIDEBAR
  // -------------------------------------------------------

  closeMobileSidebar() {

    const sidebar =
      document.getElementById(
        "appSidebar"
      );

    const overlay =
      document.getElementById(
        "sidebarOverlay"
      );


    if (sidebar) {

      sidebar.classList.remove(
        "mobile-open"
      );

    }


    if (overlay) {

      overlay.classList.remove(
        "active"
      );

    }

  },


  openMobileSidebar() {

    const sidebar =
      document.getElementById(
        "appSidebar"
      );

    const overlay =
      document.getElementById(
        "sidebarOverlay"
      );


    if (sidebar) {

      sidebar.classList.add(
        "mobile-open"
      );

    }


    if (overlay) {

      overlay.classList.add(
        "active"
      );

    }

  }

};


// =========================================================
// GLOBAL ROUTER INIT
// =========================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    window.ANALSYTICI_ROUTER.init();

  }
);
