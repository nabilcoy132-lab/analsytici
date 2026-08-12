// =========================================================
// ANALSYTICI — STORAGE
// Local-first workspace persistence
// =========================================================

window.ANALSYTICI_STORAGE = {

  prefix:
    window.ANALSYTICI_CONFIG?.storagePrefix ||
    "analsytici",

  // -------------------------------------------------------
  // KEY
  // -------------------------------------------------------

  key(name) {
    return `${this.prefix}_${name}`;
  },


  // -------------------------------------------------------
  // SAVE
  // -------------------------------------------------------

  save(name, data) {

    try {

      localStorage.setItem(
        this.key(name),
        JSON.stringify(data)
      );

      return true;

    } catch (error) {

      console.error(
        "ANALSYTICI Storage Save Error:",
        error
      );

      return false;
    }
  },


  // -------------------------------------------------------
  // GET
  // -------------------------------------------------------

  get(name, fallback = null) {

    try {

      const value =
        localStorage.getItem(
          this.key(name)
        );

      if (value === null) {
        return fallback;
      }

      return JSON.parse(value);

    } catch (error) {

      console.error(
        "ANALSYTICI Storage Get Error:",
        error
      );

      return fallback;
    }
  },


  // -------------------------------------------------------
  // REMOVE
  // -------------------------------------------------------

  remove(name) {

    try {

      localStorage.removeItem(
        this.key(name)
      );

      return true;

    } catch (error) {

      console.error(
        "ANALSYTICI Storage Remove Error:",
        error
      );

      return false;
    }
  },


  // -------------------------------------------------------
  // CLEAR ANALSYTICI DATA
  // -------------------------------------------------------

  clear() {

    try {

      const keys = [];

      for (let i = 0; i < localStorage.length; i++) {

        const key =
          localStorage.key(i);

        if (
          key &&
          key.startsWith(
            `${this.prefix}_`
          )
        ) {
          keys.push(key);
        }
      }

      keys.forEach(key => {
        localStorage.removeItem(key);
      });

      return true;

    } catch (error) {

      console.error(
        "ANALSYTICI Storage Clear Error:",
        error
      );

      return false;
    }
  },


  // -------------------------------------------------------
  // CHECK
  // -------------------------------------------------------

  exists(name) {

    return (
      localStorage.getItem(
        this.key(name)
      ) !== null
    );

  },


  // -------------------------------------------------------
  // WORKSPACE
  // -------------------------------------------------------

  saveWorkspace(workspace) {

    return this.save(
      "workspace",
      workspace
    );

  },


  getWorkspace() {

    return this.get(
      "workspace",
      null
    );

  },


  // -------------------------------------------------------
  // USER
  // -------------------------------------------------------

  saveUser(user) {

    return this.save(
      "user",
      user
    );

  },


  getUser() {

    return this.get(
      "user",
      null
    );

  },


  removeUser() {

    return this.remove(
      "user"
    );

  },


  // -------------------------------------------------------
  // SESSION
  // -------------------------------------------------------

  saveSession(session) {

    return this.save(
      "session",
      session
    );

  },


  getSession() {

    return this.get(
      "session",
      null
    );

  },


  clearSession() {

    return this.remove(
      "session"
    );

  },


  // -------------------------------------------------------
  // GENERIC COLLECTION
  // -------------------------------------------------------

  getCollection(name) {

    return this.get(
      name,
      []
    );

  },


  saveCollection(name, items) {

    if (!Array.isArray(items)) {
      items = [];
    }

    return this.save(
      name,
      items
    );

  },


  addToCollection(name, item) {

    const collection =
      this.getCollection(name);

    collection.push(item);

    this.saveCollection(
      name,
      collection
    );

    return item;

  },


  updateCollectionItem(
    name,
    id,
    updates
  ) {

    const collection =
      this.getCollection(name);

    const index =
      collection.findIndex(
        item => item.id === id
      );

    if (index === -1) {
      return false;
    }

    collection[index] = {
      ...collection[index],
      ...updates
    };

    this.saveCollection(
      name,
      collection
    );

    return collection[index];

  },


  deleteCollectionItem(
    name,
    id
  ) {

    const collection =
      this.getCollection(name);

    const filtered =
      collection.filter(
        item => item.id !== id
      );

    this.saveCollection(
      name,
      filtered
    );

    return true;

  },


  // -------------------------------------------------------
  // APP STATE
  // -------------------------------------------------------

  saveState(state) {

    return this.save(
      "app_state",
      state
    );

  },


  getState() {

    return this.get(
      "app_state",
      {}
    );

  },


  // -------------------------------------------------------
  // EXPORT
  // -------------------------------------------------------

  exportData() {

    const data = {};

    for (
      let i = 0;
      i < localStorage.length;
      i++
    ) {

      const key =
        localStorage.key(i);

      if (
        key &&
        key.startsWith(
          `${this.prefix}_`
        )
      ) {

        const cleanKey =
          key.replace(
            `${this.prefix}_`,
            ""
          );

        data[cleanKey] =
          this.get(cleanKey);

      }
    }

    return data;

  },


  // -------------------------------------------------------
  // IMPORT
  // -------------------------------------------------------

  importData(data) {

    if (
      !data ||
      typeof data !== "object"
    ) {
      return false;
    }

    Object.entries(data).forEach(
      ([name, value]) => {

        this.save(
          name,
          value
        );

      }
    );

    return true;

  }

};


console.log(
  "ANALSYTICI Storage loaded"
);
