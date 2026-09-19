const Groq = require("groq-sdk");

let groqClient = null;

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY environment variable is required");
  }

  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  return groqClient;
};

// Groq retired llama-3.3-70b-versatile for developer/free usage.
// Prefer GPT-OSS 120B, while still allowing an explicit supported model
// through GROQ_MODEL.
const getGroqModel = () => {
  const configured = String(process.env.GROQ_MODEL || "").trim();

  if (!configured || configured === "llama-3.3-70b-versatile") {
    return "openai/gpt-oss-120b";
  }

  return configured;
};

getGroqClient.getModel = getGroqModel;

module.exports = getGroqClient;
