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
            className="mb-1.5 block text-sm font-medium text-gray-300"
          >
            {label}
          </label>
        ) : null}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full rounded-xl border bg-surface-300/50 px-4 py-2.5 text-sm text-gray-200 backdrop-blur-sm transition-all duration-200",
            "placeholder:text-gray-600",
            "focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-red-500/50 focus:border-red-500"
              : "border-primary-500/10 hover:border-primary-500/20",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-sm text-gray-600">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
