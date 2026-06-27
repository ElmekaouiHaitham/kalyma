import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "./providers";
import PWARegister from "./PWARegister";
import { Analytics } from "@vercel/analytics/next";

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
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '27707984645462700');
fbq('track', 'PageView');`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=27707984645462700&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <AuthProvider>
          <PWARegister />
          {children}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
