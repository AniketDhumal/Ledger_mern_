import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // init from localStorage or system preference
  useEffect(() => {
    const ls = localStorage.getItem("theme");
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initial = ls ? ls === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", initial);
    setDark(initial);
  }, []);

  // persist + update html class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      className="border px-3 py-1 rounded-md text-sm dark:border-slate-700"
      title={dark ? "Switch to light" : "Switch to dark"}
    >
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
