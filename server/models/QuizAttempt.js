const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    selectedOption: { type: Number, default: null, min: 0, max: 3 },
    markedForReview: { type: Boolean, default: false },
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },
    startedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    submittedAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ["in-progress", "submitted", "expired"],
      default: "in-progress",
    },
    answers: { type: [answerSchema], default: [] },
    attempted: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    wrong: { type: Number, default: 0 },
    unattempted: { type: Number, default: 0 },
    markedForReview: { type: Number, default: 0 },
    negativeScore: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Prevent multiple simultaneous attempts for the same user and quiz.
// This protects against duplicate API calls (for example React Strict Mode
// invoking an effect twice during development).
quizAttemptSchema.index(
  { userId: 1, quizId: 1 },
  { unique: true, partialFilterExpression: { status: "in-progress" } }
);

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
