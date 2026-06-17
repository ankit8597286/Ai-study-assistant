const mongoose = require("mongoose");

const plannerSchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      subject: {
        type: String,
        required: true,
      },

      examDate: {
        type: Date,
        required: true,
      },

      hoursPerDay: {
        type: Number,
        required: true,
      },

      plan: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Planner",
    plannerSchema
  );