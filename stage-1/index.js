const axios = require("axios");


const USER_DATA = {
  email: "karthiga.d.2023.aids@ritchennai.edu.in",
  name: "karthiga d",
  rollNo: "2117230070062",
  accessCode: "BTCDqT",
  clientID: "efac511e-f743-4c4e-b660-7b2c815ef8b9",
  clientSecret: "VFgBcYqxTfDEUMvd"
};


const priorityOrder = {
  placement: 1,
  event: 2,
  result: 3
};

// 🪵 LOGGING FUNCTION (STRICT FORMAT)
async function sendLog(level, pkg, message, token) {
  try {
    if (!token) return;

    await axios.post(
      "http://20.207.122.201/evaluation-service/logs",
      {
        stack: "backend",                 // ✅ lowercase ONLY
        level: level.toLowerCase(),       // ✅ lowercase
        package: pkg.toLowerCase(),       // ✅ lowercase
        message
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    console.log("⚠️ Logging failed"); // allowed fallback
  }
}

// 🔐 GENERATE TOKEN
async function generateToken() {
  try {
    const res = await axios.post(
      "http://20.207.122.201/evaluation-service/auth",
      USER_DATA
    );

    return res.data.access_token || res.data.accessToken;
  } catch (err) {
    console.error("❌ Auth failed:", err?.response?.data || err.message);
    process.exit();
  }
}

// 📡 FETCH NOTIFICATIONS
async function fetchNotifications(token) {
  try {
    await sendLog("info", "api", "fetching notifications", token);

    const res = await axios.get(
      "http://20.207.122.201/evaluation-service/notifications",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    await sendLog("info", "api", "notifications fetched", token);

    return res.data.notifications;
  } catch (err) {
    await sendLog("error", "api", "fetch failed", token);
    console.error("❌ Fetch error:", err?.response?.data || err.message);
    process.exit();
  }
}

// 🧠 SORT + TOP 10
function getTopNotifications(data, n = 10) {
  return data
    .sort((a, b) => {
      const typeA = a.Type.toLowerCase();
      const typeB = b.Type.toLowerCase();

      if (priorityOrder[typeA] !== priorityOrder[typeB]) {
        return priorityOrder[typeA] - priorityOrder[typeB];
      }

      return new Date(b.Timestamp) - new Date(a.Timestamp);
    })
    .slice(0, n);
}

// 🚀 MAIN
async function main() {
  console.log("🚀 Stage 1 Running...\n");

  const token = await generateToken();

  await sendLog("info", "service", "token generated", token);

  const notifications = await fetchNotifications(token);

  const top10 = getTopNotifications(notifications, 10);

  await sendLog("info", "service", "top 10 computed", token);

  console.log("\n🔥 TOP 10 PRIORITY NOTIFICATIONS:\n");

  top10.forEach((item, index) => {
    console.log(
      `${index + 1}. [${item.Type}] ${item.Message} → ${item.Timestamp}`
    );
  });

  console.log("\n✅ Done");
}

main();