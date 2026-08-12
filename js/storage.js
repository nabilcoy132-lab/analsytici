window.ANALSYTICI_STORAGE = {
  prefix: window.ANALSYTICI_CONFIG.storagePrefix,

  set(key, value) {
    localStorage.setItem(
      `${this.prefix}:${key}`,
      JSON.stringify(value)
    );
  },

  get(key, fallback = null) {
    try {
      const value = localStorage.getItem(
        `${this.prefix}:${key}`
      );

      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  },

  remove(key) {
    localStorage.removeItem(
      `${this.prefix}:${key}`
    );
  }
};
