import dotenv from "dotenv";
dotenv.config();

const ADK_AGENT_URL = process.env.ADK_AGENT_URL || "http://localhost:8000";

export async function extractSubscriptions(emailText) {
  const pipeline = {
    steps: [
      { task: "extract_subscription_details", input: emailText },
      { task: "validate_and_format" }
    ]
  };

  const response = await fetch(`${ADK_AGENT_URL}/run_pipeline`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.ADK_API_KEY,
    },
    body: JSON.stringify({ pipeline }),
  });

  if (!response.ok) {
    throw new Error(`ADK Agent request failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result.output;
}
