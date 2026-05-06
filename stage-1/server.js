const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// AUTH
app.post("/auth", async (req, res) => {
  const response = await axios.post(
    "http://20.207.122.201/evaluation-service/auth",
    req.body
  );
  res.json(response.data);
});

// NOTIFICATIONS
app.get("/notifications", async (req, res) => {
  const token = req.headers.authorization;

  const response = await axios.get(
    "http://20.207.122.201/evaluation-service/notifications",
    {
      headers: { Authorization: token }
    }
  );

  res.json(response.data);
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});