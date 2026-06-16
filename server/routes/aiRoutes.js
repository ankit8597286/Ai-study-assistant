const express = require("express");

const router = express.Router();

const {
  generateSummary,
  generateFlashcards,
} = require(
  "../controllers/aiController"
);
router.post("/summary", generateSummary);
router.post("/flashcards", generateFlashcards);
module.exports = router;