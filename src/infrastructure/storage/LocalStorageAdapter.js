export class LocalStorageAdapter {
  constructor(namespace = "whiskerly") {
    this.namespace = namespace;
  }

  _key(key) {
    return `${this.namespace}:${key}`;
  }

  async get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(this._key(key));
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (err) {
      console.error(`[storage] failed to read ${key}`, err);
      return fallback;
    }
  }

  async set(key, value) {
    try {
      localStorage.setItem(this._key(key), JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`[storage] failed to write ${key}`, err);
      return false;
    }
  }

  async remove(key) {
    localStorage.removeItem(this._key(key));
  }

  async clear() {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(this.namespace + ":"))
      .forEach((k) => localStorage.removeItem(k));
  }
}
