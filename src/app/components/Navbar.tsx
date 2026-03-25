"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MenuIcon, MoonStarIcon, SunIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/feedback", label: "Feedback" },
];

function ThemeSwitch({
  checked,
  onCheckedChange,
  className,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <SunIcon className="size-4 text-muted-foreground" />
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={`Switch to ${checked ? "light" : "dark"} theme`}
      />
      <MoonStarIcon className="size-4 text-muted-foreground" />
    </div>
  );
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    setIsDarkTheme(document.documentElement.classList.contains("dark"));
  }, []);

  const handleThemeChange = (checked: boolean) => {
    setIsDarkTheme(checked);
    document.documentElement.classList.toggle("dark", checked);
    window.localStorage.setItem("theme-mode", checked ? "dark" : "light");
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Recipe Explorer Lite
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeSwitch checked={isDarkTheme} onCheckedChange={handleThemeChange} />
          <Separator orientation="vertical" className="h-5" />
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeSwitch checked={isDarkTheme} onCheckedChange={handleThemeChange} />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger
              render={
                <button
                  type="button"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon-sm" }),
                    "rounded-lg"
                  )}
                  aria-label="Open navigation menu"
                />
              }
            >
              <MenuIcon className="size-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>
                  Browse recipes and share your feedback.
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-2 px-4 pb-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={buttonVariants({ variant: "ghost", size: "lg" })}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
