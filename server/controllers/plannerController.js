const Planner =
  require("../models/Planner");

const Groq = require("groq-sdk");

const groq = new Groq({
 apiKey: process.env.GROQ_API_KEY
});
const PDFDocument = require("pdfkit");

const generatePlan =
  async (req, res) => {
    try {

      const {
        subject,
        examDate,
        hoursPerDay,
      } = req.body;

      if (
        !subject ||
        !examDate ||
        !hoursPerDay
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "All fields required",
          });
      }

      const response =
  await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `
Create a day-wise study plan.

Subject: ${subject}
Exam Date: ${examDate}
Study Hours Per Day: ${hoursPerDay}

Generate:
- Day wise plan
- Topics
- Revision schedule
- Final revision day

Keep it simple and student friendly.
        `,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });

const plan =
  response.choices[0].message.content;

      const savedPlan =
        await Planner.create({
          subject,
          examDate,
          hoursPerDay,
          plan,
        });

      res.status(200).json({
        success: true,
        planner:
          savedPlan,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

const getPlans =
  async (req, res) => {
    try {

      const plans =
        await Planner.find()
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        plans,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

  const downloadPlannerPDF =
  async (req, res) => {

    try {

      const { plan } =
        req.body;

      const doc =
        new PDFDocument();

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=study-plan.pdf"
      );

      doc.pipe(res);

      doc
        .fontSize(24)
        .text(
          "AI Study Plan",
          {
            align:
              "center",
          }
        );

      doc.moveDown();

      doc
        .fontSize(12)
        .text(plan);

      doc.end();

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };

module.exports = {
  generatePlan,
  getPlans,
  downloadPlannerPDF,
};