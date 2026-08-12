/*
 * ANALSYTICI
 * Local Storage Engine
 *
 * Fungsi:
 * - Menyimpan workspace
 * - Menyimpan user
 * - Menyimpan research
 * - Menyimpan customer signals
 * - Menyimpan competitor
 * - Menyimpan content
 * - Menyimpan campaign
 * - Menyimpan strategy
 * - Menyimpan preferences
 */

(function () {
  "use strict";

  const CONFIG = window.ANALSYTICI_CONFIG || {};

  const PREFIX = CONFIG.storagePrefix || "analsytici";

  const KEYS = {
    USER: `${PREFIX}:user`,
    WORKSPACE: `${PREFIX}:workspace`,
    RESEARCH: `${PREFIX}:research`,
    CUSTOMERS: `${PREFIX}:customers`,
    COMPETITORS: `${PREFIX}:competitors`,
    CONTENT: `${PREFIX}:content`,
    CAMPAIGNS: `${PREFIX}:campaigns`,
    STRATEGY: `${PREFIX}:strategy`,
    PREFERENCES: `${PREFIX}:preferences`,
    AI_MESSAGES: `${PREFIX}:ai_messages`,
    NOTIFICATIONS: `${PREFIX}:notifications`,
    ONBOARDING: `${PREFIX}:onboarding`,
    SETTINGS: `${PREFIX}:settings`
  };


  // =========================================================
  // BASIC STORAGE
  // =========================================================

  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("ANALSYTICI Storage Set Error:", error);
      return false;
    }
  }


  function get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);

      if (raw === null) {
        return fallback;
      }

      return JSON.parse(raw);
    } catch (error) {
      console.error("ANALSYTICI Storage Get Error:", error);
      return fallback;
    }
  }


  function remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("ANALSYTICI Storage Remove Error:", error);
      return false;
    }
  }


  function clearAll() {
    Object.values(KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });

    return true;
  }


  // =========================================================
  // USER
  // =========================================================

  function saveUser(user) {
    return set(KEYS.USER, {
      ...user,
      updatedAt: new Date().toISOString()
    });
  }


  function getUser() {
    return get(KEYS.USER, null);
  }


  function clearUser() {
    return remove(KEYS.USER);
  }


  // =========================================================
  // WORKSPACE
  // =========================================================

  function saveWorkspace(workspace) {
    return set(KEYS.WORKSPACE, {
      ...workspace,
      updatedAt: new Date().toISOString()
    });
  }


  function getWorkspace() {
    return get(KEYS.WORKSPACE, null);
  }


  function updateWorkspace(updates) {
    const current = getWorkspace() || {};

    return saveWorkspace({
      ...current,
      ...updates
    });
  }


  // =========================================================
  // RESEARCH
  // =========================================================

  function getResearch() {
    return get(KEYS.RESEARCH, []);
  }


  function saveResearch(research) {
    return set(KEYS.RESEARCH, research);
  }


  function addResearch(project) {
    const projects = getResearch();

    const newProject = {
      id:
        project.id ||
        `research_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      createdAt:
        project.createdAt ||
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),

      status: project.status || "active",

      ...project
    };

    projects.unshift(newProject);

    saveResearch(projects);

    return newProject;
  }


  function updateResearch(id, updates) {
    const projects = getResearch();

    const index = projects.findIndex(
      (project) => project.id === id
    );

    if (index === -1) {
      return null;
    }

    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    saveResearch(projects);

    return projects[index];
  }


  function deleteResearch(id) {
    const projects = getResearch().filter(
      (project) => project.id !== id
    );

    saveResearch(projects);

    return true;
  }


  function getResearchById(id) {
    return getResearch().find(
      (project) => project.id === id
    ) || null;
  }


  // =========================================================
  // CUSTOMERS
  // =========================================================

  function getCustomers() {
    return get(KEYS.CUSTOMERS, []);
  }


  function saveCustomers(customers) {
    return set(KEYS.CUSTOMERS, customers);
  }


  function addCustomerSignal(signal) {
    const signals = getCustomers();

    const newSignal = {
      id:
        signal.id ||
        `customer_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      createdAt:
        signal.createdAt ||
        new Date().toISOString(),

      ...signal
    };

    signals.unshift(newSignal);

    saveCustomers(signals);

    return newSignal;
  }


  function deleteCustomerSignal(id) {
    const signals = getCustomers().filter(
      (signal) => signal.id !== id
    );

    saveCustomers(signals);

    return true;
  }


  // =========================================================
  // COMPETITORS
  // =========================================================

  function getCompetitors() {
    return get(KEYS.COMPETITORS, []);
  }


  function saveCompetitors(competitors) {
    return set(KEYS.COMPETITORS, competitors);
  }


  function addCompetitor(competitor) {
    const competitors = getCompetitors();

    const newCompetitor = {
      id:
        competitor.id ||
        `competitor_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      createdAt:
        competitor.createdAt ||
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),

      ...competitor
    };

    competitors.unshift(newCompetitor);

    saveCompetitors(competitors);

    return newCompetitor;
  }


  function updateCompetitor(id, updates) {
    const competitors = getCompetitors();

    const index = competitors.findIndex(
      (item) => item.id === id
    );

    if (index === -1) {
      return null;
    }

    competitors[index] = {
      ...competitors[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    saveCompetitors(competitors);

    return competitors[index];
  }


  function deleteCompetitor(id) {
    const competitors = getCompetitors().filter(
      (item) => item.id !== id
    );

    saveCompetitors(competitors);

    return true;
  }


  // =========================================================
  // CONTENT
  // =========================================================

  function getContent() {
    return get(KEYS.CONTENT, []);
  }


  function saveContent(content) {
    return set(KEYS.CONTENT, content);
  }


  function addContent(content) {
    const items = getContent();

    const newContent = {
      id:
        content.id ||
        `content_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      createdAt:
        content.createdAt ||
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),

      ...content
    };

    items.unshift(newContent);

    saveContent(items);

    return newContent;
  }


  function updateContent(id, updates) {
    const items = getContent();

    const index = items.findIndex(
      (item) => item.id === id
    );

    if (index === -1) {
      return null;
    }

    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    saveContent(items);

    return items[index];
  }


  function deleteContent(id) {
    const items = getContent().filter(
      (item) => item.id !== id
    );

    saveContent(items);

    return true;
  }


  // =========================================================
  // CAMPAIGNS
  // =========================================================

  function getCampaigns() {
    return get(KEYS.CAMPAIGNS, []);
  }


  function saveCampaigns(campaigns) {
    return set(KEYS.CAMPAIGNS, campaigns);
  }


  function addCampaign(campaign) {
    const campaigns = getCampaigns();

    const newCampaign = {
      id:
        campaign.id ||
        `campaign_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      createdAt:
        campaign.createdAt ||
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),

      ...campaign
    };

    campaigns.unshift(newCampaign);

    saveCampaigns(campaigns);

    return newCampaign;
  }


  function updateCampaign(id, updates) {
    const campaigns = getCampaigns();

    const index = campaigns.findIndex(
      (item) => item.id === id
    );

    if (index === -1) {
      return null;
    }

    campaigns[index] = {
      ...campaigns[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    saveCampaigns(campaigns);

    return campaigns[index];
  }


  function deleteCampaign(id) {
    const campaigns = getCampaigns().filter(
      (item) => item.id !== id
    );

    saveCampaigns(campaigns);

    return true;
  }


  // =========================================================
  // STRATEGY
  // =========================================================

  function getStrategy() {
    return get(KEYS.STRATEGY, null);
  }


  function saveStrategy(strategy) {
    return set(KEYS.STRATEGY, {
      ...strategy,
      updatedAt: new Date().toISOString()
    });
  }


  // =========================================================
  // PREFERENCES
  // =========================================================

  function getPreferences() {
    return get(KEYS.PREFERENCES, {
      language: "id",
      theme: "dark",
      notifications: true,
      compactMode: false
    });
  }


  function savePreferences(preferences) {
    return set(KEYS.PREFERENCES, preferences);
  }


  function updatePreferences(updates) {
    const current = getPreferences();

    return savePreferences({
      ...current,
      ...updates
    });
  }


  // =========================================================
  // AI MESSAGES
  // =========================================================

  function getAIMessages() {
    return get(KEYS.AI_MESSAGES, []);
  }


  function saveAIMessages(messages) {
    return set(KEYS.AI_MESSAGES, messages);
  }


  function addAIMessage(message) {
    const messages = getAIMessages();

    const newMessage = {
      id:
        message.id ||
        `ai_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      createdAt:
        message.createdAt ||
        new Date().toISOString(),

      ...message
    };

    messages.push(newMessage);

    saveAIMessages(messages);

    return newMessage;
  }


  function clearAIMessages() {
    return remove(KEYS.AI_MESSAGES);
  }


  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  function getNotifications() {
    return get(KEYS.NOTIFICATIONS, []);
  }


  function saveNotifications(notifications) {
    return set(KEYS.NOTIFICATIONS, notifications);
  }


  function addNotification(notification) {
    const notifications = getNotifications();

    const newNotification = {
      id:
        notification.id ||
        `notification_${Date.now()}`,

      createdAt:
        notification.createdAt ||
        new Date().toISOString(),

      read: false,

      ...notification
    };

    notifications.unshift(newNotification);

    saveNotifications(notifications);

    return newNotification;
  }


  function markNotificationRead(id) {
    const notifications = getNotifications();

    const notification = notifications.find(
      (item) => item.id === id
    );

    if (!notification) {
      return false;
    }

    notification.read = true;

    saveNotifications(notifications);

    return true;
  }


  function markAllNotificationsRead() {
    const notifications = getNotifications().map(
      (notification) => ({
        ...notification,
        read: true
      })
    );

    saveNotifications(notifications);

    return true;
  }


  // =========================================================
  // ONBOARDING
  // =========================================================

  function getOnboarding() {
    return get(KEYS.ONBOARDING, {
      completed: false,
      step: 1,
      role: "",
      industry: "",
      goal: "",
      experience: "",
      workspaceName: ""
    });
  }


  function saveOnboarding(data) {
    return set(KEYS.ONBOARDING, data);
  }


  function updateOnboarding(updates) {
    const current = getOnboarding();

    return saveOnboarding({
      ...current,
      ...updates
    });
  }


  // =========================================================
  // SETTINGS
  // =========================================================

  function getSettings() {
    return get(KEYS.SETTINGS, {
      profile: {},
      workspace: {},
      preferences: {},
      ai: {},
      data: {}
    });
  }


  function saveSettings(settings) {
    return set(KEYS.SETTINGS, settings);
  }


  function updateSettings(section, updates) {
    const settings = getSettings();

    settings[section] = {
      ...(settings[section] || {}),
      ...updates
    };

    return saveSettings(settings);
  }


  // =========================================================
  // DATABASE SNAPSHOT
  // =========================================================

  function getSnapshot() {
    return {
      user: getUser(),
      workspace: getWorkspace(),
      research: getResearch(),
      customers: getCustomers(),
      competitors: getCompetitors(),
      content: getContent(),
      campaigns: getCampaigns(),
      strategy: getStrategy(),
      preferences: getPreferences(),
      aiMessages: getAIMessages(),
      notifications: getNotifications(),
      onboarding: getOnboarding(),
      settings: getSettings()
    };
  }


  // =========================================================
  // EXPORT / IMPORT
  // =========================================================

  function exportData() {
    const snapshot = getSnapshot();

    return JSON.stringify(snapshot, null, 2);
  }


  function importData(json) {
    try {
      const data =
        typeof json === "string"
          ? JSON.parse(json)
          : json;

      if (!data || typeof data !== "object") {
        throw new Error("Invalid data format.");
      }

      if (data.user) {
        saveUser(data.user);
      }

      if (data.workspace) {
        saveWorkspace(data.workspace);
      }

      if (Array.isArray(data.research)) {
        saveResearch(data.research);
      }

      if (Array.isArray(data.customers)) {
        saveCustomers(data.customers);
      }

      if (Array.isArray(data.competitors)) {
        saveCompetitors(data.competitors);
      }

      if (Array.isArray(data.content)) {
        saveContent(data.content);
      }

      if (Array.isArray(data.campaigns)) {
        saveCampaigns(data.campaigns);
      }

      if (data.strategy) {
        saveStrategy(data.strategy);
      }

      if (data.preferences) {
        savePreferences(data.preferences);
      }

      if (Array.isArray(data.aiMessages)) {
        saveAIMessages(data.aiMessages);
      }

      if (Array.isArray(data.notifications)) {
        saveNotifications(data.notifications);
      }

      if (data.onboarding) {
        saveOnboarding(data.onboarding);
      }

      if (data.settings) {
        saveSettings(data.settings);
      }

      return true;

    } catch (error) {
      console.error(
        "ANALSYTICI Import Error:",
        error
      );

      return false;
    }
  }


  // =========================================================
  // STORAGE INFO
  // =========================================================

  function getStorageInfo() {
    const snapshot = getSnapshot();

    const serialized =
      JSON.stringify(snapshot);

    return {
      keys: Object.keys(KEYS).length,
      characters: serialized.length,
      approximateKB:
        Math.round(
          serialized.length / 1024
        ),
      researchCount:
        snapshot.research.length,
      customerCount:
        snapshot.customers.length,
      competitorCount:
        snapshot.competitors.length,
      contentCount:
        snapshot.content.length,
      campaignCount:
        snapshot.campaigns.length
    };
  }


  // =========================================================
  // PUBLIC API
  // =========================================================

  window.ANALSYTICI_STORAGE = {

    KEYS,

    set,
    get,
    remove,
    clearAll,

    saveUser,
    getUser,
    clearUser,

    saveWorkspace,
    getWorkspace,
    updateWorkspace,

    getResearch,
    saveResearch,
    addResearch,
    updateResearch,
    deleteResearch,
    getResearchById,

    getCustomers,
    saveCustomers,
    addCustomerSignal,
    deleteCustomerSignal,

    getCompetitors,
    saveCompetitors,
    addCompetitor,
    updateCompetitor,
    deleteCompetitor,

    getContent,
    saveContent,
    addContent,
    updateContent,
    deleteContent,

    getCampaigns,
    saveCampaigns,
    addCampaign,
    updateCampaign,
    deleteCampaign,

    getStrategy,
    saveStrategy,

    getPreferences,
    savePreferences,
    updatePreferences,

    getAIMessages,
    saveAIMessages,
    addAIMessage,
    clearAIMessages,

    getNotifications,
    saveNotifications,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,

    getOnboarding,
    saveOnboarding,
    updateOnboarding,

    getSettings,
    saveSettings,
    updateSettings,

    getSnapshot,
    exportData,
    importData,
    getStorageInfo
  };


  console.log(
    "ANALSYTICI Storage initialized."
  );

})();
