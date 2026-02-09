import React from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  placeholder = "Selecciona una opción",
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`h-11 w-full appearance-none rounded-lg border border-gray-500
        bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs
        focus:border-brand-400 focus:outline-none focus:ring-3
        focus:ring-brand-500/10
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${
          value
            ? "text-gray-800 dark:text-white/90"
            : "text-gray-400 dark:text-gray-400"
        }
        ${className}`}
    >
      <option value="" disabled>
        {placeholder}
      </option>

      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
