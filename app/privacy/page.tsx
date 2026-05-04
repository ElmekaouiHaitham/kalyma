"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#f0f4ff] p-6 lg:p-12 font-outfit">
      <div className="max-w-3xl mx-auto bg-white p-8 lg:p-12 rounded-3xl shadow-xl shadow-[#1a2b5e]/5">
        <Link href="/" className="inline-flex items-center gap-2 text-[#64748b] hover:text-[#1a2b5e] transition-colors mb-8">
          <ArrowLeft size={18} />
          <span className="font-bold">Back to Home</span>
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-[#1a2b5e] mb-4">Privacy Policy</h1>
          <p className="text-sm text-[#9aa5b1] mb-8 font-bold uppercase tracking-wider">Last Updated: May 2026</p>
          
          <div className="space-y-6 text-[#4a5568] leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-[#1a2b5e] mb-2">1. Information We Collect</h2>
              <p>When you use Kalyma, we collect your email address, profile information, and learning progress data. This helps us personalize your language learning experience and track your vocabulary mastery.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-[#1a2b5e] mb-2">2. How We Use Your Data</h2>
              <p>Your data is exclusively used to provide, maintain, and improve our AI language features. We do not sell your personal data to third parties. We use your data to power the Atlas AI conversations, recommend reading materials, and generate custom practice decks.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-[#1a2b5e] mb-2">3. Third-Party Services</h2>
              <p>We use third-party services such as Supabase for secure authentication and database hosting, and Google (OAuth) if you choose to sign in with Google. These services have their own privacy policies governing the data they process on our behalf.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a2b5e] mb-2">4. Security</h2>
              <p>We implement industry-standard security measures to protect your personal information. Your passwords are never stored in plain text, and all data transmission is encrypted.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a2b5e] mb-2">5. Contact Us</h2>
              <p>If you have any questions or concerns about this Privacy Policy, please contact us at support@kalyma.ma.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
