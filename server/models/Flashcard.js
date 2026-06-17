const mongoose =
  require("mongoose");

const flashcardSchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

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