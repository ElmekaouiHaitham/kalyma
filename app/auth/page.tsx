"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/providers";

function AuthBrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Image
      src="/logo%20with%20word.webp"
      alt="Kalyma"
      width={compact ? 132 : 150}
      height={compact ? 42 : 48}
      priority
      className={compact ? "h-auto w-[142px] object-contain" : "h-auto w-[166px] object-contain"}
    />
  );
}

function AuthIllustration({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src="/onboarding/welcome-illustration.png"
        alt=""
        width={670}
        height={555}
        priority
        unoptimized
        className="h-full w-full object-contain"
      />
    </div>
  );
}

function AuthFrame({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fffdf7]">
      <div className="hidden min-h-screen grid-cols-[37%_63%] md:grid">
        <aside className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f3dda9]">
          <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(#c99d48_0.7px,transparent_0.7px)] [background-size:6px_6px]" />
          <AuthIllustration className="relative z-10 h-[40vh] max-h-[360px] w-[68%] max-w-[360px]" />
        </aside>

        <main className="flex min-h-screen flex-col bg-[#fffdf7] px-[6%] py-7 text-[#17265d]">
          <header className="flex items-center justify-between">
            <AuthBrandMark compact />
            <p className="text-xs font-medium uppercase tracking-[0.04em] text-[#1d2130]">
              {eyebrow}
            </p>
          </header>
          <div className="flex flex-1 items-center justify-center py-6">
            <div className="w-full max-w-[440px]">{children}</div>
          </div>
        </main>
      </div>

      <div className="flex min-h-screen flex-col bg-[#fffdf7] md:hidden">
        <div className="bg-[#fffdf7] px-6 py-6">
          <header className="flex items-center justify-between">
            <AuthBrandMark />
            <p className="text-xs font-medium uppercase tracking-[0.04em] text-[#1d2130]">
              {eyebrow}
            </p>
          </header>
        </div>

        <main className="flex-1 bg-[#fffdf7] px-5 pb-7 pt-6 text-[#17265d]">
          {children}
        </main>
      </div>
    </div>
  );
}

function AuthTransitionScreen({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <AuthFrame eyebrow="Access">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[16px] border-2 border-[#17265d] bg-[#fff8df] p-4 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full border-2 border-[#17265d] bg-[#f2dda9] p-3"
        >
          <Image
            src="/logo.png"
            alt="kalyma"
            width={48}
            height={48}
            className="h-full w-full object-contain"
            priority
          />
        </motion.div>

        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8b6d2e]">
          Personalizing
        </p>
        <h1 className="mt-2 text-[clamp(1.5rem,6vw,1.9rem)] font-black leading-tight tracking-[-0.03em] text-[#17265d] md:text-[30px]">
          {title}
        </h1>
        <p className="mt-2 text-[13px] font-medium leading-[1.45] text-[#394260] md:text-[14px]">
          {message}
        </p>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/70 shadow-[inset_0_0_0_1px_rgba(25,42,98,0.02)]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#17265d] to-[#b79646]"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-[#394260]">
          <Loader2 size={13} className="animate-spin" />
          Taking you to your home
        </div>
      </motion.div>
    </AuthFrame>
  );
}

export default function AuthPage() {
  const { session, user, isLoading: authLoading, refreshUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [handoffLoading, setHandoffLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastSignedUpEmail, setLastSignedUpEmail] = useState<string | null>(
    null,
  );
  const [resendLoading, setResendLoading] = useState(false);

  const formatAuthError = (errMsg: string) => {
    const msg = errMsg.toLowerCase();
    if (msg.includes("rate limit"))
      return "Please wait a moment before trying again.";
    if (msg.includes("invalid login credentials"))
      return "Incorrect email or password.";
    if (msg.includes("user already registered"))
      return "An account with this email already exists.";
    return errMsg;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          if (error.message.toLowerCase().includes("email not confirmed")) {
            setError("Please verify your email address before logging in.");
            setLastSignedUpEmail(email);
          } else {
            setError(formatAuthError(error.message));
          }
        } else {
          setHandoffLoading(true);
          await refreshUser(true);
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) setError(formatAuthError(error.message));
        else {
          if (data?.session) {
            setHandoffLoading(true);
            await refreshUser(true);
          } else {
            setSuccessMessage(
              "Account created safely! Please check your inbox to verify your email.",
            );
            setLastSignedUpEmail(email);
            setIsLogin(true);
          }
        }
      }
    } catch (err: unknown) {
      setError(
        formatAuthError(
          err instanceof Error ? err.message : "An unexpected error occurred",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!lastSignedUpEmail) return;
    setResendLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: lastSignedUpEmail,
      });
      if (error) setError(formatAuthError(error.message));
      else {
        setSuccessMessage(
          "Verification email sent again! Please check your inbox and spam folder.",
        );
      }
    } catch (err: unknown) {
      setError(
        formatAuthError(
          err instanceof Error ? err.message : "Failed to resend email",
        ),
      );
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setHandoffLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth`,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setError(
        formatAuthError(
          err instanceof Error ? err.message : "Could not connect to Google",
        ),
      );
      setHandoffLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!handoffLoading || authLoading || !session || user) return;

    const timeout = window.setTimeout(() => {
      setHandoffLoading(false);
      setLoading(false);
      setError("We could not finish preparing your profile. Please try again.");
    }, 8000);

    return () => window.clearTimeout(timeout);
  }, [authLoading, handoffLoading, session, user]);

  const isRedirectingSignedInUser = Boolean(session && user);

  if (authLoading || handoffLoading || isRedirectingSignedInUser) {
    return (
      <AuthTransitionScreen
        title={
          session || handoffLoading
            ? "Preparing your home"
            : "Checking your session"
        }
        message={
          session || handoffLoading
            ? "We are loading your profile, preferences, and learning plan."
            : "One moment while we check whether you are already signed in."
        }
      />
    );
  }

  return (
    <AuthFrame eyebrow={isLogin ? "Log in" : "Sign up"}>
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[16px] border-2 border-[#17265d] bg-[#fff8df] p-4"
        >
          <div className="mb-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8b6d2e]">
              {isLogin ? "Welcome back" : "Create account"}
            </p>
            <h1 className="mt-1.5 text-[clamp(1.5rem,6vw,1.9rem)] font-black leading-tight tracking-[-0.03em] text-[#17265d] md:text-[30px]">
              {isLogin ? "Log in to Kalyma" : "Start learning with Kalyma"}
            </h1>
            <p className="mt-2 text-[13px] font-medium leading-[1.45] text-[#394260] md:text-[14px]">
              {isLogin
                ? "Continue your reading, review, and speaking plan."
                : "Create your account and set up your learning path."}
            </p>
          </div>

          <form onSubmit={handleAuth} className="mb-4 space-y-3">
            {error && (
              <div className="rounded-lg border-2 border-red-700 bg-red-50 p-3 text-xs font-bold text-red-700">
                <div>{error}</div>
                {error.includes("verify") && lastSignedUpEmail && (
                  <button
                    type="button"
                    disabled={resendLoading}
                    onClick={handleResendEmail}
                    className="mt-2 flex items-center gap-1 text-xs font-extrabold text-[#17265d] underline hover:opacity-80 disabled:opacity-50"
                  >
                    {resendLoading && (
                      <Loader2 size={12} className="animate-spin" />
                    )}
                    Resend confirmation email
                  </button>
                )}
              </div>
            )}
            {successMessage && (
              <div className="rounded-lg border-2 border-[#17265d] bg-[#fffdf7] p-3 text-xs font-bold text-[#17265d]">
                <div className="flex items-start gap-2">
                  <Check size={15} className="mt-0.5 shrink-0" />
                  <span>{successMessage}</span>
                </div>
                {lastSignedUpEmail && (
                  <button
                    type="button"
                    disabled={resendLoading}
                    onClick={handleResendEmail}
                    className="mt-2 ml-5 flex items-center gap-1 text-xs font-extrabold text-[#17265d] underline hover:opacity-80 disabled:opacity-50"
                  >
                    {resendLoading && (
                      <Loader2 size={12} className="animate-spin" />
                    )}
                    Resend confirmation email
                  </button>
                )}
              </div>
            )}

            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full rounded-lg border-2 border-[#17265d] bg-[#fffdf7] px-3 text-[13px] font-medium text-[#17265d] outline-none transition placeholder:text-[#7d7f86] focus:shadow-[0_0_0_3px_rgba(23,38,93,0.12)] md:h-10 md:px-3 md:text-[14px]"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-full rounded-lg border-2 border-[#17265d] bg-[#fffdf7] px-3 text-[13px] font-medium text-[#17265d] outline-none transition placeholder:text-[#7d7f86] focus:shadow-[0_0_0_3px_rgba(23,38,93,0.12)] md:h-10 md:px-3 md:text-[14px]"
            />

            {!isLogin && (
              <label className="mt-3 mb-1 flex cursor-pointer items-start gap-2">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-3.5 w-3.5 rounded border-[#17265d] text-[#17265d] focus:ring-[#17265d]"
                />
                <span className="text-xs font-semibold leading-5 text-[#394260]">
                  I agree to the{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    className="font-extrabold text-[#17265d] hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    className="font-extrabold text-[#17265d] hover:underline"
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#17265d] px-4 text-[13px] font-extrabold text-white shadow-[0_8px_16px_rgba(23,38,93,0.14)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-wait disabled:opacity-70 md:text-[14px]"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isLogin ? "Logging in..." : "Creating account..."}
                </>
              ) : isLogin ? (
                "Log In"
              ) : (
                "Sign Up"
              )}
              {!loading && (
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              )}
            </button>
          </form>

          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#17265d]/20" />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8b6d2e]">
              or
            </span>
            <div className="h-px flex-1 bg-[#17265d]/20" />
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="flex h-10 w-full items-center justify-center gap-2.5 rounded-lg border-2 border-[#17265d] bg-[#fffdf7] px-3 text-[13px] font-extrabold text-[#17265d] transition hover:bg-[#f7efd8] disabled:opacity-70 md:text-[14px]"
          >
            <svg
              viewBox="0 0 24 24"
              width="19"
              height="19"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Connecting...
              </>
            ) : (
              "Continue with Google"
            )}
          </button>

          <p className="mt-4 text-center text-xs font-semibold text-[#394260]">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setSuccessMessage(null);
              }}
              className="font-extrabold text-[#17265d] underline"
            >
              {isLogin ? "Create a new account" : "Log in"}
            </button>
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center text-[11px] font-semibold text-[#394260]"
        >
          By joining, you agree to our{" "}
          <a
            href="/terms"
            target="_blank"
            className="cursor-pointer text-[#17265d] underline"
          >
            Terms
          </a>{" "}
          &{" "}
          <a
            href="/privacy"
            target="_blank"
            className="cursor-pointer text-[#17265d] underline"
          >
            Privacy Policy
          </a>
        </motion.p>
      </div>
    </AuthFrame>
  );
}
