"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Crown, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FREE_FEATURES = [
  "1 article a week",
  "Customizable learning pace",
  "Vocabulary review",
  "1 news articles a day",
  "3 Atlas AI chats a day",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Unlimited articles",
  "Unlimited learning pace",
  "Unlimited news articles a day",
  "unlimited Atlas AI chats",
  "Access to new features",
  "Upcomming live classes",
  "Public speaking cup"
];

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full md:hidden">
        <Image src="/logo.png" alt="" width={32} height={32} className="h-full w-full object-contain" />
      </div>
      <span className="text-[23px] font-extrabold leading-none tracking-[-0.01em] text-[#17265d] md:text-[26px]">
        kalyma
      </span>
    </div>
  );
}

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-2.5 text-[14px] font-semibold leading-5 text-[#394260]">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f3dda9] text-[#17265d]">
            <Check size={13} strokeWidth={3} />
          </span>
          {feature}
        </li>
      ))}
    </ul>
  );
}

export default function PlansPage() {
  const router = useRouter();
  const continueToHome = () => router.push("/home");

  return (
    <div className="min-h-screen bg-[#fffdf7] text-[#17265d]">
      <div className="hidden min-h-screen grid-cols-[38%_62%] md:grid">
        <aside className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f3dda9]">
          <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(#c99d48_0.7px,transparent_0.7px)] [background-size:6px_6px]" />
          <div className="relative z-10 w-[68%] max-w-[390px]">
            <Image
              src="/onboarding/planning-illustration.png"
              alt=""
              width={526}
              height={498}
              priority
              unoptimized
              className="h-auto w-full object-contain"
            />
          </div>
        </aside>

        <main className="flex min-h-screen flex-col px-[6%] py-9">
          <header className="flex items-center justify-between">
            <BrandMark />
            <p className="text-[14px] font-medium uppercase tracking-[0.04em] text-[#1d2130]">All set</p>
          </header>
          <div className="flex flex-1 items-center justify-center py-7">
            <PlansContent onContinue={continueToHome} />
          </div>
        </main>
      </div>

      <div className="flex min-h-screen flex-col md:hidden">
        <header className="flex items-center justify-between bg-[#f3dda9] px-[8.7vw] py-6">
          <BrandMark />
          <p className="text-[14px] font-medium uppercase tracking-[0.04em] text-[#1d2130]">All set</p>
        </header>
        <main className="flex flex-1 items-center px-[6vw] py-8">
          <PlansContent onContinue={continueToHome} />
        </main>
      </div>
    </div>
  );
}

function PlansContent({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[720px]"
    >
      <div className="text-center md:text-left">
        <h1 className="text-[clamp(2rem,7vw,2.75rem)] font-black leading-[1.02] tracking-[-0.035em] text-[#17265d]">
          Choose how you want to start
        </h1>
        <p className="mx-auto mt-3 max-w-[560px] text-[15px] font-medium leading-6 text-[#394260] md:mx-0 md:text-[16px]">
          Your learning plan is ready. Pick a plan now and you can change it later.
        </p>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <article className="flex min-h-[360px] flex-col rounded-[20px] border-2 border-[#17265d] bg-[#fffdf7] p-5 md:p-6">
          <div>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#8b6d2e]">Free</p>
            <div className="mt-3 flex items-end gap-2">
              <p className="text-[38px] font-black leading-none text-[#17265d]">0 MAD</p>
              <p className="pb-1 text-sm font-semibold text-[#394260]">forever</p>
            </div>
            <p className="mt-4 text-[14px] font-medium leading-6 text-[#394260]">
              The essentials for building a steady English reading habit.
            </p>
            <FeatureList features={FREE_FEATURES} />
          </div>
          <button
            type="button"
            onClick={onContinue}
            className="mt-auto inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-[#17265d] bg-[#fffdf7] px-4 text-[15px] font-extrabold text-[#17265d] transition hover:-translate-y-0.5 hover:bg-[#f7efd8]"
          >
            Continue with Free
            <ArrowRight size={18} strokeWidth={2.7} />
          </button>
        </article>

        <article className="relative flex min-h-[360px] flex-col overflow-hidden rounded-[20px] border-2 border-[#17265d] bg-[#fff8df] p-5 shadow-[8px_8px_0_#f3dda9] md:p-6">
          <div className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center rounded-bl-[18px] bg-[#17265d] text-[#f3dda9]">
            <Crown size={23} strokeWidth={2.4} />
          </div>
          <div>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#8b6d2e]">Pro</p>
            <p className="mt-3 text-[38px] font-black leading-none text-[#17265d]">79 DH</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#17265d] px-3 py-2 text-[12px] font-extrabold text-white">
              <Sparkles size={15} strokeWidth={2.5} />
              Completely free until 12 July
            </div>
            <p className="mt-4 text-[14px] font-medium leading-6 text-[#394260]">
              Try the complete Kalyma experience while the launch offer is active.
            </p>
            <FeatureList features={PRO_FEATURES} />
          </div>
          <div className="mt-auto pt-5">
            <button
              type="button"
              onClick={onContinue}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#17265d] px-4 text-[15px] font-extrabold text-white shadow-[0_8px_16px_rgba(23,38,93,0.14)] transition hover:-translate-y-0.5"
            >
              Start Pro for free
              <ArrowRight size={18} strokeWidth={2.7} />
            </button>
            <p className="mt-2 text-center text-[12px] font-semibold text-[#68708a]">No payment required</p>
          </div>
        </article>
      </div>
    </motion.section>
  );
}
