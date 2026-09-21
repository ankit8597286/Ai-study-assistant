import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "AI Study Assistant",
  description: "AI-powered learning workspace for summaries, flashcards, planning and tests.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          gutter={10}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#0e1326",
              color: "#f5f7ff",
              border: "1px solid rgba(255,255,255,.10)",
              borderRadius: "16px",
              boxShadow: "0 20px 55px rgba(0,0,0,.28)",
              fontSize: "13px",
              fontWeight: 600,
            },
          }}
        />
      </body>
    </html>
  );
}
