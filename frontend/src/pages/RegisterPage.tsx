import { useState, useMemo, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Check, X, Zap, Shield, Swords } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { GoogleOAuthButton } from "../components/auth/GoogleOAuthButton";

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const passwordRequirements: PasswordRequirement[] = useMemo(
    () => [
      { label: "At least 8 characters", met: password.length >= 8 },
      { label: "Contains a number", met: /\d/.test(password) },
      { label: "Contains an uppercase letter", met: /[A-Z]/.test(password) },
      { label: "Contains a lowercase letter", met: /[a-z]/.test(password) },
    ],
    [password]
  );

  const allRequirementsMet = passwordRequirements.every((r) => r.met);

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
    if (!allRequirementsMet) {
      setError("Please meet all password requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, fullName);
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Registration failed. This email may already be in use.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#050a15" }}>
      {/* Left Panel - Awakening Theme */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:items-center lg:justify-center" style={{ backgroundColor: "#050a15" }}>
        {/* Animated Cyan/Purple Orbs */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
            className="absolute right-[15%] top-[15%] h-72 w-72 rounded-full blur-[100px]"
            style={{ backgroundColor: "rgba(124, 58, 237, 0.15)" }}
          />
          <motion.div
            animate={{ x: [0, 20, 0], y: [0, -25, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
            className="absolute bottom-[25%] left-[15%] h-64 w-64 rounded-full blur-[100px]"
            style={{ backgroundColor: "rgba(0, 212, 255, 0.15)" }}
          />
          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 0.8, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                repeat: Infinity,
                duration: 4 + i * 0.5,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
              className="absolute rounded-full"
              style={{
                width: 3 + (i % 4) * 2,
                height: 3 + (i % 4) * 2,
                backgroundColor: i % 2 === 0 ? "#00d4ff" : "#7c3aed",
                left: `${10 + i * 10}%`,
                top: `${45 + (i % 4) * 10}%`,
                boxShadow: i % 2 === 0
                  ? "0 0 8px #00d4ff, 0 0 16px rgba(0, 212, 255, 0.5)"
                  : "0 0 8px #7c3aed, 0 0 16px rgba(124, 58, 237, 0.5)",
              }}
            />
          ))}
        </div>

        {/* Awakening portal rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
            transition={{ rotate: { repeat: Infinity, duration: 25, ease: "linear" }, scale: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
            className="h-[450px] w-[450px] rounded-full opacity-15"
            style={{
              border: "1px solid #7c3aed",
              boxShadow: "0 0 40px rgba(124, 58, 237, 0.1), inset 0 0 40px rgba(124, 58, 237, 0.05)",
            }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            className="h-[340px] w-[340px] rounded-full opacity-20"
            style={{
              border: "1px solid #00d4ff",
              boxShadow: "0 0 30px rgba(0, 212, 255, 0.1)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-md px-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mb-8 flex justify-center"
          >
            <div
              className="relative flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #00d4ff)",
                boxShadow: "0 0 30px rgba(124, 58, 237, 0.4), 0 0 60px rgba(124, 58, 237, 0.15)",
              }}
            >
              <Swords className="h-8 w-8 text-white" />
              <div
                className="absolute inset-0 rounded-2xl opacity-50 blur-xl"
                style={{ background: "linear-gradient(135deg, #7c3aed, #00d4ff)" }}
              />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-3 text-5xl font-extrabold tracking-wider"
            style={{
              background: "linear-gradient(90deg, #00d4ff, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "monospace",
              filter: "drop-shadow(0 0 20px rgba(0, 212, 255, 0.4))",
            }}
          >
            AWAKENING
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-10 text-base italic"
            style={{ color: "rgba(124, 58, 237, 0.7)" }}
          >
            A new hunter awakens.
          </motion.p>

          {/* Hunter Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "10K+", label: "Hunters", icon: User, color: "#00d4ff" },
              { value: "50K+", label: "Quests", icon: Shield, color: "#7c3aed" },
              { value: "1M+", label: "XP Earned", icon: Zap, color: "#00d4ff" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="system-panel glass rounded-xl p-4"
                style={{
                  border: "1px solid rgba(0, 212, 255, 0.12)",
                  backgroundColor: "rgba(0, 212, 255, 0.03)",
                }}
              >
                <stat.icon
                  className="mx-auto mb-1 h-5 w-5"
                  style={{
                    color: stat.color,
                    filter: `drop-shadow(0 0 6px ${stat.color}80)`,
                  }}
                />
                <div
                  className="text-xl font-bold"
                  style={{
                    color: stat.color,
                    textShadow: `0 0 10px ${stat.color}50`,
                    fontFamily: "monospace",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-[10px] font-medium uppercase tracking-wider"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Hunter Registration */}
      <div
        className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2"
        style={{ backgroundColor: "#050a15" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex flex-col items-center lg:items-start">
            {/* Mobile SYSTEM logo */}
            <div className="mb-4 flex items-center gap-2 lg:hidden">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #00d4ff)",
                  boxShadow: "0 0 20px rgba(124, 58, 237, 0.3)",
                }}
              >
                <Swords className="h-4 w-4 text-white" />
              </div>
              <span
                className="text-lg font-bold tracking-widest"
                style={{
                  background: "linear-gradient(90deg, #00d4ff, #7c3aed)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "monospace",
                }}
              >
                SYSTEM
              </span>
            </div>
            <h1
              className="text-2xl font-bold tracking-wider"
              style={{
                color: "#00d4ff",
                textShadow: "0 0 15px rgba(0, 212, 255, 0.5), 0 0 30px rgba(0, 212, 255, 0.2)",
                fontFamily: "monospace",
              }}
            >
              HUNTER REGISTRATION
            </h1>
            <p className="mt-1 text-sm" style={{ color: "rgba(0, 212, 255, 0.4)" }}>
              Begin your awakening process
            </p>
          </div>

          <GoogleOAuthButton label="Sign up with Google" />

          {/* System-styled divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(0, 212, 255, 0.3), transparent)" }} />
            <span
              className="text-xs font-bold tracking-widest"
              style={{ color: "rgba(0, 212, 255, 0.4)", fontFamily: "monospace" }}
            >
              OR
            </span>
            <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(0, 212, 255, 0.3), transparent)" }} />
          </div>

          {error ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 glass rounded-xl p-3 text-sm"
              style={{
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#f87171",
                backgroundColor: "rgba(239, 68, 68, 0.05)",
                fontFamily: "monospace",
              }}
            >
              [ERROR] {error}
            </motion.div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                label="Hunter Name"
                type="text"
                placeholder="Sung Jin-Woo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <User className="absolute right-3 top-9 h-4 w-4" style={{ color: "rgba(0, 212, 255, 0.4)" }} />
            </div>

            <div className="relative">
              <Input
                label="Email"
                type="email"
                placeholder="hunter@system.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={() => { if (email) validateEmail(email); }}
                error={emailError}
                required
              />
              <Mail className="absolute right-3 top-9 h-4 w-4" style={{ color: "rgba(0, 212, 255, 0.4)" }} />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowPasswordRequirements(true)}
                onBlur={() => { if (allRequirementsMet) setShowPasswordRequirements(false); }}
                required
              />
              <Lock className="absolute right-3 top-9 h-4 w-4" style={{ color: "rgba(0, 212, 255, 0.4)" }} />
            </div>

            {showPasswordRequirements || (password && !allRequirementsMet) ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="system-panel glass rounded-xl p-3"
                style={{
                  border: "1px solid rgba(0, 212, 255, 0.12)",
                  backgroundColor: "rgba(0, 212, 255, 0.03)",
                }}
              >
                <p
                  className="mb-2 text-xs font-bold uppercase tracking-widest"
                  style={{
                    color: "#00d4ff",
                    textShadow: "0 0 8px rgba(0, 212, 255, 0.4)",
                    fontFamily: "monospace",
                  }}
                >
                  SYSTEM REQUIREMENTS:
                </p>
                <ul className="space-y-1.5">
                  {passwordRequirements.map((req) => (
                    <li key={req.label} className="flex items-center gap-2 text-xs" style={{ fontFamily: "monospace" }}>
                      {req.met ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <Check
                            className="h-3.5 w-3.5"
                            style={{
                              color: "#00d4ff",
                              filter: "drop-shadow(0 0 4px rgba(0, 212, 255, 0.6))",
                            }}
                          />
                        </motion.div>
                      ) : (
                        <X className="h-3.5 w-3.5" style={{ color: "rgba(255,255,255,0.2)" }} />
                      )}
                      <span
                        style={{
                          color: req.met ? "#00d4ff" : "rgba(255,255,255,0.35)",
                          textShadow: req.met ? "0 0 6px rgba(0, 212, 255, 0.3)" : "none",
                        }}
                      >
                        {req.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : null}

            <div className="relative">
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={
                  confirmPassword && password !== confirmPassword
                    ? "Passwords do not match"
                    : undefined
                }
                required
              />
              <Lock className="absolute right-3 top-9 h-4 w-4" style={{ color: "rgba(0, 212, 255, 0.4)" }} />
            </div>

            <Button
              type="submit"
              className="w-full relative overflow-hidden"
              size="lg"
              isLoading={isLoading}
              disabled={!allRequirementsMet || password !== confirmPassword}
              style={{
                background: "linear-gradient(135deg, #7c3aed, #00d4ff)",
                boxShadow: "0 0 20px rgba(124, 58, 237, 0.3), 0 0 40px rgba(124, 58, 237, 0.1)",
                border: "1px solid rgba(124, 58, 237, 0.3)",
                fontFamily: "monospace",
                letterSpacing: "0.15em",
              }}
            >
              AWAKEN
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Already a hunter?{" "}
            <Link
              to="/login"
              className="font-semibold transition-colors"
              style={{ color: "#00d4ff" }}
              onMouseEnter={(e) => (e.currentTarget.style.textShadow = "0 0 10px rgba(0, 212, 255, 0.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.textShadow = "none")}
            >
              Enter the gate
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
