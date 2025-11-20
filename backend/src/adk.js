import dotenv from "dotenv";
dotenv.config();

const ADK_AGENT_URL = process.env.ADK_AGENT_URL;
const ADK_API_KEY = process.env.ADK_API_KEY;

export async function extractSubscriptions(emailText) {
  try {
    const response = await fetch(`${ADK_AGENT_URL}/run_pipeline`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": ADK_API_KEY
      },
      body: JSON.stringify({
        steps: [
          { task: "extract_subscription_details", input: emailText },
          { task: "normalize_subscription" },
          { task: "validate_and_format" }
        ]
      })
    });

    if (!response.ok) {
      console.error("ADK error:", await response.text());
      return null;
    }

    const data = await response.json();
    return data.output || null;

  } catch (err) {
    console.error("ADK request failed:", err);
    return null;
  }
}
