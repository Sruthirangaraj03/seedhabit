import { useState, useMemo, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Check, X, Zap, Target, Star } from "lucide-react";
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
    <div className="flex min-h-screen">
      {/* Left Panel - Gamified */}
      <div className="relative hidden w-1/2 overflow-hidden bg-mesh lg:flex lg:flex-col lg:items-center lg:justify-center">
        {/* Animated Orbs */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
            className="absolute right-[15%] top-[15%] h-72 w-72 rounded-full bg-neon-purple/15 blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, 20, 0], y: [0, -25, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
            className="absolute bottom-[25%] left-[15%] h-64 w-64 rounded-full bg-primary-500/15 blur-[100px]"
          />
        </div>

        <div className="relative z-10 max-w-md px-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-purple to-primary-500 shadow-lg shadow-neon-purple/30">
              <Zap className="h-8 w-8 text-white" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-purple to-primary-500 opacity-50 blur-xl" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gradient mb-3 text-4xl font-extrabold"
          >
            Start your journey.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-10 text-base text-gray-400"
          >
            Join thousands leveling up their daily routines.
          </motion.p>

          {/* Animated Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "10K+", label: "Players", icon: User, color: "text-primary-400" },
              { value: "50K+", label: "Habits", icon: Target, color: "text-neon-green" },
              { value: "1M+", label: "XP Earned", icon: Star, color: "text-amber-400" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="glass rounded-xl p-4"
              >
                <stat.icon className={`mx-auto mb-1 h-5 w-5 ${stat.color}`} />
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full flex-col items-center justify-center bg-mesh px-6 py-12 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex flex-col items-center lg:items-start">
            <div className="mb-4 flex items-center gap-2 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-neon-purple">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-gradient text-lg font-bold">SeedHabit</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="mt-1 text-sm text-gray-500">Start building better habits today</p>
          </div>

          <GoogleOAuthButton label="Sign up with Google" />

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
            <span className="text-xs text-gray-600">or</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
          </div>

          {error ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 glass rounded-xl border-red-500/20 p-3 text-sm text-red-400"
            >
              {error}
            </motion.div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <User className="absolute right-3 top-9 h-4 w-4 text-gray-600" />
            </div>

            <div className="relative">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={() => { if (email) validateEmail(email); }}
                error={emailError}
                required
              />
              <Mail className="absolute right-3 top-9 h-4 w-4 text-gray-600" />
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
              <Lock className="absolute right-3 top-9 h-4 w-4 text-gray-600" />
            </div>

            {showPasswordRequirements || (password && !allRequirementsMet) ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="glass rounded-xl p-3"
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Password requirements:</p>
                <ul className="space-y-1.5">
                  {passwordRequirements.map((req) => (
                    <li key={req.label} className="flex items-center gap-2 text-xs">
                      {req.met ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <Check className="h-3.5 w-3.5 text-neon-green" />
                        </motion.div>
                      ) : (
                        <X className="h-3.5 w-3.5 text-gray-600" />
                      )}
                      <span className={req.met ? "text-neon-green font-medium" : "text-gray-500"}>
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
              <Lock className="absolute right-3 top-9 h-4 w-4 text-gray-600" />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
              disabled={!allRequirementsMet || password !== confirmPassword}
            >
              Create account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary-400 hover:text-primary-300">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
