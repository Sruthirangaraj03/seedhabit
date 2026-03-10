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

const CATEGORY_RANKS: Record<string, string> = {
  health: "S",
  fitness: "A",
  mindfulness: "S",
  learning: "A",
  productivity: "B",
  social: "B",
};

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
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? (
        <div className="rounded border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          <span className="mr-2 font-mono text-red-500">[ERROR]</span>
          {error}
        </div>
      ) : null}

      {/* Row 1: Quest Name + Frequency */}
      <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-[#00d4ff] font-display">
            QUEST DESIGNATION
          </label>
          <Input
            placeholder="e.g., Morning Exercise"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-[#00d4ff] font-display">
            FREQUENCY
          </label>
          <div className="flex gap-2">
            {(["daily", "weekly"] as const).map((freq) => (
              <button
                key={freq}
                type="button"
                className={`relative rounded-lg border px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
                  frequency === freq
                    ? "border-[#00d4ff]/50 bg-[#00d4ff]/10 text-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.15),inset_0_0_15px_rgba(0,212,255,0.05)]"
                    : "border-gray-700/50 bg-[#0a1628]/50 text-gray-500 hover:border-[#00d4ff]/20 hover:text-gray-400"
                }`}
                onClick={() => setFrequency(freq)}
              >
                {frequency === freq && (
                  <span className="absolute -top-px left-1/2 h-px w-8 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent" />
                )}
                {freq}
              </button>
            ))}
          </div>
          {frequency === "weekly" && (
            <p className="mt-1.5 font-mono text-[10px] text-[#fbbf24]/60">
              This quest will appear every day for the entire week. Complete it once to clear for the week.
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-[#00d4ff]/70 font-display">
          QUEST BRIEFING <span className="text-gray-600 normal-case tracking-normal">(optional)</span>
        </label>
        <textarea
          className="w-full rounded-lg border border-[#00d4ff]/10 bg-[#0a1628]/80 px-4 py-2.5 font-mono text-sm text-gray-200 placeholder:text-gray-600 backdrop-blur-sm transition-all duration-200 focus:border-[#00d4ff]/50 focus:outline-none focus:ring-1 focus:ring-[#00d4ff]/30 focus:shadow-[0_0_15px_rgba(0,212,255,0.1)] hover:border-[#00d4ff]/20"
          rows={2}
          placeholder="Why is this quest important to you?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Category */}
      <div>
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-[#00d4ff]/70 font-display">
          QUEST CLASS <span className="text-gray-600 normal-case tracking-normal">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`group relative rounded-lg px-3.5 py-2 font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
                category === cat
                  ? "border border-[#7c3aed]/40 bg-[#7c3aed]/10 text-[#00d4ff] shadow-[0_0_12px_rgba(124,58,237,0.15)]"
                  : "border border-gray-700/30 bg-[#0a1628]/50 text-gray-500 hover:border-[#7c3aed]/20 hover:text-gray-400"
              }`}
              onClick={() => setCategory(category === cat ? "" : cat)}
            >
              <span className={`mr-1.5 inline-block text-[9px] font-black ${
                category === cat ? "text-[#7c3aed]" : "text-gray-600"
              }`}>
                [{CATEGORY_RANKS[cat]}]
              </span>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Row: Color + Icon side by side */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-[#00d4ff]/70 font-display">
            QUEST COLOR SIGNATURE
          </label>
          <ColorPicker value={color} onChange={setColor} />
        </div>
        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-[#00d4ff]/70 font-display">
            QUEST EMBLEM
          </label>
          <IconPicker value={icon} onChange={setIcon} />
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full relative overflow-hidden rounded-lg border border-[#00d4ff]/30 bg-gradient-to-r from-[#00d4ff]/10 via-[#7c3aed]/10 to-[#00d4ff]/10 py-3 font-display text-sm font-bold uppercase tracking-[0.25em] text-[#00d4ff] shadow-[0_0_20px_rgba(0,212,255,0.1)] transition-all duration-300 hover:border-[#00d4ff]/50 hover:shadow-[0_0_30px_rgba(0,212,255,0.2)] hover:text-white"
        isLoading={isLoading}
      >
        {initialData ? "UPDATE QUEST" : "REGISTER QUEST"}
      </Button>
    </form>
  );
}
