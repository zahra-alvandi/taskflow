// src/infrastructure/repositories/LocalTaskRepository.js
import { TaskRepository } from "../../core/ports/TaskRepository";
import { createTask } from "../../core/domain/Task";

const STORAGE_KEY = "tasks";

export class LocalTaskRepository extends TaskRepository {
  constructor(storage) {
    super();
    this.storage = storage;
    this._cache = null;
  }

  async _load() {
    if (this._cache) return this._cache;
    const raw = await this.storage.get(STORAGE_KEY, []);
    this._cache = raw.map((t) => createTask(t));
    return this._cache;
  }

  async _persist(tasks) {
    this._cache = tasks;
    await this.storage.set(STORAGE_KEY, tasks);
  }

  async getAll() {
    return await this._load();
  }

  async getById(id) {
    const tasks = await this._load();
    return tasks.find((t) => t.id === id) ?? null;
  }

  async save(task) {
    const tasks = await this._load();
    const idx = tasks.findIndex((t) => t.id === task.id);

    if (idx >= 0) {
      const next = [...tasks];
      next[idx] = task;
      await this._persist(next);
    } else {
      await this._persist([...tasks, task]);
    }

    return task;
  }

  async delete(id) {
    const tasks = await this._load();
    await this._persist(tasks.filter((t) => t.id !== id));
  }

  async deleteAll() {
    await this._persist([]);
  }
}
