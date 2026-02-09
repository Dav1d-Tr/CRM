// components/common/Modal.tsx

import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/40 dark:bg-black/60 flex items-center justify-center">
      <div
        className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-4xl shadow-xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-black"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
