import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { getAuthUrl, getTokenFromCode, fetchEmails } from "./gmail.js";
import { extractSubscriptions } from "./adk.js";
import { saveSubscription, addManual, getAllSubscriptions } from "./firestore.js";

const app = express();
app.use(cors());
app.use(express.json());

/* ---- HEALTH CHECK ---- */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* ---- GET OAUTH URL ---- */
app.get("/auth/url", (req, res) => {
  const url = getAuthUrl();
  res.json({ url });
});

/* ---- OAUTH CALLBACK ---- */
app.get("/oauth/callback", async (req, res) => {
  try {
    const code = req.query.code;
    const tokens = await getTokenFromCode(code);
    console.log("TOKENS:", tokens);
    res.json({ message: "Gmail connected", tokens });
  } catch (err) {
    console.error("OAuth error:", err);
    res.status(500).json({ error: "OAuth Failed" });
  }
});

/* ---- SCAN EMAILS ---- */
app.post("/scan", async (req, res) => {
  try {
    const { access_token, refresh_token } = req.body;
    const emails = await fetchEmails(access_token, refresh_token);

    let subs = [];

    for (const email of emails) {
      try {
        const extracted = await extractSubscriptions(email);
        if (extracted && extracted.service) {
          await saveSubscription(extracted);
          subs.push(extracted);
        }
      } catch (adkErr) {
        console.error("ADK extraction failed:", adkErr);
      }
    }

    res.json({ message: "Scan complete", subscriptions: subs });

  } catch (err) {
    console.error("Scan failed:", err);
    res.status(500).json({ error: "Scan failed" });
  }
});

/* ---- ADD MANUAL SUBSCRIPTION ---- */
app.post("/manual", async (req, res) => {
  try {
    await addManual(req.body);
    res.json({ message: "Manual subscription added" });
  } catch (err) {
    console.error("Manual add error:", err);
    res.status(500).json({ error: "Failed to save" });
  }
});

/* ---- GET ALL SUBSCRIPTIONS ---- */
app.get("/subs", async (req, res) => {
  try {
    const subs = await getAllSubscriptions();
    res.json(subs);
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Failed to fetch subs" });
  }
});

app.listen(3000, () => {
  console.log("Backend running at http://localhost:3000");
});
