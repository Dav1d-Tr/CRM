import React from "react";

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder = "Escribe aquí...",
  rows = 3,
  className = "",
  disabled = false,
  error = false,
  hint,
}) => {
  const baseClasses =
    "w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none";

  const stateClasses = disabled
    ? "bg-gray-100 text-gray-500 border-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400"
    : error
    ? "bg-transparent border-error-300 focus:border-error-300 focus:ring-3 focus:ring-error-500/10 dark:bg-gray-900 dark:border-error-800 dark:text-white/90"
    : "bg-transparent border-gray-500 text-gray-900 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800";

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`${baseClasses} ${stateClasses} ${className}`}
      />

      {hint && (
        <p
          className={`mt-2 text-sm ${
            error ? "text-error-500" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default TextArea;
