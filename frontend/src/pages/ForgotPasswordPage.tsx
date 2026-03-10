import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { authService } from "../services/authService";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) return;

    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-mesh px-6 py-12">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-[#00d4ff]/3 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-[#7c3aed]/3 blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* System Panel */}
        <div className="rounded-xl border border-[#00d4ff]/15 bg-[#0a1628]/90 p-8 shadow-[0_0_40px_rgba(0,212,255,0.05)] backdrop-blur-xl">
          <div className="mb-8 flex flex-col items-center">
            {/* Icon */}
            <div className="relative mb-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-[#00d4ff]/20 bg-gradient-to-br from-[#00d4ff]/10 to-[#7c3aed]/10 shadow-[0_0_30px_rgba(0,212,255,0.15)]">
                <Shield className="h-8 w-8 text-[#00d4ff]" />
              </div>
              <div className="absolute -inset-1 -z-10 rounded-xl bg-[#00d4ff]/5 blur-md" />
            </div>

            {/* Title with glow */}
            <h1
              className="font-display text-xl font-black uppercase tracking-[0.2em] text-[#00d4ff]"
              style={{ textShadow: "0 0 20px rgba(0,212,255,0.3)" }}
            >
              PASSWORD RECOVERY
            </h1>
            <p className="mt-2 text-center font-mono text-xs text-gray-500">
              {submitted
                ? "[SYSTEM] Recovery protocol complete"
                : "[SYSTEM] Enter registered credentials for recovery"}
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              {/* Success message */}
              <div className="mb-6 rounded-lg border border-[#00d4ff]/20 bg-[#00d4ff]/5 p-4">
                <p className="font-mono text-sm leading-relaxed text-[#00d4ff]">
                  [SYSTEM] Recovery link sent to your registered address.
                </p>
                <p className="mt-1 font-mono text-xs text-gray-500">
                  Target: <span className="text-gray-400">{email}</span>
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  className="w-full rounded-lg border border-[#7c3aed]/20 bg-[#7c3aed]/5 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#7c3aed] transition-all duration-200 hover:border-[#7c3aed]/40 hover:bg-[#7c3aed]/10"
                  onClick={() => {
                    setSubmitted(false);
                    setEmail("");
                  }}
                >
                  TRY ANOTHER ADDRESS
                </button>

                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center gap-2 font-mono text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors hover:text-[#00d4ff]"
                >
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                  // RETURN TO LOGIN
                </Link>
              </div>
            </motion.div>
          ) : (
            <>
              {error ? (
                <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 font-mono text-sm text-red-400">
                  <span className="mr-2 text-red-500">[ERROR]</span>
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-[#00d4ff]/70 font-display">
                    // REGISTERED ADDRESS
                  </label>
                  <Input
                    type="email"
                    placeholder="hunter@system.net"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) validateEmail(e.target.value);
                    }}
                    onBlur={() => { if (email) validateEmail(email); }}
                    error={emailError}
                    required
                  />
                  <Mail className="absolute right-3 top-[2.35rem] h-4 w-4 text-gray-600" />
                </div>

                <Button
                  type="submit"
                  className="w-full relative overflow-hidden rounded-lg border border-[#00d4ff]/30 bg-gradient-to-r from-[#00d4ff]/10 via-[#7c3aed]/10 to-[#00d4ff]/10 py-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-[#00d4ff] shadow-[0_0_20px_rgba(0,212,255,0.1)] transition-all duration-300 hover:border-[#00d4ff]/50 hover:shadow-[0_0_30px_rgba(0,212,255,0.2)] hover:text-white"
                  size="lg"
                  isLoading={isLoading}
                >
                  SEND RECOVERY LINK
                </Button>
              </form>

              <p className="mt-6 text-center">
                <Link
                  to="/login"
                  className="group inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors hover:text-[#00d4ff]"
                >
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                  // RETURN TO LOGIN
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
