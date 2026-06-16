const express =
  require("express");

const router =
  express.Router();

const {
  generatePlan,
  getPlans,
} = require(
  "../controllers/plannerController"
);

const {
  generatePlanner,
  downloadPlannerPDF,
} = require(
  "../controllers/plannerController"
);

router.post(
  "/generate",
  generatePlan
);

router.get(
  "/history",
  getPlans
);

router.post(
  "/download-pdf",
  downloadPlannerPDF
);

module.exports =
  router;