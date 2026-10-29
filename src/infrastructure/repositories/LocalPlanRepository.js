import { PlanRepository } from "../../core/ports/PlanRepository";
import { createDailyPlan } from "../../core/domain/DailyPlan";

import { loadCollection } from "./loadCollection";

const STORAGE_KEY = "plans";

export class LocalPlanRepository extends PlanRepository {
  constructor(storage) {
    super();
    this.storage = storage;
    this._cache = null;
  }

  async _load() {
    if (this._cache) return this._cache;
    this._cache = await loadCollection(
      this.storage,
      STORAGE_KEY,
      createDailyPlan,
    );
    return this._cache;
  }

  async _persist(plans) {
    await this.storage.set(STORAGE_KEY, plans); // throws StorageError on failure
    this._cache = plans;
  }

  async getAll() {
    return await this._load();
  }

  async getByDate(date) {
    const plans = await this._load();
    return plans.find((p) => p.date === date) ?? null;
  }

  async save(plan) {
    const plans = await this._load();
    const idx = plans.findIndex((p) => p.id === plan.id);
    if (idx >= 0) {
      const next = [...plans];
      next[idx] = plan;
      await this._persist(next);
    } else {
      const sameDate = plans.findIndex((p) => p.date === plan.date);
      if (sameDate >= 0) {
        const next = [...plans];
        next[sameDate] = plan;
        await this._persist(next);
      } else {
        await this._persist([...plans, plan]);
      }
    }
    return plan;
  }

  async delete(id) {
    const plans = await this._load();
    await this._persist(plans.filter((p) => p.id !== id));
  }

  async deleteByDate(date) {
    const plans = await this._load();
    await this._persist(plans.filter((p) => p.date !== date));
  }
}
