const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => value.length === 4,
        message: "Each question must have exactly 4 options",
      },
    },
    correctOption: { type: Number, required: true, min: 0, max: 3 },
    explanation: { type: String, default: "" },
    topic: { type: String, default: "" },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    sourceType: {
      type: String,
      enum: ["topic", "syllabus"],
      default: "topic",
    },
    sourceText: { type: String, default: "" },
    questionCount: { type: Number, required: true, min: 1, max: 100 },
    durationMinutes: { type: Number, required: true, min: 1, max: 300 },
    marksPerQuestion: { type: Number, default: 4, min: 1 },
    negativeMarks: { type: Number, default: 0, min: 0 },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Mixed"],
      default: "Mixed",
    },
    questions: { type: [questionSchema], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
