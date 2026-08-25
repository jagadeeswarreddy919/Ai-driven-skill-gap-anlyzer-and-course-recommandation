"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { Menu, X, ArrowRight, LayoutDashboard, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if session cookie exists
  useEffect(() => {
    fetch("/api/profile")
      .then(res => {
        if (res.ok) setIsLoggedIn(true);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsLoggedIn(false);
    router.push("/");
  };

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "About", href: "#about" },
    { name: "FAQ", href: "#faq" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <header
      className={["fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "light-glass-nav py-3.5" : "bg-transparent py-5"].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link href="/" aria-label="SkillGap AI Home">
          <Logo />
        </Link>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right: Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 transition-all duration-200 hover:scale-[1.02]"
              >
                <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl transition-all border border-rose-200 flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-xs hover:bg-slate-50 transition-all"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 transition-all duration-200 hover:scale-[1.02]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden shadow-xl"
          >
            <div className="px-6 py-6 space-y-4 flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base text-slate-800 font-medium py-1"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center text-sm font-bold text-white bg-indigo-600 py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                    </Link>
                    <button
                      onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                      className="w-full text-center text-xs font-bold text-rose-600 py-2.5 rounded-xl border border-rose-200 bg-rose-50 flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center text-sm font-semibold text-slate-700 py-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center text-sm font-semibold text-white bg-indigo-600 py-2.5 rounded-xl shadow-md"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};