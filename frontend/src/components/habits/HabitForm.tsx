import { useState, type FormEvent } from "react";
import type { Habit, HabitCreate } from "../../types/habit";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ColorPicker } from "./ColorPicker";
import { IconPicker } from "./IconPicker";

interface HabitFormProps {
  initialData?: Habit;
  onSubmit: (data: HabitCreate) => Promise<void>;
  isLoading: boolean;
}

const CATEGORIES = ["health", "fitness", "mindfulness", "learning", "productivity", "social"];

export function HabitForm({ initialData, onSubmit, isLoading }: HabitFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [frequency, setFrequency] = useState(initialData?.frequency ?? "daily");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [color, setColor] = useState(initialData?.color ?? "#6366f1");
  const [icon, setIcon] = useState(initialData?.icon ?? "check");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Habit name is required");
      return;
    }
    if (name.length > 100) {
      setError("Habit name must be 100 characters or less");
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        frequency,
        category: category || undefined,
        color,
        icon,
      });
    } catch {
      setError("Failed to save habit");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
          {error}
        </div>
      ) : null}

      <Input
        label="Habit Name"
        placeholder="e.g., Morning Exercise"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          Description (optional)
        </label>
        <textarea
          className="w-full rounded-xl border border-primary-500/10 bg-surface-300/50 px-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 backdrop-blur-sm transition-all duration-200 focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/30 hover:border-primary-500/20"
          rows={3}
          placeholder="Why is this habit important to you?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          Frequency
        </label>
        <div className="flex gap-3">
          {(["daily", "weekly"] as const).map((freq) => (
            <button
              key={freq}
              type="button"
              className={`rounded-xl border px-4 py-2 text-sm font-semibold capitalize transition-all duration-200 ${
                frequency === freq
                  ? "border-primary-500/30 bg-primary-500/10 text-primary-400 shadow-md shadow-primary-500/10"
                  : "border-primary-500/10 text-gray-400 hover:border-primary-500/20 hover:text-gray-300"
              }`}
              onClick={() => setFrequency(freq)}
            >
              {freq}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          Category (optional)
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-all duration-200 ${
                category === cat
                  ? "bg-primary-500/10 text-primary-400 border border-primary-500/20"
                  : "bg-surface-300/50 text-gray-400 border border-transparent hover:bg-primary-500/5 hover:text-gray-300"
              }`}
              onClick={() => setCategory(category === cat ? "" : cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <ColorPicker value={color} onChange={setColor} />
      <IconPicker value={icon} onChange={setIcon} />

      <Button type="submit" className="w-full" isLoading={isLoading}>
        {initialData ? "Update Habit" : "Create Habit"}
      </Button>
    </form>
  );
}
