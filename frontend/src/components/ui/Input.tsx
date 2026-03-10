import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label ? (
          <label
            htmlFor={inputId}
            className="mb-1.5 block font-display text-xs font-medium uppercase tracking-wider text-gray-500"
          >
            {label}
          </label>
        ) : null}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full rounded-lg border bg-surface-400/60 px-4 py-2.5 text-sm text-gray-200 backdrop-blur-sm",
            "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "placeholder:text-gray-600",
            "focus:outline-none focus:ring-1 focus:ring-primary-400/30 focus:border-primary-400/40 focus:bg-surface-400/80",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            error
              ? "border-neon-red/40 focus:border-neon-red/60 focus:ring-neon-red/20"
              : "border-primary-400/8 hover:border-primary-400/15",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="mt-1.5 text-xs font-medium text-neon-red/80">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-gray-600">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
