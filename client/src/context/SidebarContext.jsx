import { createContext, useContext, useState } from "react";

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        setIsOpen,
        collapsed,
        setCollapsed,
        toggle: () => setIsOpen((v) => !v),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

/* eslint-disable react-refresh/only-export-components */
export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}
/* eslint-enable react-refresh/only-export-components */
