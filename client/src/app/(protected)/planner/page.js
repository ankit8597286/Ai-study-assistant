"use client";

import { useState } from "react";
import api from "@/services/api";
import {
  Calendar,
  Clock,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { generatePlanner, } from "@/services/plannerService";

export default function PlannerPage() {

  const [subject, setSubject] =
    useState("");

  const [examDate, setExamDate] =
    useState("");

  const [hoursPerDay, setHoursPerDay] =
    useState("");

  const [plan, setPlan] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const generatePlan =
    async () => {

      try {

        setLoading(true);

        const res =
          await generatePlanner({
            subject,
            examDate,
            hoursPerDay,
          });

        setPlan(
          res.planner.plan
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };
  const downloadPDF =
    async () => {

      try {

        const res =
          await api.post(
            "/planner/download-pdf",
            {
              plan,
            },
            {
              responseType:
                "blob",
            }
          );

        const url =
          window.URL.createObjectURL(
            new Blob([
              res.data,
            ])
          );

        const link =
          document.createElement(
            "a"
          );

        link.href =
          url;

        link.download =
          "study-plan.pdf";

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

      } catch (error) {

        console.log(error);

      }

    };

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* Background */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81]" />

      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 blur-[120px] rounded-full" />

      <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/20 blur-[120px] rounded-full" />

      <div className="relative z-10 p-6 md:p-10">

        <h1 className="text-5xl font-bold text-white flex items-center gap-3">

          <Sparkles className="text-cyan-400" />

          AI Study Planner

        </h1>

        <p className="text-gray-300 mt-3">
          Generate a personalized study plan using AI.
        </p>

        <div
          className="
          mt-10
          bg-white/10
          backdrop-blur-2xl
          border
          border-white/20
          rounded-3xl
          p-8
          max-w-4xl
          "
        >

          <div className="space-y-5">

            <div>

              <label className="text-white flex gap-2 mb-2">
                <BookOpen size={18} />
                Subject
              </label>

              <input
                type="text"
                value={subject}
                onChange={(e) =>
                  setSubject(
                    e.target.value
                  )
                }
                className="
                w-full
                p-4
                rounded-xl
                bg-white/10
                border
                border-white/20
                text-white
                outline-none
                "
                placeholder="Data Structure"
              />

            </div>

            <div>

              <label className="text-white flex gap-2 mb-2">
                <Calendar size={18} />
                Exam Date
              </label>

              <input
                type="date"
                value={examDate}
                onChange={(e) =>
                  setExamDate(
                    e.target.value
                  )
                }
                className="
                w-full
                p-4
                rounded-xl
                bg-white/10
                border
                border-white/20
                text-white
                outline-none
                "
              />

            </div>

            <div>

              <label className="text-white flex gap-2 mb-2">
                <Clock size={18} />
                Hours Per Day
              </label>

              <input
                type="number"
                value={hoursPerDay}
                onChange={(e) =>
                  setHoursPerDay(
                    e.target.value
                  )
                }
                className="
                w-full
                p-4
                rounded-xl
                bg-white/10
                border
                border-white/20
                text-white
                outline-none
                "
                placeholder="2"
              />

            </div>

            <button
              onClick={
                generatePlan
              }
              disabled={
                loading
              }
              className="
              w-full
              py-4
              rounded-xl
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              text-white
              font-bold
              hover:scale-[1.02]
              transition
              "
            >
              {loading
                ? "Generating..."
                : "Generate Study Plan"}
            </button>

          </div>

        </div>

        {plan && (

          <div
            className="
            mt-10
            bg-white/10
            backdrop-blur-2xl
            border
            border-white/20
            rounded-3xl
            p-8
            max-w-5xl
            "
          >

            <h2 className="text-3xl font-bold text-white mb-5">
              Your AI Study Plan
            </h2>

            <div
              className="
              text-gray-200
              leading-8
              whitespace-pre-wrap
              "
            >
              {plan}
            </div>
            <button
              onClick={
                downloadPDF
              }
              className="
  mt-6

  bg-green-600
  hover:bg-green-700

  text-white

  px-6
  py-3

  rounded-xl

  font-bold
  "
            >
              📄 Download PDF
            </button>

          </div>

        )}

      </div>

    </div>
  );
}