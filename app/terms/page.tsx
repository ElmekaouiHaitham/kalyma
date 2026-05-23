"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#f7f2ea] p-6 lg:p-12 font-outfit">
      <div className="max-w-3xl mx-auto bg-white p-8 lg:p-12 rounded-3xl shadow-xl shadow-[#1a2b5e]/5">
        <Link href="/" className="inline-flex items-center gap-2 text-[#64748b] hover:text-[#1a2b5e] transition-colors mb-8">
          <ArrowLeft size={18} />
          <span className="font-bold">Back to Home</span>
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-[#1a2b5e] mb-4">Terms of Service</h1>
          <p className="text-sm text-[#9aa5b1] mb-8 font-bold uppercase tracking-wider">Last Updated: May 2026</p>
          
          <div className="space-y-6 text-[#4a5568] leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-[#1a2b5e] mb-2">1. Acceptance of Terms</h2>
              <p>By accessing and using Kalyma.ma, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-[#1a2b5e] mb-2">2. Use License</h2>
              <p>Permission is granted to temporarily use the materials and features (such as Atlas Chat and AI reading modules) on Kalyma's website for personal, non-commercial transitory viewing and learning only.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-[#1a2b5e] mb-2">3. User Accounts</h2>
              <p>To use our services, you must register for an account. You are responsible for safeguarding your password and for all activities that occur under your account.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a2b5e] mb-2">4. Acceptable Use</h2>
              <p>You agree not to use the AI chat features to generate malicious, illegal, or inappropriate content. We reserve the right to terminate accounts that violate our community guidelines.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#1a2b5e] mb-2">5. Subscriptions and Payments</h2>
              <p>Certain premium features require a paid subscription. All payments are processed securely through our payment provider. Subscriptions automatically renew unless canceled prior to the renewal date.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-[#1a2b5e] mb-2">6. Modifications</h2>
              <p>Kalyma may revise these terms of service at any time without notice. By using this website you are agreeing to be bound by the then-current version of these terms.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
