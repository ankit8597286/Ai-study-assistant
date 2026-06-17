const fs = require("fs");
const pdf = require("pdf-parse");

const Pdf = require("../models/Pdf");

const Groq = require("groq-sdk");

const groq = new Groq({
 apiKey: process.env.GROQ_API_KEY
});

const uploadPDF = async (
  req,
  res
) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "PDF file required",
      });
    }

    const dataBuffer =
      fs.readFileSync(
        req.file.path
      );

    const pdfData =
      await pdf(dataBuffer);

    const response =
  await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `
Summarize the following study material in simple student-friendly language:

${pdfData.text}
        `,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });

const summary =
  response.choices[0].message.content;

    const savedPDF =
      await Pdf.create({
        userId: req.user.id,
        fileName:
          req.file.originalname,

        pages:
          pdfData.numpages,

        text:
          pdfData.text,

        summary,
      });

    if (
      fs.existsSync(
        req.file.path
      )
    ) {
      fs.unlinkSync(
        req.file.path
      );
    }

    return res.status(200).json({
      success: true,
      pdf: savedPDF,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }
};


const getHistory = async (
  req,
  res
) => {
  try {

    const pdfs =
      await Pdf.find({
        userId: req.user.id
      })
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      pdfs,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }
};

const deletePDF = async (
  req,
  res
) => {
  try {

    const pdf =
      await Pdf.findOne({
        _id: req.params.id,
        userId: req.user.id
      });

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message:
          "PDF not found",
      });
    }

    await Pdf.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message:
        "PDF deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }
};

const getPDFs = async (
  req,
  res
) => {
  try {

    const pdfs =
      await Pdf.find({
        userId: req.user.id
      })
        .select(
          "fileName text"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      pdfs,
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
  uploadPDF,
  getHistory,
  deletePDF,
  getPDFs,
};





