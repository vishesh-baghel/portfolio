"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const toggle = () => setTheme(isDark ? "light" : "dark");

  // Render placeholder with same dimensions to prevent CLS
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-label="Toggle theme"
      className="h-8 w-[52px] rounded-lg border px-3 hover:bg-[var(--color-secondary)] cursor-pointer"
      onClick={mounted ? toggle : undefined}
      title={mounted ? (isDark ? "Switch to light" : "Switch to dark") : "Toggle theme"}
    >
      {mounted ? (
        isDark ? <Sun className="size-4 text-accent" /> : <Moon className="size-4 text-accent" />
      ) : (
        <span className="size-4" />
      )}
    </Button>
  );
}
