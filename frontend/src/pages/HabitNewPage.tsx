import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { HabitCreate } from "../types/habit";
import { habitService } from "../services/habitService";
import { HabitForm } from "../components/habits/HabitForm";

export function HabitNewPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: HabitCreate) => {
    setIsLoading(true);
    try {
      await habitService.createHabit(data);
      navigate("/habits");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-2xl space-y-6"
    >
      <Link to="/habits" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-400 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Habits
      </Link>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
          <Sparkles className="h-5 w-5 text-primary-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Create New Habit</h1>
          <p className="text-sm text-gray-500">Define a new quest to track daily.</p>
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <HabitForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </motion.div>
  );
}
