"use client";

import { useState } from "react";
import api from "@/services/api";
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { Download, } from "lucide-react";
import { downloadSummaryPDF, } from "@/utils/downloadPDF";

export default function UploadPage() {
  const [file, setFile] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const [summary, setSummary] =
    useState("");

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "pdf",
        file
      );

      const res =
        await api.post(
          "/pdf/upload",
          formData
        );

      setSummary(
        res.data.pdf.summary
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Upload Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* Background */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81]" />

      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 blur-[120px] rounded-full" />

      <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/20 blur-[120px] rounded-full" />

      <div className="relative z-10 p-6 md:p-10">

        {/* Heading */}

        <div className="mb-10">

          <h1 className="text-5xl font-bold text-white flex items-center gap-3">

            <Sparkles className="text-cyan-400" />

            AI PDF Analyzer

          </h1>

          <p className="text-gray-300 mt-3 text-lg">
            Upload your study material and get AI-powered summaries instantly.
          </p>

        </div>

        {/* Upload Card */}

        <div
          className="
          max-w-4xl
          mx-auto
          bg-white/10
          backdrop-blur-2xl
          border
          border-white/20
          rounded-3xl
          p-10
          shadow-2xl
          "
        >

          <div
            className="
            border-2
            border-dashed
            border-cyan-400/50
            rounded-3xl
            p-12
            text-center
            hover:border-cyan-400
            transition-all
            duration-300
            "
          >

            <Upload
              size={60}
              className="
              mx-auto
              text-cyan-400
              animate-bounce
              "
            />

            <h2 className="text-white text-2xl font-bold mt-4">
              Upload Your PDF
            </h2>

            <p className="text-gray-300 mt-2">
              Drag & Drop or Select PDF File
            </p>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setFile(
                  e.target.files[0]
                )
              }
              className="
              mt-6
              block
              w-full
              text-sm
              text-gray-300
              file:mr-4
              file:py-3
              file:px-6
              file:rounded-xl
              file:border-0
              file:bg-cyan-500
              file:text-white
              file:cursor-pointer
              hover:file:bg-cyan-600
              "
            />

            {file && (
              <div
                className="
                mt-6
                flex
                items-center
                justify-center
                gap-3
                text-green-400
                "
              >
                <FileText size={20} />

                <span>
                  {file.name}
                </span>
              </div>
            )}

            <button
              onClick={
                handleUpload
              }
              disabled={
                loading
              }
              className="
              mt-8
              px-8
              py-4
              rounded-2xl
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              text-white
              font-semibold
              hover:scale-105
              transition-all
              duration-300
              shadow-lg
              disabled:opacity-50
              "
            >
              {loading
                ? "Generating Summary..."
                : "Upload & Analyze"}
            </button>

          </div>

        </div>

        {/* Loading */}

        {loading && (

          <div
            className="
            mt-8
            max-w-4xl
            mx-auto
            bg-white/10
            backdrop-blur-xl
            border
            border-white/20
            rounded-3xl
            p-6
            text-center
            "
          >

            <div
              className="
              h-3
              rounded-full
              bg-white/10
              overflow-hidden
              "
            >

              <div
                className="
                h-full
                w-full
                animate-pulse
                bg-gradient-to-r
                from-cyan-500
                to-purple-500
                "
              />

            </div>

            <p className="text-white mt-4">
              AI is reading your PDF...
            </p>

          </div>

        )}

        {/* Summary */}

        {summary && (

          <div
            className="
    mt-8
    bg-white/10
    backdrop-blur-xl
    p-8
    rounded-2xl
    border
    border-white/10
    "
          >

            <h2 className="text-2xl font-bold mb-4 text-white">
              AI Summary
            </h2>

            <p className="leading-8 text-gray-200">
              {summary}
            </p>

            {/* Download Button */}

            <button
              onClick={() =>
                downloadSummaryPDF(
                  file?.name || "summary",
                  summary
                )
              }
              className="
      mt-6

      flex
      items-center
      gap-2

      bg-green-600
      hover:bg-green-700

      text-white

      px-6
      py-3

      rounded-xl

      transition-all
      duration-300
      "
            >

              <Download size={18} />

              Download Summary PDF

            </button>

          </div>

        )}

      </div>

    </div>
  );
}