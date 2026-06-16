import api from "./api";

export const getPDFHistory =
  async () => {
    const res =
      await api.get(
        "/pdf/history"
      );

    return res.data.pdfs;
  };

export const deletePDF =
  async (id) => {

    const res =
      await api.delete(
        `/pdf/${id}`
      );

    return res.data;
  };

export const getPDFs =
  async () => {

    const res =
      await api.get(
        "/pdf/all"
      );

    return res.data;
  };