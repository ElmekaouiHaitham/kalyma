"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AuthPage() {
  const router = useRouter();

  const features = [
    "Personalized Learning Path",
    "AI-Powered Conversations",
    "Progress Analytics",
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 bg-[#f0f4ff]"
    >
      {/* Decorative background elements (same as landing for consistency) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#1a2b5e]/10 to-[#c9a84c]/5 blur-3xl animate-blob" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#c9a84c]/10 to-[#1a2b5e]/5 blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Image
              src="/logo.png"
              alt="kalyma.ma"
              width={64}
              height={64}
              className="object-contain drop-shadow-2xl"
            />
            <div className="text-left">
              <div
                className="text-2xl font-bold leading-tight font-outfit text-[#1a2b5e]"
              >
                kalyma.ma
              </div>
              <div className="text-xs font-bold text-[#9aa5b1] uppercase tracking-widest">
                Speak with confidence
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] border border-white shadow-2xl shadow-[#1a2b5e]/10"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#1a2b5e] font-outfit mb-3">
              Welcome to the Future
            </h1>
            <p className="text-[#4a5568]">
              Join thousands of learners mastering English.
            </p>
          </div>

          <div className="space-y-4 mb-10">
            <button
              onClick={() => router.push("/onboarding")}
              className="group w-full py-4 rounded-2xl bg-[#1a2b5e] text-white font-bold text-lg shadow-xl shadow-[#1a2b5e]/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Sign Up Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push("/home")}
              className="w-full py-4 rounded-2xl border-2 border-[#1a2b5e] text-[#1a2b5e] font-bold text-lg transition-all hover:bg-[#1a2b5e]/5"
            >
              Log In
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-[#1a2b5e]/10" />
            <span className="text-xs font-bold text-[#9aa5b1] uppercase tracking-widest">Included with access</span>
            <div className="flex-1 h-px bg-[#1a2b5e]/10" />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {features.map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#f0f4ff]/50 border border-[#1a2b5e]/5"
              >
                <div className="w-6 h-6 rounded-full bg-[#1a2b5e] flex items-center justify-center text-white shrink-0">
                  <Check size={12} strokeWidth={4} />
                </div>
                <span className="text-sm font-semibold text-[#4a5568]">
                  {f}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-xs text-[#9aa5b1] font-medium"
        >
          By joining, you agree to our{" "}
          <span className="underline cursor-pointer text-[#1a2b5e]">Terms</span>{" "}
          &{" "}
          <span className="underline cursor-pointer text-[#1a2b5e]">Privacy Policy</span>
        </motion.p>
      </div>
    </div>
  );
}
