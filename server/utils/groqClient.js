const Groq = require("groq-sdk");

let groqClient = null;

const getGroqClient = () => {
  const apiKey = String(process.env.GROQ_API_KEY || "").trim();

  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is required");
  }

  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }

  return groqClient;
};

const getGroqModel = () => {
  const configured = String(process.env.GROQ_MODEL || "").trim();

  if (!configured || configured === "llama-3.3-70b-versatile") {
    return "openai/gpt-oss-120b";
  }

  return configured;
};

getGroqClient.getModel = getGroqModel;

module.exports = getGroqClient;
