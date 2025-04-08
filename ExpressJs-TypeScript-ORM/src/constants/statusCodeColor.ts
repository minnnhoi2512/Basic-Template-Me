import EmojiMap from "../types/Emoji.type";

export const statusColors = {
  success: "\x1b[32m", // Green
  error: "\x1b[31m", // Red
  warn: "\x1b[33m", // Yellow
  info: "\x1b[36m", // Cyan
  reset: "\x1b[0m", // Reset
};
export const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

export const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

export const emoji: EmojiMap = {
  error: "❌",
  warn: "⚠️",
  info: "ℹ️",
  http: "🌐",
  debug: "🔍",
};
