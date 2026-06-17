const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
const Flashcard =
  require("../models/Flashcard");

const generateSummary = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text required",
      });
    }

    const response =
      await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Summarize the following study material in simple student-friendly language:

${text}`,
          },
        ],
        model: "llama-3.3-70b-versatile",
      });

    const summary =
      response.choices[0].message.content;

    res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const generateFlashcards =
  async (req, res) => {
    try {

      const {
        text,
        fileName,
      } = req.body;

      if (!text) {
        return res.status(400).json({
          success: false,
          message:
            "Text required",
        });
      }

      const response =
        await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `
Generate exactly 10 flashcards from the following study material.

Return ONLY valid JSON.

Format:

[
 {
   "question":"...",
   "answer":"..."
 }
]

${text}
`,
            },
          ],
          model: "llama-3.3-70b-versatile",
        });

      let flashcardsText =
        response.choices[0].message.content;

      flashcardsText =
        flashcardsText
          .replace(
            /```json/g,
            ""
          )
          .replace(
            /```/g,
            ""
          );

      const flashcards =
        JSON.parse(
          flashcardsText
        );

      const saved =
        await Flashcard.create({
          userId: req.user.id,
          fileName,
          flashcards,
        });

      res.status(200).json({
        success: true,
        flashcards:
          saved,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

module.exports = {
  generateSummary,
  generateFlashcards,
};
