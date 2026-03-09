import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Habit, HabitCreate } from "../types/habit";
import { habitService } from "../services/habitService";
import { HabitForm } from "../components/habits/HabitForm";

export function HabitEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    habitService
      .getHabit(Number(id))
      .then(({ data }) => setHabit(data))
      .catch(() => navigate("/habits"))
      .finally(() => setIsLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (data: HabitCreate) => {
    if (!id) return;
    setIsSaving(true);
    try {
      await habitService.updateHabit(Number(id), data);
      navigate(`/habits/${id}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!habit) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-xl space-y-6"
    >
      <Link to={`/habits/${id}`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-400 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Habit
      </Link>

      <div>
        <h1 className="text-xl font-bold text-white">Edit Habit</h1>
        <p className="mt-0.5 text-sm text-gray-500">Update your habit details.</p>
      </div>

      <div className="glass rounded-xl p-6">
        <HabitForm initialData={habit} onSubmit={handleSubmit} isLoading={isSaving} />
      </div>
    </motion.div>
  );
}
