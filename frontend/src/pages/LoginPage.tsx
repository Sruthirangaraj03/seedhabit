import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, ArrowRight, Zap } from "lucide-react";
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
    <div className="flex min-h-screen" style={{ backgroundColor: "#050a15" }}>
      {/* Left Panel - Dungeon Gate Portal */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:items-center lg:justify-center" style={{ backgroundColor: "#050a15" }}>
        {/* Animated Cyan/Blue Orbs */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="absolute left-[15%] top-[20%] h-64 w-64 rounded-full blur-[100px]"
            style={{ backgroundColor: "rgba(0, 212, 255, 0.15)" }}
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
            className="absolute bottom-[20%] right-[15%] h-80 w-80 rounded-full blur-[100px]"
            style={{ backgroundColor: "rgba(124, 58, 237, 0.12)" }}
          />
          <motion.div
            animate={{ x: [0, 15, 0], y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute left-[40%] top-[50%] h-48 w-48 rounded-full blur-[80px]"
            style={{ backgroundColor: "rgba(0, 212, 255, 0.08)" }}
          />
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -80, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3 + i * 0.7,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
              className="absolute rounded-full"
              style={{
                width: 4 + (i % 3) * 2,
                height: 4 + (i % 3) * 2,
                backgroundColor: "#00d4ff",
                left: `${15 + i * 12}%`,
                top: `${50 + (i % 3) * 15}%`,
                boxShadow: "0 0 8px #00d4ff, 0 0 16px rgba(0, 212, 255, 0.5)",
              }}
            />
          ))}
        </div>

        {/* Dungeon gate ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="h-[500px] w-[500px] rounded-full opacity-20"
            style={{
              border: "1px solid #00d4ff",
              boxShadow: "0 0 40px rgba(0, 212, 255, 0.1), inset 0 0 40px rgba(0, 212, 255, 0.05)",
            }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="h-[380px] w-[380px] rounded-full opacity-15"
            style={{
              border: "1px solid #7c3aed",
              boxShadow: "0 0 30px rgba(124, 58, 237, 0.1)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-md px-8 text-center">
          {/* SYSTEM Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mb-8 flex justify-center"
          >
            <div
              className="relative flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
                boxShadow: "0 0 30px rgba(0, 212, 255, 0.4), 0 0 60px rgba(0, 212, 255, 0.15)",
              }}
            >
              <Zap className="h-8 w-8 text-white" />
              <div
                className="absolute inset-0 rounded-2xl opacity-50 blur-xl"
                style={{ background: "linear-gradient(135deg, #00d4ff, #7c3aed)" }}
              />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-3 text-5xl font-extrabold tracking-wider"
            style={{
              color: "#00d4ff",
              textShadow: "0 0 20px rgba(0, 212, 255, 0.6), 0 0 40px rgba(0, 212, 255, 0.3), 0 0 80px rgba(0, 212, 255, 0.15)",
              fontFamily: "monospace",
            }}
          >
            SYSTEM
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-10 text-base italic"
            style={{ color: "rgba(0, 212, 255, 0.6)" }}
          >
            Only the strong survive. Arise.
          </motion.p>

          <div className="space-y-3 text-left">
            {[
              { title: "[QUEST AVAILABLE]", desc: "Track Daily Habits", color: "#00d4ff" },
              { title: "[POWER UP]", desc: "Earn XP & Rank Up", color: "#7c3aed" },
              { title: "[ACHIEVEMENT]", desc: "Unlock Hunter Titles", color: "#00d4ff" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="system-panel glass flex items-center gap-3 rounded-xl p-4"
                style={{
                  border: "1px solid rgba(0, 212, 255, 0.15)",
                  backgroundColor: "rgba(0, 212, 255, 0.03)",
                }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${item.color}15`,
                    boxShadow: `0 0 15px ${item.color}20`,
                  }}
                >
                  <Zap className="h-5 w-5" style={{ color: item.color }} />
                </div>
                <div>
                  <h3
                    className="text-sm font-bold tracking-wide"
                    style={{
                      color: item.color,
                      textShadow: `0 0 10px ${item.color}60`,
                      fontFamily: "monospace",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - System Login */}
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
                  background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
                  boxShadow: "0 0 20px rgba(0, 212, 255, 0.3)",
                }}
              >
                <Zap className="h-4 w-4 text-white" />
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
              SYSTEM LOGIN
            </h1>
            <p className="mt-1 text-sm" style={{ color: "rgba(0, 212, 255, 0.4)" }}>
              Verify your identity to enter the gate
            </p>
          </div>

          <GoogleOAuthButton />

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
              }}
            >
              [ERROR] {error}
            </motion.div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock className="absolute right-3 top-9 h-4 w-4" style={{ color: "rgba(0, 212, 255, 0.4)" }} />
            </div>

            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm transition-colors"
                style={{ color: "#00d4ff" }}
                onMouseEnter={(e) => (e.currentTarget.style.textShadow = "0 0 10px rgba(0, 212, 255, 0.5)")}
                onMouseLeave={(e) => (e.currentTarget.style.textShadow = "none")}
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full relative overflow-hidden"
              size="lg"
              isLoading={isLoading}
              style={{
                background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
                boxShadow: "0 0 20px rgba(0, 212, 255, 0.3), 0 0 40px rgba(0, 212, 255, 0.1)",
                border: "1px solid rgba(0, 212, 255, 0.3)",
                fontFamily: "monospace",
                letterSpacing: "0.1em",
              }}
            >
              ENTER GATE
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Not yet awakened?{" "}
            <Link
              to="/register"
              className="font-semibold transition-colors"
              style={{ color: "#00d4ff" }}
              onMouseEnter={(e) => (e.currentTarget.style.textShadow = "0 0 10px rgba(0, 212, 255, 0.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.textShadow = "none")}
            >
              Awaken now
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
