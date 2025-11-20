import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/gmail.readonly"]
  });
}

export async function getTokenFromCode(code) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export async function fetchEmails(access_token, refresh_token) {
  oauth2Client.setCredentials({ access_token, refresh_token });
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  const res = await gmail.users.messages.list({
    userId: "me",
    q: "receipt OR invoice OR subscription OR renewal",
    maxResults: 10
  });

  if (!res.data.messages) return [];
  let emailTexts = [];

  for (const m of res.data.messages) {
    const full = await gmail.users.messages.get({
      userId: "me",
      id: m.id,
      format: "full"
    });
    const body =
      full.data.payload.parts?.[0]?.body?.data ||
      full.data.payload.body?.data;
    if (!body) continue;
    const decoded = Buffer.from(body, "base64").toString("utf-8");
    emailTexts.push(decoded);
  }
  return emailTexts;
}
