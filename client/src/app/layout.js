import "./globals.css";

export const metadata = {
  title: "AI Study Assistant",
  description: "AI Powered Learning Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}