"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Scale,
  Sparkles,
  User,
  Menu,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Overview", href: "/" },
    { label: "Broadcast Audit", href: "/#channels" },
    { label: "Airtime & Diarization", href: "/#airtime" },
    { label: "Entity Sentiment", href: "/#sentiment" },
    { label: "Research & About", href: "/about" },
  ];

  return (
    <>
      {/* Sticky Glass Navbar */}
      <header
        className={cn(
          "fixed top-0 left-0 w-full z-50 h-16 flex items-center justify-between px-4 lg:px-8",
          "bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20 text-slate-100"
        )}
      >
        {/* Brand / Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  MediaBias<span className="text-cyan-400">.LK</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  AI FORENSICS
                </span>
              </div>
              <span className="text-[10px] text-slate-400 tracking-wide font-medium hidden md:block">
                Sri Lankan TV News Bias Analysis
              </span>
            </div>
          </Link>
        </div>

        {/* Centered Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || (link.href.startsWith("/#") && pathname === "/");

            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-xs font-medium transition-all duration-200 hover:text-cyan-400 relative py-1",
                  isActive ? "text-cyan-400 font-semibold" : "text-slate-300 hover:text-white"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 rounded-full shadow-sm shadow-cyan-400/50" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons & My Account */}
        <div className="flex items-center gap-2.5">
          {/* Quick Interactive Tool CTA */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden sm:flex text-xs font-semibold text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10 border border-cyan-500/20"
          >
            <Link href="/#classifier" className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Test ML Classifier</span>
            </Link>
          </Button>

          {/* User's Required "My Account" Button */}
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "text-xs font-medium text-slate-200 border-slate-700 bg-slate-900/60 hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all cursor-pointer flex items-center gap-1.5"
            )}
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
            <span>My Account</span>
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
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed top-16 left-0 w-full z-40 bg-slate-950/95 border-b border-slate-800 px-6 py-4 flex flex-col gap-3 lg:hidden backdrop-blur-xl shadow-2xl">
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
            Navigation Menu
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 py-1.5 border-b border-slate-800/50"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full justify-center text-xs border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="/#classifier" className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Test ML Classifier</span>
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Spacer so page content starts below the fixed navbar */}
      <div className="h-16" />
    </>
  );
}
