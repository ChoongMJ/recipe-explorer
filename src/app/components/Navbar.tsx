"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const isDarkTheme = theme === "dark";

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme-mode");
    const nextTheme: ThemeMode = savedTheme === "dark" ? "dark" : "light";

    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "light" ? "dark" : "light";

    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("theme-mode", nextTheme);
  };

  return (
    <nav className="border-b border-border bg-nav text-nav-foreground transition-colors">
      <div className="container m-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="font-bold text-xl">Recipe Explorer Lite</Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="md:hidden inline-flex items-center gap-3 text-sm font-medium"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
              aria-pressed={isDarkTheme}
            >
              <span>{isDarkTheme ? "Dark" : "Light"}</span>
              <span
                className={`relative inline-flex h-7 w-12 items-center rounded-full border transition-colors ${
                  isDarkTheme
                    ? "border-button bg-button"
                    : "border-border bg-surface"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full transition-transform ${
                    isDarkTheme
                      ? "translate-x-6 bg-button-foreground"
                      : "translate-x-1 bg-foreground"
                  }`}
                />
              </span>
            </button>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-3 text-sm font-medium"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
              aria-pressed={isDarkTheme}
            >
              <span>{isDarkTheme ? "Dark" : "Light"}</span>
              <span
                className={`relative inline-flex h-7 w-12 items-center rounded-full border transition-colors ${
                  isDarkTheme
                    ? "border-button bg-button"
                    : "border-border bg-surface"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full transition-transform ${
                    isDarkTheme
                      ? "translate-x-6 bg-button-foreground"
                      : "translate-x-1 bg-foreground"
                  }`}
                />
              </span>
            </button>
            <Link href="/" className="transition-colors hover:text-nav-hover">
              Home
            </Link>
            <Link href="/feedback" className="transition-colors hover:text-nav-hover">
              Feedback
            </Link>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-current/20">
            <Link 
              href="/" 
              className="block p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/feedback" 
              className="block p-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Feedback
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
} 
