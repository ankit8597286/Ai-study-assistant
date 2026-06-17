const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const upload = require(
  "../middleware/uploadMiddleware"
);

const {
  uploadPDF,
  getHistory,
  deletePDF,
  getPDFs,
} = require(
  "../controllers/pdfController"
);

router.post(
  "/upload",
  authMiddleware,
  upload.single("pdf"),
  uploadPDF
);

router.get(
  "/history",
  authMiddleware,
  getHistory
);

router.delete(
  "/:id",
  authMiddleware,
  deletePDF
);

router.get(
  "/all",
  authMiddleware,
  getPDFs
);

module.exports = router;