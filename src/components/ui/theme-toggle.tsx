"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Switch to light theme"
        className={`size-8 rounded-md ${theme === "light" ? "bg-secondary" : ""}`}
        onClick={() => setTheme("light")}
        title="Light"
      >
        <Sun className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Switch to dark theme"
        className={`size-8 rounded-md ${theme === "dark" ? "bg-secondary" : ""}`}
        onClick={() => setTheme("dark")}
        title="Dark"
      >
        <Moon className="size-4" />
      </Button>
    </div>
  );
}
