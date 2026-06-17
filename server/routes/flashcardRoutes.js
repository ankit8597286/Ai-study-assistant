const express =
  require("express");

const router =
  express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  getFlashcards,
  createFlashcards,
  deleteFlashcard,
} = require(
  "../controllers/flashcardController"
);

router.get(
  "/",
  authMiddleware,
  getFlashcards
);

router.post(
  "/",
  authMiddleware,
  createFlashcards
);

router.delete(
  "/:id",
  authMiddleware,
  deleteFlashcard
);

module.exports =
  router;