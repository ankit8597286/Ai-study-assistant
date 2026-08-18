const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  generateQuiz,
  getQuiz,
  startQuiz,
  submitQuiz,
  getResult,
  getQuizHistory,
} = require("../controllers/quizController");

const router = express.Router();

router.use(authMiddleware);

router.post("/generate", generateQuiz);
router.get("/history", getQuizHistory);
router.get("/:id", getQuiz);
router.post("/:id/start", startQuiz);
router.post("/attempt/:attemptId/submit", submitQuiz);
router.get("/attempt/:attemptId/result", getResult);

module.exports = router;
