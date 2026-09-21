const fs = require("fs/promises");
const pdf = require("pdf-parse");

const Pdf = require("../models/Pdf");
const getGroqClient = require("../utils/groqClient");

const uploadPDF = async (req, res) => {
  let uploadedPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file required",
      });
    }

    uploadedPath = req.file.path;

    const dataBuffer = await fs.readFile(uploadedPath);
    const pdfData = await pdf(dataBuffer);
    const extractedText = pdfData.text?.trim();

    if (!extractedText) {
      return res.status(400).json({
        success: false,
        message: "No readable text found in the PDF",
      });
    }

    const groq = getGroqClient();

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Summarize the following study material in simple student-friendly language.

Include:
- Main concepts
- Important definitions
- Key points
- Useful examples where present

STUDY MATERIAL:

${extractedText.slice(0, 120000)}`,
        },
      ],
      model: getGroqClient.getModel(),
    });

    const summary = response.choices?.[0]?.message?.content || "";

    const savedPDF = await Pdf.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      pages: pdfData.numpages,
      text: extractedText,
      summary,
    });

    return res.status(200).json({
      success: true,
      pdf: savedPDF,
    });
  } catch (error) {
    console.error("PDF upload/summary error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to process PDF",
    });
  } finally {
    if (uploadedPath && fs.existsSync(uploadedPath)) {
      try {
        fs.unlinkSync(uploadedPath);
      } catch (cleanupError) {
        console.error("Uploaded PDF cleanup error:", cleanupError);
      }
    }
  }
};

const getHistory = async (req, res) => {
  try {
    const pdfs = await Pdf.find({ userId: req.user.id })
      .select("fileName pages text summary createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      pdfs,
    });
  } catch (error) {
    console.error("PDF history error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePDF = async (req, res) => {
  try {
    const pdfDoc = await Pdf.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!pdfDoc) {
      return res.status(404).json({
        success: false,
        message: "PDF not found",
      });
    }

    await Pdf.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "PDF deleted successfully",
    });
  } catch (error) {
    console.error("PDF delete error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPDFs = async (req, res) => {
  try {
    const pdfs = await Pdf.find({ userId: req.user.id })
      .select("fileName pages createdAt")
      .sort({
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      pdfs,
    });
  } catch (error) {
    console.error("Get PDFs error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadPDF,
  getHistory,
  deletePDF,
  getPDFs,
};
