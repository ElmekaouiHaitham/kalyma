import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "./providers";
import PWARegister from "./PWARegister";

export const metadata: Metadata = {
  applicationName: "kalyma",
  title: "kalyma - Speak English with Confidence",
  description:
    "Master English with AI-powered articles, live sessions, and conversational practice. kalyma adapts to your level and interests.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kalyma",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "kalyma",
    description: "Learn English through real-world content and AI conversation",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1a2b5e",
  colorScheme: "light",
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
          background: "#f7f2ea",
          color: "#1a2b5e",
          fontFamily: "'Inter', sans-serif",
          colorScheme: "light",
        }}
      >
        <AuthProvider>
          <PWARegister />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
