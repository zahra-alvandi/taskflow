export const STORAGE_ERROR_EVENT = "whiskerly:storage-error";

export class StorageError extends Error {
  constructor(code, key, cause) {
    super(`Storage ${code} for "${key}"`);
    this.name = "StorageError";
    this.code = code;
    this.key = key;
    this.cause = cause;
  }
}

export function reportStorageIssue(detail) {
  try {
    if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") {
      window.dispatchEvent(new CustomEvent(STORAGE_ERROR_EVENT, { detail }));
    }
  } catch {}
}

function isQuotaError(err) {
  return (
    err?.name === "QuotaExceededError" ||
    err?.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    err?.code === 22 ||
    err?.code === 1014
  );
}

export class LocalStorageAdapter {
  constructor(namespace = "whiskerly", store = globalThis.localStorage) {
    this.namespace = namespace;
    this.store = store;
  }

  _key(key) {
    return `${this.namespace}:${key}`;
  }

  async get(key, fallback = null) {
    let raw;
    try {
      raw = this.store.getItem(this._key(key));
    } catch (err) {
      console.error(`[storage] failed to read ${key}`, err);
      reportStorageIssue({ code: "read_failed", key });
      return fallback;
    }

    if (raw === null) return fallback;

    try {
      return JSON.parse(raw);
    } catch (err) {
      console.error(`[storage] corrupted JSON in ${key}`, err);
      try {
        this.store.setItem(`${this._key(key)}.corrupt-backup`, raw);
      } catch {
        /* best effort */
      }
      reportStorageIssue({ code: "corrupted", key });
      return fallback;
    }
  }

  async set(key, value) {
    try {
      this.store.setItem(this._key(key), JSON.stringify(value));
      return true;
    } catch (err) {
      const code = isQuotaError(err) ? "quota_exceeded" : "write_failed";
      console.error(`[storage] failed to write ${key}`, err);
      reportStorageIssue({ code, key });
      throw new StorageError(code, key, err);
    }
  }

  async remove(key) {
    try {
      this.store.removeItem(this._key(key));
    } catch (err) {
      reportStorageIssue({ code: "write_failed", key });
      throw new StorageError("write_failed", key, err);
    }
  }

  async clear() {
    try {
      Object.keys(this.store)
        .filter((k) => k.startsWith(this.namespace + ":"))
        .forEach((k) => this.store.removeItem(k));
    } catch (err) {
      reportStorageIssue({ code: "write_failed", key: "*" });
      throw new StorageError("write_failed", "*", err);
    }
  }
}
