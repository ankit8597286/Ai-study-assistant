
const express = require("express");

const router = express.Router();

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

// Upload PDF + Generate Summary

router.post(
  "/upload",
  upload.single("pdf"),
  uploadPDF
);


// Get All PDF History

router.get(
  "/history",
  getHistory
);

// Delete history

router.delete(
  "/:id",
  deletePDF
);

router.get(
  "/all",
  getPDFs
);


module.exports = router;