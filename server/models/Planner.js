const mongoose = require("mongoose");

const plannerSchema =
  new mongoose.Schema(
    {
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