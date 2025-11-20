import { ADKClient } from "@google/accelerated-data-kit";
import dotenv from "dotenv";
dotenv.config();

const adk = new ADKClient({ apiKey: process.env.ADK_API_KEY });

export async function extractSubscriptions(emailText) {
  const pipeline = {
    steps: [
      { task: "extract_subscription_details", input: emailText },
      { task: "validate_and_format" }
    ]
  };

  const result = await adk.runPipeline(pipeline);
  return result.output;
}
