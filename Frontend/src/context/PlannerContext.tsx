import { createContext, useContext, useState, useEffect } from "react";

interface PlannerContextType {
  viewMode: "columns" | "list";
  toggleViewMode: () => void;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export const PlannerProvider = ({ children }: { children: React.ReactNode }) => {
  const isMobile = window.innerWidth < 768;

  const [viewMode, setViewMode] = useState<"columns" | "list">(() => {
    if (isMobile) return "list";

    const saved = localStorage.getItem("planner-view-mode");
    return saved === "list" ? "list" : "columns";
  });

  // 🔁 Escuchar cambios de tamaño
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;

      if (mobile) {
        setViewMode("list");
      } else {
        const saved = localStorage.getItem("planner-view-mode");
        setViewMode(saved === "list" ? "list" : "columns");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleViewMode = () => {
    // 🚫 En mobile no se permite cambiar
    if (window.innerWidth < 768) return;

    setViewMode((prev) => (prev === "columns" ? "list" : "columns"));
  };

  // 💾 Guardar solo en desktop
  useEffect(() => {
    if (window.innerWidth >= 768) {
      localStorage.setItem("planner-view-mode", viewMode);
    }
  }, [viewMode]);

  return (
    <PlannerContext.Provider value={{ viewMode, toggleViewMode }}>
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error("usePlanner debe usarse dentro del PlannerProvider");
  }
  return context;
};
