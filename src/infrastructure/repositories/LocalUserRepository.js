import { UserRepository } from "../../core/ports/UserRepository";
import { createUser } from "../../core/domain/User";

const STORAGE_KEY = "user";

export class LocalUserRepository extends UserRepository {
  constructor(storage) {
    super();
    this.storage = storage;
  }

  async get() {
    const raw = await this.storage.get(STORAGE_KEY, null);
    if (!raw) return null;
    try {
      return createUser(raw);
    } catch {
      return null;
    }
  }

  async save(user) {
    await this.storage.set(STORAGE_KEY, user);
    return user;
  }

  async clear() {
    await this.storage.remove(STORAGE_KEY);
  }
}
