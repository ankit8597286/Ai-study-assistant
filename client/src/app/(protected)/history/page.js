"use client";

import { useEffect, useState } from "react";

import {
  FileText,
  Calendar,
} from "lucide-react";

import {
  getPDFHistory,
} from "@/services/pdfService";

export default function HistoryPage() {

  const [pdfs, setPdfs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchHistory =
      async () => {

        try {

          const data =
            await getPDFHistory();

          setPdfs(data);

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);

        }

      };

    fetchHistory();

  }, []);

  if (loading) {

    return (

      <div className="flex justify-center items-center min-h-[70vh]">

        <div className="text-cyan-400 text-3xl animate-pulse">

          Loading History...

        </div>

      </div>

    );

  }

  return (

    <div className="max-w-7xl mx-auto">

      <h1 className="text-5xl font-bold text-white mb-2">

        PDF History

      </h1>

      <p className="text-slate-300 mb-10">

        View all uploaded PDFs and AI summaries

      </p>

      <div className="grid gap-6">

        {pdfs.map((pdf) => (

          <div
            key={pdf._id}
            className="
            bg-gradient-to-br
            from-slate-900/90
            via-indigo-950/80
            to-slate-900/90

            border
            border-cyan-500/20

            rounded-3xl

            p-6

            backdrop-blur-xl

            hover:border-cyan-400
            hover:shadow-cyan-500/20
            hover:shadow-2xl
            hover:-translate-y-1

            transition-all
            duration-300
            "
          >

            <div className="flex flex-col lg:flex-row justify-between gap-4">

              <div className="flex items-center gap-4">

                <div
                  className="
                  w-16
                  h-16
                  rounded-2xl

                  bg-gradient-to-r
                  from-cyan-500
                  to-purple-600

                  flex
                  items-center
                  justify-center
                  "
                >

                  <FileText
                    size={30}
                    className="text-white"
                  />

                </div>

                <div>

                  <h2 className="text-2xl font-bold text-white">

                    📄 {pdf.fileName}

                  </h2>

                  <div className="flex items-center gap-2 mt-2 text-slate-300">

                    <Calendar size={16} />

                    {new Date(
                      pdf.createdAt
                    ).toLocaleString()}

                  </div>

                </div>

              </div>

              <div
                className="
                px-5
                py-2

                rounded-full

                bg-gradient-to-r
                from-cyan-500/20
                to-purple-500/20

                border
                border-cyan-400/20

                text-cyan-200

                h-fit
                "
              >
                AI Summary Generated
              </div>

            </div>

            <div
              className="
              mt-6

              bg-slate-800/70

              rounded-2xl

              p-5
              "
            >

              <h3 className="text-cyan-300 text-xl font-bold mb-4">

                Summary Preview

              </h3>

              <p className="text-white/90 text-lg leading-8">

                {pdf.summary?.slice(
                  0,
                  500
                )}

                ...

              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}