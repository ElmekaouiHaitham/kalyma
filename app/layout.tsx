import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "kalyma.ma — Speak English with Confidence",
  description:
    "Master English with AI-powered articles, live sessions, and conversational practice. kalyma.ma adapts to your level and interests.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "kalyma.ma",
    description:
      "Learn English through real-world content and AI conversation",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning style={{ colorScheme: "light" }}>
      <head>
        <meta name="color-scheme" content="light" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className="antialiased"
        style={{
          background: "#f0f4ff",
          color: "#1a2b5e",
          fontFamily: "'Inter', sans-serif",
          colorScheme: "light",
        }}
      >
        {children}
      </body>
    </html>
  );
}
