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
      {/* Fixed MongoDB-style Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 h-16 bg-[#001E2B]/90 backdrop-blur-md border-b border-[#1C2D38] text-white">
        <div className="w-full max-w-[1720px] 2xl:max-w-[1760px] h-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between">

          {/* Brand / Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-[#00ED64] flex items-center justify-center shadow-sm group-hover:bg-[#00D957] transition-colors duration-200">
                <Scale className="w-4.5 h-4.5 text-[#001E2B]" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-sm tracking-tight text-white group-hover:text-[#00ED64] transition-colors duration-200">
                  MediaBias<span className="text-[#00ED64]">.LK</span>
                </span>
                <span className="text-[10px] text-[#5C6C75] font-normal tracking-wide hidden md:block">
                  Sri Lankan News Bias Detection
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#89989F] hover:text-white hover:bg-[#112733] transition-all duration-150"
                >
                  <Icon className="w-3.5 h-3.5 opacity-70" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* CTA: Detect Bias */}
            <Link
              href="/#detector"
              onClick={(e) => scrollToSection(e, "/#detector")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#00ED64] text-[#001E2B] hover:bg-[#00D957] transition-colors duration-200 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze Text</span>
            </Link>

            {/* Account Button */}
            <button
              onClick={() => {
                const activeOrgId = session?.session?.activeOrganizationId;
                if (activeOrgId) {
                  router.push("/account");
                } else {
                  router.push("/account/booking-details");
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#89989F] hover:text-white hover:bg-[#112733] border border-[#1C2D38] hover:border-[#2D4A5A] transition-all duration-150"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Account</span>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-[#89989F] hover:text-white hover:bg-[#112733] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed top-16 left-0 w-full z-40 bg-[#001E2B] border-b border-[#1C2D38] px-5 py-4 flex flex-col gap-1 lg:hidden shadow-2xl">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[#5C6C75] mb-2 px-2">
            Navigation
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
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium text-[#89989F] hover:text-white hover:bg-[#112733] transition-all duration-150"
              >
                <Icon className="w-4 h-4 text-[#00ED64] opacity-80" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-3 mt-1 border-t border-[#1C2D38]">
            <Link
              href="/#detector"
              onClick={(e) => {
                setMobileMenuOpen(false);
                scrollToSection(e, "/#detector");
              }}
              className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-md text-sm font-semibold bg-[#00ED64] text-[#001E2B] hover:bg-[#00D957] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze Text</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
