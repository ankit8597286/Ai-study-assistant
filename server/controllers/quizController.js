const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const getGroqClient = require("../utils/groqClient");

const cleanJson = (text) => {
  const cleaned = String(text || "")
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");

  if (start !== -1 && end !== -1 && end > start) {
    return cleaned.slice(start, end + 1);
  }

  return cleaned;
};

const sanitizeQuestions = (questions) =>
  questions.map((q, index) => ({
    id: q._id,
    number: index + 1,
    question: q.question,
    options: q.options,
    topic: q.topic,
    difficulty: q.difficulty,
  }));

const validateGeneratedQuestions = (questions, expectedCount) => {
  if (!Array.isArray(questions) || questions.length !== expectedCount) {
    throw new Error(`AI returned ${questions?.length || 0} questions instead of ${expectedCount}`);
  }

  return questions.map((q) => {
    if (
      !q ||
      typeof q.question !== "string" ||
      !Array.isArray(q.options) ||
      q.options.length !== 4 ||
      !Number.isInteger(q.correctOption) ||
      q.correctOption < 0 ||
      q.correctOption > 3
    ) {
      throw new Error("AI returned an invalid question format");
    }

    return {
      question: q.question.trim(),
      options: q.options.map((option) => String(option).trim()),
      correctOption: q.correctOption,
      explanation: String(q.explanation || ""),
      topic: String(q.topic || ""),
      difficulty: ["Easy", "Medium", "Hard"].includes(q.difficulty)
        ? q.difficulty
        : "Medium",
    };
  });
};

const generateQuiz = async (req, res) => {
  try {
    const {
      title,
      topic,
      syllabus,
      questionCount = 10,
      durationMinutes = 10,
      difficulty = "Mixed",
      marksPerQuestion = 1,
      negativeMarks = 0,
    } = req.body;

    const count = Number(questionCount);
    const duration = Number(durationMinutes);
    const marks = Number(marksPerQuestion);
    const negative = Number(negativeMarks);

    const sourceText = topic?.trim() || syllabus?.trim();
    const sourceType = topic?.trim() ? "topic" : "syllabus";

    if (!sourceText) {
      return res.status(400).json({ success: false, message: "Enter a topic or syllabus" });
    }

    if (!Number.isInteger(count) || count < 1 || count > 50) {
      return res.status(400).json({ success: false, message: "Question count must be between 1 and 50" });
    }

    if (!Number.isInteger(duration) || duration < 1 || duration > 300) {
      return res.status(400).json({ success: false, message: "Duration must be between 1 and 300 minutes" });
    }

    if (!Number.isFinite(marks) || marks <= 0 || !Number.isFinite(negative) || negative < 0) {
      return res.status(400).json({ success: false, message: "Invalid marking configuration" });
    }

    const groq = getGroqClient();

    const prompt = `You are an expert competitive-exam question setter.
Generate exactly ${count} high-quality multiple-choice questions from the student's ${sourceType} below.
Difficulty: ${difficulty}.
Each question must have exactly 4 distinct options and exactly one correct answer.
Avoid duplicate questions. Cover the provided syllabus broadly when it contains multiple topics.
Do not use markdown, commentary, or code fences.
Return ONLY a valid JSON array in this exact structure:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctOption": 0,
    "explanation": "Short explanation of why the answer is correct.",
    "topic": "Specific topic",
    "difficulty": "Easy"
  }
]
correctOption must be a zero-based number from 0 to 3.

${sourceType.toUpperCase()}:
${sourceText}`;

    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: getGroqClient.getModel(),
      temperature: 0.4,
    });

    const raw = response.choices?.[0]?.message?.content || "";
    const questions = validateGeneratedQuestions(JSON.parse(cleanJson(raw)), count);

    const quiz = await Quiz.create({
      userId: req.user.id,
      title: title?.trim() || `${sourceType === "topic" ? sourceText : "Syllabus"} Test`,
      sourceType,
      sourceText,
      questionCount: count,
      durationMinutes: duration,
      marksPerQuestion: marks,
      negativeMarks: negative,
      difficulty,
      questions,
    });

    res.status(201).json({
      success: true,
      quiz: {
        id: quiz._id,
        title: quiz.title,
        questionCount: quiz.questionCount,
        durationMinutes: quiz.durationMinutes,
        marksPerQuestion: quiz.marksPerQuestion,
        negativeMarks: quiz.negativeMarks,
        difficulty: quiz.difficulty,
      },
    });
  } catch (error) {
    console.error("Quiz generation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Unable to generate quiz",
    });
  }
};

const startQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, userId: req.user.id });

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    const resumeAttempt = (attempt, resumed = true) => ({
      success: true,
      resumed,
      attemptId: attempt._id,
      startedAt: attempt.startedAt,
      expiresAt: attempt.expiresAt,
      quiz: {
        id: quiz._id,
        title: quiz.title,
        marksPerQuestion: quiz.marksPerQuestion,
        negativeMarks: quiz.negativeMarks,
        questionCount: quiz.questionCount,
        durationMinutes: quiz.durationMinutes,
        questions: sanitizeQuestions(quiz.questions),
      },
      answers: attempt.answers,
    });

    // Resume an active attempt instead of creating a new one.
    let existing = await QuizAttempt.findOne({
      quizId: quiz._id,
      userId: req.user.id,
      status: "in-progress",
    }).sort({ createdAt: -1 });

    if (existing) {
      if (existing.expiresAt > new Date()) {
        return res.status(200).json(resumeAttempt(existing, true));
      }

      existing.status = "expired";
      existing.submittedAt = new Date();
      await existing.save();
      existing = null;
    }

    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + quiz.durationMinutes * 60 * 1000);

    try {
      // The partial unique index on (userId, quizId) for in-progress attempts
      // makes creation race-safe even when two requests arrive together.
      const attempt = await QuizAttempt.create({
        userId: req.user.id,
        quizId: quiz._id,
        startedAt,
        expiresAt,
        maxScore: quiz.questionCount * quiz.marksPerQuestion,
        answers: quiz.questions.map((question) => ({ questionId: question._id })),
      });

      return res.status(201).json(resumeAttempt(attempt, false));
    } catch (createError) {
      // A concurrent request may have created the active attempt first.
      if (createError?.code === 11000) {
        const concurrentAttempt = await QuizAttempt.findOne({
          quizId: quiz._id,
          userId: req.user.id,
          status: "in-progress",
        }).sort({ createdAt: -1 });

        if (concurrentAttempt) {
          return res.status(200).json(resumeAttempt(concurrentAttempt, true));
        }
      }

      throw createError;
    }
  } catch (error) {
    console.error("Start quiz error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { answers = [] } = req.body;
    const attempt = await QuizAttempt.findOne({
      _id: req.params.attemptId,
      userId: req.user.id,
    });

    if (!attempt) {
      return res.status(404).json({ success: false, message: "Attempt not found" });
    }

    if (attempt.status !== "in-progress") {
      return res.status(400).json({ success: false, message: "This test has already been submitted" });
    }

    const quiz = await Quiz.findOne({ _id: attempt.quizId, userId: req.user.id });
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    const answerMap = new Map(
      (Array.isArray(answers) ? answers : []).map((answer) => [String(answer.questionId), answer])
    );

    const now = new Date();
    const expired = now > attempt.expiresAt;
    let correct = 0;
    let wrong = 0;
    let attempted = 0;
    let markedForReview = 0;

    const finalAnswers = quiz.questions.map((question) => {
      const submitted = answerMap.get(String(question._id));
      const selectedOption = Number.isInteger(submitted?.selectedOption)
        ? submitted.selectedOption
        : null;
      const review = Boolean(submitted?.markedForReview);

      if (selectedOption !== null) {
        attempted += 1;
        if (selectedOption === question.correctOption) correct += 1;
        else wrong += 1;
      }

      if (review) markedForReview += 1;

      return {
        questionId: question._id,
        selectedOption,
        markedForReview: review,
      };
    });

    const unattempted = quiz.questions.length - attempted;
    const negativeScore = wrong * quiz.negativeMarks;
    const score = correct * quiz.marksPerQuestion - negativeScore;
    const maxScore = quiz.questions.length * quiz.marksPerQuestion;
    const percentage = maxScore ? (score / maxScore) * 100 : 0;

    attempt.answers = finalAnswers;
    attempt.attempted = attempted;
    attempt.correct = correct;
    attempt.wrong = wrong;
    attempt.unattempted = unattempted;
    attempt.markedForReview = markedForReview;
    attempt.negativeScore = negativeScore;
    attempt.score = score;
    attempt.maxScore = maxScore;
    attempt.percentage = percentage;
    attempt.submittedAt = now;
    attempt.status = expired ? "expired" : "submitted";

    await attempt.save();

    res.status(200).json({
      success: true,
      result: {
        attemptId: attempt._id,
        quizId: quiz._id,
        title: quiz.title,
        status: attempt.status,
        score,
        maxScore,
        percentage,
        attempted,
        correct,
        wrong,
        unattempted,
        markedForReview,
        negativeScore,
        marksPerQuestion: quiz.marksPerQuestion,
        negativeMarks: quiz.negativeMarks,
      },
    });
  } catch (error) {
    console.error("Submit quiz error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getResult = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findOne({
      _id: req.params.attemptId,
      userId: req.user.id,
    });

    if (!attempt) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }

    const quiz = await Quiz.findOne({ _id: attempt.quizId, userId: req.user.id });
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    const answers = new Map(attempt.answers.map((answer) => [String(answer.questionId), answer]));
    const review = quiz.questions.map((question, index) => {
      const answer = answers.get(String(question._id));
      const selectedOption = answer?.selectedOption ?? null;
      return {
        number: index + 1,
        id: question._id,
        question: question.question,
        options: question.options,
        selectedOption,
        correctOption: question.correctOption,
        explanation: question.explanation,
        isCorrect: selectedOption !== null && selectedOption === question.correctOption,
        isAttempted: selectedOption !== null,
        markedForReview: Boolean(answer?.markedForReview),
      };
    });

    res.status(200).json({
      success: true,
      result: {
        attemptId: attempt._id,
        quizId: quiz._id,
        title: quiz.title,
        status: attempt.status,
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,
        score: attempt.score,
        maxScore: attempt.maxScore,
        percentage: attempt.percentage,
        attempted: attempt.attempted,
        correct: attempt.correct,
        wrong: attempt.wrong,
        unattempted: attempt.unattempted,
        markedForReview: attempt.markedForReview,
        negativeScore: attempt.negativeScore,
        negativeMarks: quiz.negativeMarks,
        questions: review,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getQuizHistory = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user.id })
      .populate("quizId", "title questionCount durationMinutes negativeMarks difficulty")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      attempts: attempts.map((attempt) => ({
        id: attempt._id,
        title: attempt.quizId?.title || "Deleted Test",
        questionCount: attempt.quizId?.questionCount || attempt.maxScore,
        durationMinutes: attempt.quizId?.durationMinutes,
        difficulty: attempt.quizId?.difficulty,
        negativeMarks: attempt.quizId?.negativeMarks || 0,
        status: attempt.status,
        score: attempt.score,
        maxScore: attempt.maxScore,
        percentage: attempt.percentage,
        attempted: attempt.attempted,
        correct: attempt.correct,
        wrong: attempt.wrong,
        unattempted: attempt.unattempted,
        createdAt: attempt.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, userId: req.user.id });
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    res.status(200).json({
      success: true,
      quiz: {
        id: quiz._id,
        title: quiz.title,
        questionCount: quiz.questionCount,
        durationMinutes: quiz.durationMinutes,
        marksPerQuestion: quiz.marksPerQuestion,
        negativeMarks: quiz.negativeMarks,
        difficulty: quiz.difficulty,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generateQuiz,
  getQuiz,
  startQuiz,
  submitQuiz,
  getResult,
  getQuizHistory,
};
