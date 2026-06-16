import api from "./api";

export const getFlashcards =
  async () => {

    const res =
      await api.get(
        "/flashcards"
      );

    return res.data;
  };

export const generateFlashcards =
  async (data) => {

    const res =
      await api.post(
        "/ai/flashcards",
        data
      );

    return res.data;
  };