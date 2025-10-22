import { create } from "zustand";
import { persist } from "zustand/middleware";

const useThemeStore = create(
  persist(
    (set) => ({
      theme: "dark",

      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === "light" ? "dark" : "light";

          // Update document class
          if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }

          return { theme: newTheme };
        }),

      setTheme: (theme) => {
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        set({ theme });
      },
    }),
    {
      name: "theme-storage",
    }
  )
);

// Initialize theme on load
const initializeTheme = () => {
  const stored = localStorage.getItem("theme-storage");
  if (stored) {
    const { state } = JSON.parse(stored);
    if (state.theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }
};

initializeTheme();

export default useThemeStore;
