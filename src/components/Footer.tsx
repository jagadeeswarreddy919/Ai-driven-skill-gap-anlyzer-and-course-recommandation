"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { Github, Linkedin, Twitter, Sparkles } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-16 pb-12 relative z-10 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-100">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" aria-label="SkillGap AI Home">
              <Logo />
            </Link>

            <p className="text-sm text-slate-600 max-w-sm leading-relaxed font-medium">
              AI-powered career intelligence for understanding your skills and closing your gaps.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SkillGap AI GitHub"
                className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-xs"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SkillGap AI LinkedIn"
                className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-xs"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SkillGap AI Twitter X"
                className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-xs"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link href="/signup" className="hover:text-indigo-600 transition-colors">
                  Skill Analyzer
                </Link>
              </li>
              <li>
                <a href="#comparison" className="hover:text-indigo-600 transition-colors">
                  Target Roles
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-indigo-600 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">
                  Career Guide
                </a>
              </li>
              <li>
                <a href="#comparison" className="hover:text-indigo-600 transition-colors">
                  Skills Database
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-indigo-600 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Legal Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Company & Legal</h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <a href="#features" className="hover:text-indigo-600 transition-colors">
                  About SkillGap AI
                </a>
              </li>
              <li>
                <a href="mailto:support@skillgap.ai" className="hover:text-indigo-600 transition-colors">
                  Contact Support
                </a>
              </li>
              <li>
                <span className="hover:text-indigo-600 cursor-pointer transition-colors">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-indigo-600 cursor-pointer transition-colors">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div>© 2026 SkillGap AI. All rights reserved.</div>
          <div className="flex items-center gap-1">
            <span>Accelerating career intelligence worldwide</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
