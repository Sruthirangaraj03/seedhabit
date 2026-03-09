import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, ArrowRight, Zap, Flame, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { GoogleOAuthButton } from "../components/auth/GoogleOAuthButton";

interface LocationState {
  from?: { pathname: string };
}

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as LocationState)?.from?.pathname || "/dashboard";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

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
    if (!password) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      setError("Invalid email or password.");
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
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="absolute left-[15%] top-[20%] h-64 w-64 rounded-full bg-primary-500/15 blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
            className="absolute bottom-[20%] right-[15%] h-80 w-80 rounded-full bg-neon-purple/10 blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, 15, 0], y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute left-[40%] top-[50%] h-48 w-48 rounded-full bg-neon-green/8 blur-[80px]"
          />
        </div>

        <div className="relative z-10 max-w-md px-8 text-center">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-neon-purple shadow-lg shadow-primary-500/30">
              <Zap className="h-8 w-8 text-white" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500 to-neon-purple opacity-50 blur-xl" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gradient mb-3 text-4xl font-extrabold"
          >
            Level up your life.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-10 text-base text-gray-400"
          >
            Track habits. Earn XP. Build streaks. Become unstoppable.
          </motion.p>

          <div className="space-y-3 text-left">
            {[
              { icon: Zap, title: "Earn XP", desc: "Every habit completed earns you experience", color: "text-primary-400", bg: "from-primary-500/10 to-primary-500/5" },
              { icon: Flame, title: "Build streaks", desc: "Keep your fire alive with daily consistency", color: "text-amber-400", bg: "from-amber-500/10 to-amber-500/5" },
              { icon: Trophy, title: "Unlock achievements", desc: "Hit milestones and collect badges", color: "text-violet-400", bg: "from-violet-500/10 to-violet-500/5" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`glass flex items-center gap-3 rounded-xl p-4`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${item.bg}`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
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
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="mt-1 text-sm text-gray-500">Continue your streak</p>
          </div>

          <GoogleOAuthButton />

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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock className="absolute right-3 top-9 h-4 w-4 text-gray-600" />
            </div>

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-semibold text-primary-400 hover:text-primary-300">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
