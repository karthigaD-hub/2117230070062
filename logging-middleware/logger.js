const axios = require("axios");

/**
 * Logging Middleware Function
 * @param {string} stack - "backend" or "frontend"
 * @param {string} level - "debug" | "info" | "warn" | "error" | "fatal"
 * @param {string} pkg - module/package name (e.g., "api", "ui", "service")
 * @param {string} message - log message
 * @param {string} token - auth token (Bearer)
 */

async function sendLog(stack, level, pkg, message, token) {
  try {
  
    if (!token || !stack || !level || !pkg || !message) {
      return;
    }

    await axios.post(
      "http://20.207.122.201/evaluation-service/logs",
      {
        stack: stack,
        level: level,
        package: pkg,
        message: message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    // ⚠️ Allowed only for fallback debugging (not main logging)
    console.error("Logging failed:", error?.response?.data || error.message);
  }
}

module.exports = sendLog;