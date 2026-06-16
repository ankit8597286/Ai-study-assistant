"use client";

import { useEffect, useState } from "react";

import {
  FileText,
  Calendar,
  Search,
  Sparkles,
  Download,
  Eye,
  X,
  Trash2,
} from "lucide-react";
import api from "@/services/api";
import { downloadSummaryPDF, } from "@/utils/downloadPDF";
import { deletePDF, } from "@/services/pdfService";
import { useRouter } from "next/navigation";

export default function SummaryPage() {

  const [summaries, setSummaries] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [selectedSummary, setSelectedSummary] =
    useState(null);
  const router = useRouter();

  const [message, setMessage] =
    useState("");

  useEffect(() => {

    const fetchSummaries =
      async () => {

        try {

          const res =
            await api.get(
              "/pdf/history"
            );

          setSummaries(
            res.data.pdfs || []
          );

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);

        }

      };

    fetchSummaries();

  }, []);

  const filteredSummaries =
    summaries.filter(
      (item) =>
        item.fileName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const handleDelete =
    async (id) => {

      try {

        await deletePDF(id);

        setSummaries(
          summaries.filter(
            (item) =>
              item._id !== id
          )
        );

      } catch (error) {

        console.log(error);

      }

    };
  const handleGenerateFlashcards =
  async (item) => {

    try {

      setMessage(
        "⏳ Generating Flashcards..."
      );

      await api.post(
        "/ai/flashcards",
        {
          fileName:
            item.fileName,

          text:
            item.text,
        }
      );

      setMessage(
        "🧠 Flashcards Generated Successfully"
      );

      setTimeout(() => {

        router.push(
          "/flashcards"
        );

      }, 1500);

    } catch (error) {

      console.log(error);

      setMessage(
        "❌ Failed to Generate Flashcards"
      );

    }

  };

  return (

    <div className="relative min-h-screen overflow-hidden">

      {/* Background */}

      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950" />

      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-[140px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 blur-[140px] rounded-full" />

      <div className="relative z-10 p-4 md:p-8">

        {/* Header */}

        <div className="mb-10">

          <h1
            className="
            text-4xl
            md:text-6xl
            font-black
            text-white
            flex
            items-center
            gap-3
            "
          >

            <Sparkles className="text-cyan-400" />

            Summary History

          </h1>

          <p className="text-slate-400 mt-3 text-lg">

            View all AI generated summaries

          </p>

        </div>

        {/* Search */}

        <div
          className="
          mb-8
          bg-white/10
          backdrop-blur-xl
          border
          border-white/10
          rounded-2xl
          p-4
          flex
          items-center
          gap-3
          "
        >

          <Search className="text-cyan-400" />

          <input
            type="text"
            placeholder="Search PDF..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
            bg-transparent
            outline-none
            w-full
            text-white
            "
          />

        </div>

        {
          message && (

            <div
              className="
      mb-6

      bg-green-500/20

      border
      border-green-500/30

      text-green-300

      p-4

      rounded-xl
      "
            >
              {message}
            </div>

          )
        }

        {/* Loading */}

        {loading && (

          <div
            className="
            text-center
            text-cyan-400
            text-2xl
            animate-pulse
            "
          >
            Loading...
          </div>

        )}

        {/* Cards */}

        <div className="grid gap-6">

          {!loading &&
            filteredSummaries.map(
              (item) => (

                <div
                  key={item._id}
                  className="
                  bg-white/10
                  backdrop-blur-xl
                  border
                  border-white/10
                  rounded-3xl
                  p-6
                  hover:border-cyan-400/40
                  hover:shadow-cyan-500/10
                  hover:shadow-2xl
                  hover:scale-[1.01]
                  transition-all
                  duration-300
                  "
                >

                  <div
                    className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    md:justify-between
                    gap-4
                    "
                  >

                    <div className="flex items-center gap-4">

                      <div
                        className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-gradient-to-r
                        from-cyan-500
                        to-purple-600
                        flex
                        items-center
                        justify-center
                        "
                      >

                        <FileText className="text-white" />

                      </div>

                      <div>

                        <h2
                          className="
                          text-white
                          font-bold
                          text-lg
                          md:text-xl
                          "
                        >
                          {item.fileName}
                        </h2>

                        <div
                          className="
                          flex
                          items-center
                          gap-2
                          text-slate-400
                          mt-1
                          "
                        >

                          <Calendar size={16} />

                          {
                            new Date(
                              item.createdAt
                            ).toLocaleString()
                          }

                        </div>

                      </div>

                    </div>

                    <div
                      className="
                      px-4
                      py-2
                      rounded-full
                      bg-cyan-500/20
                      text-cyan-300
                      font-semibold
                      "
                    >
                      AI Summary
                    </div>

                  </div>

                  <div
                    className="
                    mt-6
                    bg-white/5
                    rounded-2xl
                    p-5
                    text-slate-300
                    leading-8
                    "
                  >

                    {
                      item.summary?.slice(
                        0,
                        300
                      )
                    }

                    ...

                    <div className="flex flex-wrap gap-3 mt-6">

                      <button
                        onClick={() =>
                          setSelectedSummary(
                            item
                          )
                        }
                        className="
                        flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        rounded-xl
                        bg-cyan-600
                        hover:bg-cyan-700
                        text-white
                        transition
                        "
                      >
                        <Eye size={18} />
                        View Full
                      </button>

                      <button
                        onClick={() =>
                          downloadSummaryPDF(
                            item.fileName,
                            item.summary
                          )
                        }
                        className="
                        flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        rounded-xl
                        bg-green-600
                        hover:bg-green-700
                        text-white
                        transition
                        "
                      >
                        <Download size={18} />
                        Download PDF
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(
                            item._id
                          )
                        }
                        className="
  flex
  items-center
  gap-2

  px-4
  py-2

  rounded-xl

  bg-red-600
  hover:bg-red-700

  text-white
  "
                      >
                        <Trash2 size={18} />
                        Delete
                      </button>

                      <button
                        onClick={() =>
                          handleGenerateFlashcards(
                            item
                          )
                        }
                        className="
  flex
  items-center
  gap-2

  px-4
  py-2

  rounded-xl

  bg-purple-600
  hover:bg-purple-700

  text-white
  "
                      >
                        🧠 Generate Flashcards
                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

        </div>

      </div>

      {/* Modal */}

      {
        selectedSummary && (

          <div
            className="
            fixed
            inset-0
            z-50
            bg-black/70
            flex
            justify-center
            items-center
            p-4
            "
          >

            <div
              className="
              w-full
              max-w-4xl
              max-h-[85vh]
              overflow-y-auto

              bg-slate-900

              border
              border-cyan-500/30

              rounded-3xl

              p-6
              "
            >

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-bold text-white">

                  {
                    selectedSummary.fileName
                  }

                </h2>

                <button
                  onClick={() =>
                    setSelectedSummary(
                      null
                    )
                  }
                >

                  <X className="text-white" />

                </button>

              </div>

              <div
                className="
                text-slate-300
                whitespace-pre-wrap
                leading-8
                "
              >

                {
                  selectedSummary.summary
                }

              </div>

            </div>

          </div>

        )
      }

    </div>

  );
}