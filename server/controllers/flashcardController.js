const Flashcard =
  require("../models/Flashcard");

const getFlashcards =
  async (req, res) => {

    try {

      const flashcards =
        await Flashcard.find()
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        flashcards,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };

module.exports = {
  getFlashcards,
};