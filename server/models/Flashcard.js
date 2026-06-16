const mongoose =
  require("mongoose");

const flashcardSchema =
  new mongoose.Schema(
    {
      fileName: String,

      flashcards: [
        {
          question: String,
          answer: String,
        },
      ],
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Flashcard",
    flashcardSchema
  );