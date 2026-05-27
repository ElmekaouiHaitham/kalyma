"use client";

import { Download, Loader2, Share } from "lucide-react";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isAppleMobile() {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export default function AddToHomeButton({
  className = "",
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [isAppleDevice, setIsAppleDevice] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsAppleDevice(isAppleMobile());
      setIsInstalled(isStandaloneMode());
    });

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
      setShowIosHelp(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (isInstalled) return null;
  if (!installPrompt && !isAppleDevice) return null;

  const isDark = variant === "dark";

  const install = async () => {
    if (isInstalling) return;
    if (installPrompt) {
      setIsInstalling(true);
      try {
        await installPrompt.prompt();
        const choice = await installPrompt.userChoice;
        if (choice.outcome === "accepted") {
          setInstallPrompt(null);
        }
      } finally {
        setIsInstalling(false);
      }
      return;
    }

    if (isAppleDevice) {
      setShowIosHelp(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={install}
        disabled={isInstalling}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold transition-all disabled:cursor-wait disabled:opacity-75 sm:px-6 ${className}`}
        style={{
          background: isDark ? "#ffffff" : "rgba(255,255,255,0.58)",
          border: isDark ? "1px solid rgba(255,255,255,0.35)" : "2px solid #050a2f",
          color: isDark ? "#202b67" : "#050a2f",
          boxShadow: isDark ? "0 16px 30px rgba(0,0,0,0.16)" : "none",
        }}
      >
        {isInstalling ? <Loader2 size={17} className="animate-spin" /> : <Download size={17} />}
        {isInstalling ? "Preparing..." : "Add to Home"}
      </button>

      {showIosHelp && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/30 px-4 pb-5 backdrop-blur-sm sm:items-center sm:pb-0">
          <div className="w-full max-w-sm rounded-[26px] bg-white p-6 text-left shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f7f2ea] text-[#202b67]">
              <Share size={22} />
            </div>
            <h2 className="text-xl font-black text-[#050a2f]">Add Kalyma to Home Screen</h2>
            <p className="mt-2 text-sm font-medium leading-relaxed text-[#667084]">
              In Safari, tap the Share button, then choose <strong>Add to Home Screen</strong>.
            </p>
            <button
              type="button"
              onClick={() => setShowIosHelp(false)}
              className="mt-6 w-full rounded-full bg-[#202b67] py-3 text-sm font-extrabold text-white"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
