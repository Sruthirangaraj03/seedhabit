import { useState, useEffect, useCallback, useRef } from "react";

const TIMERS_KEY = "seedhabit_quest_timers";
const TARGETS_KEY = "seedhabit_quest_targets";
const RESULTS_KEY = "seedhabit_quest_results";

export interface TimerState {
  habitId: number;
  startedAt: number; // timestamp
  isRunning: boolean;
}

export interface TimerResult {
  habitId: number;
  targetMinutes: number;
  actualSeconds: number;
  accuracy: number;
  date: string; // ISO date
}

function loadTimers(): Record<number, TimerState> {
  try {
    const stored = localStorage.getItem(TIMERS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveTimers(timers: Record<number, TimerState>) {
  localStorage.setItem(TIMERS_KEY, JSON.stringify(timers));
}

function loadTargets(): Record<number, number> {
  try {
    const stored = localStorage.getItem(TARGETS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveTargets(targets: Record<number, number>) {
  localStorage.setItem(TARGETS_KEY, JSON.stringify(targets));
}

function loadResults(): TimerResult[] {
  try {
    const stored = localStorage.getItem(RESULTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveResults(results: TimerResult[]) {
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
}

export function calculateAccuracy(targetMinutes: number, actualSeconds: number): number {
  if (targetMinutes <= 0) return 100;
  const targetSeconds = targetMinutes * 60;
  const deviation = Math.abs(actualSeconds - targetSeconds);
  const accuracy = Math.max(0, 100 - (deviation / targetSeconds) * 100);
  return Math.round(accuracy * 10) / 10;
}

export function formatElapsed(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function useQuestTimer(habitId: number) {
  const [timers, setTimers] = useState(loadTimers);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const timer = timers[habitId];
  const isRunning = timer?.isRunning ?? false;

  // Target duration management
  const getTarget = useCallback((id: number): number => {
    return loadTargets()[id] ?? 0;
  }, []);

  const setTarget = useCallback((id: number, minutes: number) => {
    const targets = loadTargets();
    targets[id] = minutes;
    saveTargets(targets);
  }, []);

  // Update elapsed time
  useEffect(() => {
    if (isRunning && timer) {
      const updateElapsed = () => {
        const now = Date.now();
        setElapsed(Math.floor((now - timer.startedAt) / 1000));
      };
      updateElapsed();
      intervalRef.current = setInterval(updateElapsed, 1000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      setElapsed(0);
    }
  }, [isRunning, timer]);

  const startTimer = useCallback(() => {
    const updated = { ...loadTimers() };
    updated[habitId] = {
      habitId,
      startedAt: Date.now(),
      isRunning: true,
    };
    saveTimers(updated);
    setTimers(updated);
  }, [habitId]);

  const stopTimer = useCallback((): TimerResult | null => {
    const current = loadTimers()[habitId];
    if (!current?.isRunning) return null;

    const actualSeconds = Math.floor((Date.now() - current.startedAt) / 1000);
    const targetMinutes = getTarget(habitId);
    const accuracy = calculateAccuracy(targetMinutes, actualSeconds);

    const result: TimerResult = {
      habitId,
      targetMinutes,
      actualSeconds,
      accuracy,
      date: new Date().toISOString().split("T")[0],
    };

    // Save result
    const results = loadResults();
    results.unshift(result);
    // Keep last 100 results
    saveResults(results.slice(0, 100));

    // Remove timer
    const updated = { ...loadTimers() };
    delete updated[habitId];
    saveTimers(updated);
    setTimers(updated);
    setElapsed(0);

    return result;
  }, [habitId, getTarget]);

  const cancelTimer = useCallback(() => {
    const updated = { ...loadTimers() };
    delete updated[habitId];
    saveTimers(updated);
    setTimers(updated);
    setElapsed(0);
  }, [habitId]);

  const getResults = useCallback((id: number): TimerResult[] => {
    return loadResults().filter((r) => r.habitId === id);
  }, []);

  const getAverageAccuracy = useCallback((id: number): number | null => {
    const results = getResults(id);
    if (results.length === 0) return null;
    const sum = results.reduce((a, r) => a + r.accuracy, 0);
    return Math.round((sum / results.length) * 10) / 10;
  }, [getResults]);

  const targetMinutes = getTarget(habitId);

  return {
    isRunning,
    elapsed,
    targetMinutes,
    startTimer,
    stopTimer,
    cancelTimer,
    setTarget,
    getTarget,
    getResults,
    getAverageAccuracy,
    formatElapsed,
  };
}
