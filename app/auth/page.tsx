"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastSignedUpEmail, setLastSignedUpEmail] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);

  const features = [
    "Personalized Learning Path",
    "AI-Powered Conversations",
    "Progress Analytics",
  ];

  const formatAuthError = (errMsg: string) => {
    const msg = errMsg.toLowerCase();
    if (msg.includes("rate limit")) return "Please wait a moment before trying again.";
    if (msg.includes("invalid login credentials")) return "Incorrect email or password.";
    if (msg.includes("user already registered")) return "An account with this email already exists.";
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
        }
        // On success, AuthProvider will detect session and redirect automatically
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) setError(formatAuthError(error.message));
        else {
          setSuccessMessage('Account created safely! Please check your inbox to verify your email.');
          setLastSignedUpEmail(email);
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      setError(formatAuthError(err.message || "An unexpected error occurred"));
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
        type: 'signup',
        email: lastSignedUpEmail,
      });
      if (error) setError(formatAuthError(error.message));
      else {
        setSuccessMessage('Verification email sent again! Please check your inbox and spam folder.');
      }
    } catch (err: any) {
      setError(formatAuthError(err.message || 'Failed to resend email'));
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(formatAuthError(err.message || "Could not connect to Google"));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 bg-[#f0f4ff]">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#1a2b5e]/10 to-[#c9a84c]/5 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#c9a84c]/10 to-[#1a2b5e]/5 blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
             <div className="w-16 h-16 relative">
                 <Image src="/logo.png" alt="Logo" fill className="object-contain" />
             </div>
            <div className="text-left">
              <div className="text-2xl font-bold leading-tight font-outfit text-[#1a2b5e]">
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
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#1a2b5e] font-outfit mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-[#4a5568] text-sm">
              {isLogin ? "Log in to continue your journey." : "Join thousands of learners mastering English."}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4 mb-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                <div>{error}</div>
                {error.includes("verify") && lastSignedUpEmail && (
                  <button
                    type="button"
                    disabled={resendLoading}
                    onClick={handleResendEmail}
                    className="mt-2 text-sm font-bold text-[#1a2b5e] underline flex items-center gap-1 hover:opacity-80 disabled:opacity-50"
                  >
                    {resendLoading && <Loader2 size={14} className="animate-spin" />}
                    Resend confirmation email
                  </button>
                )}
              </div>
            )}
            {successMessage && (
              <div className="p-4 rounded-xl bg-green-50 text-green-700 text-sm font-medium border border-green-200">
                <div className="flex items-start gap-2">
                  <Check size={18} className="mt-0.5 shrink-0" />
                  <span>{successMessage}</span>
                </div>
                {lastSignedUpEmail && (
                  <button
                    type="button"
                    disabled={resendLoading}
                    onClick={handleResendEmail}
                    className="mt-2 ml-6 text-sm font-bold text-[#1a2b5e] underline flex items-center gap-1 hover:opacity-80 disabled:opacity-50"
                  >
                    {resendLoading && <Loader2 size={14} className="animate-spin" />}
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
              className="w-full px-4 py-4 rounded-2xl border-2 border-[#1a2b5e]/10 text-[#1a2b5e] focus:border-[#1a2b5e] focus:outline-none transition-colors"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl border-2 border-[#1a2b5e]/10 text-[#1a2b5e] focus:border-[#1a2b5e] focus:outline-none transition-colors"
            />
            
            <button
              type="submit"
              disabled={loading}
              className="group w-full py-4 rounded-2xl bg-[#1a2b5e] text-white font-bold text-lg shadow-xl shadow-[#1a2b5e]/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : isLogin ? (
                "Log In"
              ) : (
                "Sign Up"
              )}
              {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#1a2b5e]/10" />
            <span className="text-xs font-bold text-[#9aa5b1] uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-[#1a2b5e]/10" />
          </div>

          <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full py-4 rounded-2xl border-2 border-[#1a2b5e]/10 text-[#1a2b5e] font-bold text-lg transition-all hover:bg-[#1a2b5e]/5 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
          </button>

          <p className="text-center mt-6 text-sm text-[#4a5568] font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(null); setSuccessMessage(null); }}
              className="text-[#1a2b5e] font-bold hover:underline"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
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
