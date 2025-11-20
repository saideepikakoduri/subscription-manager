import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { getAuthUrl, getTokenFromCode, fetchEmails } from "./gmail.js";
import { extractSubscriptions } from "./adk.js";
import { saveSubscription, getAllSubscriptions, addManual } from "./firestore.js";

const app = express();
app.use(cors());
app.use(express.json());

// Gmail OAuth URL
app.get("/auth/url", (req, res) => {
  res.send({ url: getAuthUrl() });
});

// OAuth callback
app.get("/oauth/callback", async (req, res) => {
  const code = req.query.code;
  const tokens = await getTokenFromCode(code);
  res.send({ message: "Gmail connected!", tokens });
});

// Scan Gmail emails via ADK
app.post("/scan", async (req, res) => {
  const { access_token, refresh_token } = req.body;
  const emails = await fetchEmails(access_token, refresh_token);
  let subscriptions = [];
  for (const email of emails) {
    const extracted = await extractSubscriptions(email);
    await saveSubscription(extracted);
    subscriptions.push(extracted);
  }
  res.send({ message: "Scan complete", subscriptions });
});

// Add manual subscription
app.post("/manual", async (req, res) => {
  const data = req.body;
  await addManual(data);
  res.send({ message: "Manual subscription added" });
});

// Get all subscriptions
app.get("/subs", async (req, res) => {
  const subs = await getAllSubscriptions();
  res.send(subs);
});

app.listen(3000, () => console.log("Backend running on port 3000"));
