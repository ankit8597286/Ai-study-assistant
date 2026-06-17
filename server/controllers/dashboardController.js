const Pdf = require("../models/Pdf");
const Planner = require("../models/Planner");
const Flashcard = require("../models/Flashcard");

const getDashboardStats = async (
  req,
  res
) => {
  try {

    const totalPDFs =
      await Pdf.countDocuments({
        userId: req.user.id
      });

    const totalPlans =
      await Planner.countDocuments({
        userId: req.user.id
      });

    const totalFlashcards =
      await Flashcard.countDocuments({
        userId: req.user.id
      });

    const recentPDFs =
      await Pdf.find({
        userId: req.user.id
      })
        .sort({
          createdAt: -1,
        })
        .limit(5);

    const recentPlans =
      await Planner.find({
        userId: req.user.id
      })
        .sort({
          createdAt: -1,
        })
        .limit(5);

    res.status(200).json({
      success: true,

      stats: {
        totalPDFs,
        totalPlans,
        totalFlashcards,
      },

      recentPDFs,
      recentPlans,
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
  getDashboardStats,
};