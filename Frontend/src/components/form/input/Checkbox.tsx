import type React from "react";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;

  startDate?: string;
  endDate?: string;

  id?: string;
  className?: string;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  startDate,
  endDate,
  id,
  className = "",
  disabled = false,
}) => {
  return (
    <label
      className={`flex items-start lg:items-center gap-4 ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
    >
      {/* CHECKBOX */}
      <div className="relative mt-1 w-5 h-5">
        <input
          id={id}
          type="checkbox"
          className={`w-5 h-5 appearance-none border rounded-md
            dark:border-gray-700 border-gray-300
            checked:bg-brand-500 checked:border-transparent
            ${className}`}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />

        {/* CHULITO */}
        {checked && (
          <svg
            className="absolute inset-0 m-auto pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* TEXTO */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-4 text-sm">
        <span
          className={`font-medium ${
            checked
              ? "line-through text-gray-400"
              : "text-gray-800 dark:text-gray-200"
          }`}
        >
          {label}
        </span>

        {startDate && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Inicio: {startDate}
          </span>
        )}

        {endDate && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Fin: {endDate}
          </span>
        )}
      </div>
    </label>
  );
};

export default Checkbox;
