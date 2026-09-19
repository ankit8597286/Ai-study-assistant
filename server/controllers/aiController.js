const getGroqClient = require("../utils/groqClient");
const Flashcard = require("../models/Flashcard");

const generateSummary = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text required",
      });
    }

    const groq = getGroqClient();

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Summarize the following study material in simple student-friendly language:

${text}`,
        },
      ],
      model: getGroqClient.getModel(),
    });

    const summary = response.choices?.[0]?.message?.content || "";

    res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("Summary generation error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to generate summary",
    });
  }
};

const generateFlashcards = async (req, res) => {
  try {
    const { text, fileName } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text required",
      });
    }

    const groq = getGroqClient();

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
Generate exactly 10 flashcards from the following study material.

Return ONLY valid JSON.

Format:

[
  {
    "question": "...",
    "answer": "..."
  }
]

Do not add markdown or code fences.

${text}
`,
        },
      ],
      model: getGroqClient.getModel(),
      temperature: 0.3,
    });

    let flashcardsText =
      response.choices?.[0]?.message?.content || "";

    flashcardsText = flashcardsText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const flashcards = JSON.parse(flashcardsText);

    if (!Array.isArray(flashcards)) {
      throw new Error("AI returned an invalid flashcard format");
    }

    const saved = await Flashcard.create({
      userId: req.user.id,
      fileName,
      flashcards,
    });

    res.status(200).json({
      success: true,
      flashcards: saved,
    });
  } catch (error) {
    console.error("Flashcard generation error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to generate flashcards",
    });
  }
};

module.exports = {
  generateSummary,
  generateFlashcards,
};
