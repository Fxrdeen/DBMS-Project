"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Menu, X, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useRouter } from "next/navigation";
export default function ResponsiveNavbar({ user }: { user: User }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const router = useRouter();
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  console.log(user);
  return (
    <nav className="bg-background shadow-md dark:shadow-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors duration-300">
                Contractix
              </span>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/jobs">Find Jobs</NavLink>
              <NavLink href="/create">Post Jobs</NavLink>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </div>
          </div>

          {/* Login Button and Dark Mode Toggle */}

          <motion.div
            className="hidden md:flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {user ? (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost">
                    Welcome, {user.emailAddresses[0].emailAddress.split("@")[0]}
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">Your Profile</h4>
                      <p className="text-sm">
                        Click to view and edit your profile information.
                      </p>
                      <div className="flex items-center pt-2">
                        <Button
                          variant="outline"
                          onClick={() => router.push("/profile")}
                        >
                          Go to Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ) : (
              <Button className="bg-black hover:bg-black/90 text-primary-foreground transition-colors duration-300">
                <SignInButton>
                  <h1 className="text-white dark:text-white">Sign In</h1>
                </SignInButton>
              </Button>
            )}
            {mounted && (
              <Toggle
                aria-label="Toggle dark mode"
                pressed={theme === "dark"}
                onPressedChange={toggleTheme}
              >
                {theme === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Toggle>
            )}
          </motion.div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {mounted && (
              <Toggle
                aria-label="Toggle dark mode"
                pressed={theme === "dark"}
                onPressedChange={toggleTheme}
                className="mr-2"
              >
                {theme === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Toggle>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="text-primary hover:text-primary/80 transition-colors duration-300"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink href="/" mobile>
                Home
              </NavLink>
              <NavLink href="/about" mobile>
                About
              </NavLink>
              <NavLink href="/find-jobs" mobile>
                Find Jobs
              </NavLink>
              <NavLink href="/post-jobs" mobile>
                Post Jobs
              </NavLink>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="px-2">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-300">
                  Sign In
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({
  href,
  children,
  mobile = false,
}: {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
}) {
  const baseClasses =
    "text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 ease-in-out";
  const desktopClasses = "text-sm font-medium px-3 py-2 rounded-md";
  const mobileClasses = "block px-3 py-2 text-base font-medium rounded-md";

  return (
    <Link
      href={href}
      className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses}`}
    >
      {children}
    </Link>
  );
}
