const Pdf = require("../models/Pdf");
const Planner = require("../models/Planner");

const getDashboardStats = async (
  req,
  res
) => {
  try {

    const totalPDFs =
      await Pdf.countDocuments();

    const totalPlans =
      await Planner.countDocuments();

    const recentPDFs =
      await Pdf.find()
        .sort({
          createdAt: -1,
        })
        .limit(5);

    const recentPlans =
      await Planner.find()
        .sort({
          createdAt: -1,
        })
        .limit(5);

    res.status(200).json({
      success: true,

      stats: {
        totalPDFs,
        totalPlans,
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