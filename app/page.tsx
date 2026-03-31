"use client";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, Globe, Shield, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-[#f0f4ff] selection:bg-[#c9a84c] selection:text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#1a2b5e]/5 to-[#c9a84c]/5 blur-3xl animate-blob" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#1a2b5e]/5 to-[#c9a84c]/5 blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="kalyma.ma"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-xl font-bold font-outfit text-[#1a2b5e]">
            kalyma.ma
          </span>
        </div>
        <Link 
          href="/auth"
          className="px-6 py-2.5 rounded-full text-sm font-semibold border-2 border-[#1a2b5e] text-[#1a2b5e] transition-all hover:bg-[#1a2b5e] hover:text-white"
        >
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 text-xs font-bold text-[#1a2b5e] mb-8"
          >
            <Sparkles size={14} className="text-[#c9a84c]" />
            THE FUTURE OF LANGUAGE LEARNING
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold font-outfit text-[#1a2b5e] leading-tight mb-6"
          >
            Unlock Your Potential <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a2b5e] to-[#c9a84c]">
              Through Language
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-[#4a5568] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Bridge communication gaps and connect with the world. Our AI-powered platform makes English learning personalized, engaging, and effective.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              href="/auth"
              className="group relative px-8 py-4 rounded-2xl bg-[#1a2b5e] text-white font-bold text-lg shadow-2xl shadow-[#1a2b5e]/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              Get Started for Free
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Feature Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 text-left"
          >
            <div className="p-8 rounded-3xl glass-strong border border-white/40 shadow-xl shadow-black/5 hover:border-[#c9a84c]/30 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#1a2b5e]/5 flex items-center justify-center text-[#1a2b5e] mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#1a2b5e] mb-3">Accelerated Learning</h3>
              <p className="text-[#4a5568] leading-relaxed">
                Learn twice as fast with AI-driven assessments that adapt to your unique pace and proficiency level.
              </p>
            </div>

            <div className="p-8 rounded-3xl glass-strong border border-white/40 shadow-xl shadow-black/5 hover:border-[#c9a84c]/30 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#1a2b5e]/5 flex items-center justify-center text-[#1a2b5e] mb-6">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#1a2b5e] mb-3">Global Connectivity</h3>
              <p className="text-[#4a5568] leading-relaxed">
                Connect with learners worldwide and practice in real-world scenarios to speak with absolute confidence.
              </p>
            </div>

            <div className="p-8 rounded-3xl glass-strong border border-white/40 shadow-xl shadow-black/5 hover:border-[#c9a84c]/30 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#1a2b5e]/5 flex items-center justify-center text-[#1a2b5e] mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#1a2b5e] mb-3">Verified Path</h3>
              <p className="text-[#4a5568] leading-relaxed">
                Track your progress with enterprise-grade analytics and certify your skills through international standards.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <footer className="relative z-10 border-t border-[#1a2b5e]/5 py-12 text-center">
        <p className="text-sm text-[#9aa5b1]">
          © 2026 kalyma.ma. All rights reserved. Speak with confidence.
        </p>
      </footer>
    </div>
  );
}
