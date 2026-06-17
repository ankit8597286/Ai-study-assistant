const Flashcard =
  require("../models/Flashcard");

const getFlashcards =
  async (req, res) => {

    try {

      const flashcards =
        await Flashcard.find({
          userId: req.user.id
        })
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

const createFlashcards =
  async (req, res) => {

    try {

      const { fileName, flashcards } = req.body;

      if (!fileName || !flashcards) {
        return res.status(400).json({
          success: false,
          message: "File name and flashcards are required",
        });
      }

      const newFlashcard =
        await Flashcard.create({
          userId: req.user.id,
          fileName,
          flashcards,
        });

      res.status(201).json({
        success: true,
        flashcard: newFlashcard,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };

const deleteFlashcard =
  async (req, res) => {

    try {

      const flashcard =
        await Flashcard.findOne({
          _id: req.params.id,
          userId: req.user.id,
        });

      if (!flashcard) {
        return res.status(404).json({
          success: false,
          message: "Flashcard not found",
        });
      }

      await Flashcard.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Flashcard deleted successfully",
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
  createFlashcards,
  deleteFlashcard,
};