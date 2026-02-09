// src/components/common/ExportExcelModal.tsx
import React from "react";
import Button from "../ui/button/Button";

interface ExportExcelModalProps {
  open: boolean;
  fileName: string;
  setFileName: (v: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

const ExportExcelModal: React.FC<ExportExcelModalProps> = ({
  open,
  fileName,
  setFileName,
  onConfirm,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-900 p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Exportar a Excel
        </h2>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            Nombre del archivo
          </label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full rounded-lg border border-gray-400 px-3 py-2 text-gray-800 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Facturados"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>

          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={!fileName.trim()}
          >
            Exportar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportExcelModal;
