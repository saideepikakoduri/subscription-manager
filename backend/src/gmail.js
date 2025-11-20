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
    scope: ["https://www.googleapis.com/auth/gmail.readonly"],
    prompt: "consent"
  });
}

export async function getTokenFromCode(code) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

function decodeBase64Url(str) {
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}

export async function fetchEmails(access_token, refresh_token) {
  oauth2Client.setCredentials({ access_token, refresh_token });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const list = await gmail.users.messages.list({
    userId: "me",
    q: "receipt OR invoice OR subscription OR renewal",
    maxResults: 10
  });

  if (!list.data.messages) return [];

  let bodies = [];

  for (const m of list.data.messages) {
    const msg = await gmail.users.messages.get({
      userId: "me",
      id: m.id,
      format: "full"
    });

    const parts = msg.data.payload.parts || [];
    const data =
      parts[0]?.body?.data ||
      msg.data.payload?.body?.data;

    if (data) bodies.push(decodeBase64Url(data));
  }

  return bodies;
}
