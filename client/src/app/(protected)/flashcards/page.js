"use client";

import { useEffect, useState } from "react";

import {
  Brain,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

import {
  getFlashcards,
} from "@/services/flashcardService";

export default function FlashcardsPage() {

  const [flashcards, setFlashcards] =
    useState([]);

  const [cardIndex, setCardIndex] =
    useState(0);

  const [showAnswer, setShowAnswer] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          const res =
            await getFlashcards();

          if (
            res.flashcards &&
            res.flashcards.length > 0
          ) {

            setFlashcards(
              res.flashcards[0]
                .flashcards
            );

          }

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);

        }

      };

    fetchData();

  }, []);

  const nextCard = () => {

    if (
      cardIndex <
      flashcards.length - 1
    ) {

      setCardIndex(
        cardIndex + 1
      );

      setShowAnswer(
        false
      );

    }

  };

  const prevCard = () => {

    if (cardIndex > 0) {

      setCardIndex(
        cardIndex - 1
      );

      setShowAnswer(
        false
      );

    }

  };

  if (loading) {

    return (

      <div
        className="
        flex
        justify-center
        items-center
        h-screen
        text-white
        text-2xl
        "
      >
        Loading Flashcards...
      </div>

    );

  }

  if (
    flashcards.length === 0
  ) {

    return (

      <div
        className="
        flex
        justify-center
        items-center
        h-screen
        text-white
        text-2xl
        "
      >
        No Flashcards Found
      </div>

    );

  }

  const current =
    flashcards[cardIndex];

  return (

    <div
      className="
      min-h-screen
      p-6
      md:p-10
      "
    >

      <h1
        className="
        text-5xl
        font-bold
        text-white

        flex
        items-center
        gap-3

        mb-10
        "
      >

        <Brain
          className="
          text-cyan-400
          "
        />

        AI Flashcards

      </h1>

      <div
        className="
        max-w-3xl
        mx-auto
        "
      >

        <div
          onClick={() =>
            setShowAnswer(
              !showAnswer
            )
          }
          className="
          cursor-pointer

          bg-white/10
          backdrop-blur-xl

          border
          border-white/10

          rounded-3xl

          min-h-[320px]

          flex
          items-center
          justify-center

          text-center

          p-8

          hover:scale-[1.02]

          transition-all
          duration-300
          "
        >

          <div>

            <p
              className="
              text-cyan-400
              mb-3
              "
            >
              {
                showAnswer
                  ? "Answer"
                  : "Question"
              }
            </p>

            <h2
              className="
              text-white
              text-2xl
              md:text-3xl
              font-bold
              leading-relaxed
              "
            >
              {
                showAnswer
                  ? current.answer
                  : current.question
              }
            </h2>

          </div>

        </div>

        <div
          className="
          flex
          justify-center
          gap-4

          mt-8
          "
        >

          <button
            onClick={
              prevCard
            }
            className="
            bg-purple-600
            px-5
            py-3

            rounded-xl

            text-white

            flex
            items-center
            gap-2
            "
          >

            <ChevronLeft />

            Previous

          </button>

          <button
            onClick={() =>
              setShowAnswer(
                !showAnswer
              )
            }
            className="
            bg-cyan-500
            px-5
            py-3

            rounded-xl

            text-white

            flex
            items-center
            gap-2
            "
          >

            <RotateCcw />

            Flip

          </button>

          <button
            onClick={
              nextCard
            }
            className="
            bg-green-600
            px-5
            py-3

            rounded-xl

            text-white

            flex
            items-center
            gap-2
            "
          >

            Next

            <ChevronRight />

          </button>

        </div>

        <div
          className="
          text-center

          text-gray-400

          mt-6
          "
        >
          Card {cardIndex + 1}
          {" / "}
          {
            flashcards.length
          }
        </div>

      </div>

    </div>

  );

}