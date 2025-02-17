"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function Theme() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return <div className="min-h-screen bg-white dark:bg-black" />;
  return (
    <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="mt-5 p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition  absolute bottom-5 right-5"
        >
        {theme === "dark" ? <Sun color="black" size={24} /> : <Moon size={24} />}
    </button>
  );
}