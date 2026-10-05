import { v4 as uuid } from "uuid";

export function createUser({
  id = uuid(),
  email,
  createdAt = new Date().toISOString(),
}) {
  if (!email || typeof email !== "string") {
    throw new Error("Email is required");
  }

  const trimmed = email.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    throw new Error("Invalid email format");
  }

  return Object.freeze({
    id,
    email: trimmed,
    createdAt,
  });
}
