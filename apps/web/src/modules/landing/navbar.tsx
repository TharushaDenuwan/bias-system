"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@repo/ui/components/button";
import {
    BarChart3,
    Binary,
    Layers,
    Menu,
    Scale,
    ShieldCheck,
    Sparkles,
    User,
    X
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Bias Detector", href: "/#detector", icon: Sparkles },
    { label: "Model Evaluation", href: "/#evaluation", icon: BarChart3 },
    { label: "NLP Pipelines", href: "/#pipelines", icon: Binary },
    { label: "Dataset & Scope", href: "/#dataset", icon: Layers },
    { label: "Research Ethics", href: "/about", icon: ShieldCheck },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const id = href.replace("/#", "");
      const elem = document.getElementById(id);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {/* Fixed High-Tech Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 h-16 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/30 text-slate-100">
        <div className="w-full max-w-[1720px] 2xl:max-w-[1760px] h-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between">
          {/* Brand / Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-200">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                    MediaBias<span className="text-cyan-400">.LK</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    ML NLP CORE
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 tracking-wide font-medium hidden md:block">
                  Sri Lankan News Bias Detection & Analysis
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-xs font-medium text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 py-1"
                >
                  <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right CTA Actions */}
          <div className="flex items-center gap-2.5">
            {/* Quick CTA to Detector */}
            <Button
              asChild
              size="sm"
              className="hidden sm:flex text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 px-3.5 h-8.5 rounded-lg shadow-sm shadow-cyan-500/20 border border-cyan-400/30"
            >
              <Link
                href="/#detector"
                onClick={(e) => scrollToSection(e, "/#detector")}
                className="flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Test Live Classifier</span>
              </Link>
            </Button>

            {/* User Account / Portal */}
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-medium text-slate-200 border-slate-700 bg-slate-900/70 hover:bg-slate-800 hover:text-white hover:border-slate-600 h-8.5 px-3 rounded-lg flex items-center gap-1.5"
              onClick={() => {
                const activeOrgId = session?.session?.activeOrganizationId;
                if (activeOrgId) {
                  router.push("/account");
                } else {
                  router.push("/account/booking-details");
                }
              }}
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">My Account</span>
            </Button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-16 left-0 w-full z-40 bg-slate-950/95 border-b border-slate-800 px-6 py-5 flex flex-col gap-3 lg:hidden backdrop-blur-xl shadow-2xl">
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
            Bias Analysis System
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  scrollToSection(e, link.href);
                }}
                className="text-sm font-medium text-slate-300 hover:text-cyan-400 py-2 border-b border-slate-800/60 flex items-center gap-2"
              >
                <Icon className="w-4 h-4 text-cyan-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2">
            <Button
              asChild
              className="w-full justify-center text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 h-9"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="/#detector" onClick={(e) => scrollToSection(e, "/#detector")}>
                <Sparkles className="w-3.5 h-3.5 mr-1.5 fill-current" />
                Analyze Sinhala News Text
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
