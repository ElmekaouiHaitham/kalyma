"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AuthPage() {
  const [tab, setTab] = useState<"signup" | "login">("signup");
  const router = useRouter();

  const features = [
    "Read Books",
    "Get Scientific Articles",
    "Chat with Atlas Chat",
    "Join Live Sessions",
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-6"
      style={{ background: "linear-gradient(160deg, #eef2ff 0%, #f5f8ff 50%, #e8efff 100%)", colorScheme: "light" }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute animate-blob"
        style={{
          top: "-80px",
          left: "-60px",
          width: 280,
          height: 280,
          background: "radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute animate-blob"
        style={{
          bottom: "-60px",
          right: "-60px",
          width: 320,
          height: 320,
          background: "radial-gradient(circle, rgba(26,43,94,0.12) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(50px)",
          animationDelay: "3s",
        }}
      />
      <div
        className="absolute animate-blob"
        style={{
          top: "40%",
          left: "60%",
          width: 200,
          height: 200,
          background: "radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(30px)",
          animationDelay: "5s",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Image
              src="/logo.png"
              alt="kalyma.ma"
              width={60}
              height={60}
              className="object-contain"
              style={{ filter: "drop-shadow(0 2px 8px rgba(201,168,76,0.5))" }}
            />
            <div className="text-left">
              <div
                className="text-xl font-bold leading-tight"
                style={{ fontFamily: "'Outfit', sans-serif", color: "#1a2b5e" }}
              >
                kalyma.ma
              </div>
              <div className="text-xs" style={{ color: "#9aa5b1" }}>
                Speak with confidence
              </div>
            </div>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1
            className="text-3xl font-bold mb-2 leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif", color: "#1a2b5e" }}
          >
            Speak English with<br />Confidence
          </h1>
          <p className="text-sm" style={{ color: "#4a5568" }}>
            Join kalymana to improve your English skills.
          </p>
        </motion.div>

        {/* Auth Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="flex gap-3 mb-5"
        >
          <button
            onClick={() => router.push("/onboarding")}
            className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
            style={{
              background: "linear-gradient(135deg, #1a2b5e, #0f1d4e)",
              color: "white",
              boxShadow: "0 4px 16px rgba(26, 43, 94, 0.3)",
            }}
          >
            Sign Up
          </button>
          <button
            onClick={() => router.push("/home")}
            className="flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all"
            style={{
              background: "transparent",
              borderColor: "#1a2b5e",
              color: "#1a2b5e",
            }}
          >
            Log In
          </button>
        </motion.div>

        {/* Or divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.24 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="flex-1 h-px" style={{ background: "var(--border-medium)" }} />
          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>or</span>
          <div className="flex-1 h-px" style={{ background: "var(--border-medium)" }} />
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 mb-8"
        >
          {features.map((f, i) => (
            <motion.div
              key={f}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(26, 43, 94, 0.1)" }}
              >
                <Check size={11} style={{ color: "#1a2b5e" }} strokeWidth={2.5} />
              </div>
              <span className="text-sm font-medium" style={{ color: "#4a5568" }}>
                {f}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs"
          style={{ color: "#9aa5b1" }}
        >
          By signing up, you agree to our{" "}
          <span className="underline cursor-pointer" style={{ color: "#1a2b5e" }}>Terms</span>{" "}
          and{" "}
          <span className="underline cursor-pointer" style={{ color: "#1a2b5e" }}>Privacy Policy</span>
        </motion.p>
      </div>
    </div>
  );
}
