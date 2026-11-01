export const STORAGE_ERROR_EVENT = "whiskerly:storage-error";

const SCHEMA_VERSION_KEY = "schema-version";
export const CURRENT_SCHEMA_VERSION = 1;

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

/**
 * Versioned wrapper over localStorage.
 *
 * Migrations run once per namespace on first read. Each entry is
 * { from: <version>, migrate: (store) => void } and may rewrite any key
 * in this namespace. A migration that throws is logged and skipped; the
 * schema version is NOT advanced, so it will retry on next load.
 */
export class LocalStorageAdapter {
  constructor(namespace = "whiskerly", store = globalThis.localStorage) {
    this.namespace = namespace;
    this.store = store;
    this._migrated = false;
  }

  _key(key) {
    return `${this.namespace}:${key}`;
  }

  _readVersion() {
    try {
      const raw = this.store.getItem(this._key(SCHEMA_VERSION_KEY));
      const n = Number(raw);
      return Number.isFinite(n) && n > 0 ? n : 0;
    } catch {
      return 0;
    }
  }

  _writeVersion(v) {
    try {
      this.store.setItem(this._key(SCHEMA_VERSION_KEY), String(v));
    } catch {
      /* best effort */
    }
  }

  /**
   * @param {Array<{from:number, to:number, migrate:(store:LocalStorageAdapter)=>void}>} migrations
   */
  runMigrations(migrations = []) {
    if (this._migrated) return;
    this._migrated = true;

    const current = this._readVersion();
    if (current >= CURRENT_SCHEMA_VERSION) return;

    const applicable = migrations
      .filter((m) => m.from >= current && m.to <= CURRENT_SCHEMA_VERSION)
      .sort((a, b) => a.from - b.from);

    for (const m of applicable) {
      try {
        m.migrate(this);
        this._writeVersion(m.to);
      } catch (err) {
        console.error(`[storage] migration ${m.from}→${m.to} failed`, err);
        reportStorageIssue({
          code: "migration_failed",
          key: `${m.from}->${m.to}`,
        });
        return; // stop; retry on next load
      }
    }
    this._writeVersion(CURRENT_SCHEMA_VERSION);
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
