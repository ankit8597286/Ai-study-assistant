export const downloadSummaryPDF = async (fileName, summary) => {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("AI Generated Summary", 20, 20);
  doc.setFontSize(12);

  const lines = doc.splitTextToSize(String(summary || ""), 170);
  doc.text(lines, 20, 40);
  doc.save(`${fileName || "summary"}-summary.pdf`);
};
