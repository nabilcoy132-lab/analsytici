window.ANALSYTICI_ROUTER = {
  currentRoute: "dashboard",

  init() {
    this.handleRoute();

    window.addEventListener("hashchange", () => {
      this.handleRoute();
    });

    document.querySelectorAll("[data-route-link]").forEach(link => {
      link.addEventListener("click", () => {
        setTimeout(() => this.handleRoute(), 0);
      });
    });
  },

  handleRoute() {
    let route = window.location.hash
      .replace("#/", "")
      .split("?")[0];

    if (!route) {
      route = "dashboard";
    }

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

    this.currentRoute = route;

    document.querySelectorAll(".route-view").forEach(view => {
      view.classList.add("hidden");
    });

    const activeView =
      document.getElementById(`view-${route}`);

    if (activeView) {
      activeView.classList.remove("hidden");
    }

    document.querySelectorAll("[data-route]").forEach(item => {
      item.classList.toggle(
        "active",
        item.dataset.route === route
      );
    });

    const pageTitle = document.getElementById("pageTitle");
    const breadcrumbPage =
      document.getElementById("breadcrumbPage");

    const titles = {
      dashboard: "Dashboard",
      research: "Research",
      market: "Market Intelligence",
      competitors: "Competitor Intelligence",
      customers: "Customer Intelligence",
      content: "Content Intelligence",
      campaigns: "Campaign Intelligence",
      strategy: "Strategy",
      ai: "AI Analyst",
      tools: "Tools",
      settings: "Settings"
    };

    const title = titles[route] || "Dashboard";

    if (pageTitle) {
      pageTitle.textContent = title;
    }

    if (breadcrumbPage) {
      breadcrumbPage.textContent = title;
    }
  }
};
