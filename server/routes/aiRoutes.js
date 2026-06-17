const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  generateSummary,
  generateFlashcards,
} = require(
  "../controllers/aiController"
);
router.post(
  "/summary",
  authMiddleware,
  generateSummary
);

router.post(
  "/flashcards",
  authMiddleware,
  generateFlashcards
);

module.exports = router;