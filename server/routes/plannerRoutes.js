const express =
  require("express");

const router =
  express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  generatePlan,
  getPlans,
  downloadPlannerPDF,
  deletePlan,
} = require(
  "../controllers/plannerController"
);

router.post(
  "/generate",
  authMiddleware,
  generatePlan
);

router.get(
  "/history",
  authMiddleware,
  getPlans
);

router.delete(
  "/:id",
  authMiddleware,
  deletePlan
);

router.post(
  "/download-pdf",
  authMiddleware,
  downloadPlannerPDF
);

module.exports =
  router;