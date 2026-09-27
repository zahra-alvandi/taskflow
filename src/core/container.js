import { LocalStorageAdapter } from "../infrastructure/storage/LocalStorageAdapter";
import { LocalTaskRepository } from "../infrastructure/repositories/LocalTaskRepository";
import { NullAIService } from "../infrastructure/ai/NullAIService";

const storage = new LocalStorageAdapter("taskflow");

export const taskRepository = new LocalTaskRepository(storage);
export const aiService = new NullAIService();
