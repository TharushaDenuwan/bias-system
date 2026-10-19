"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Scale,
  BrainCircuit,
  Tv,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-[#001E2B] text-[#89989F] border-t border-[#1C2D38] relative overflow-hidden">

      {/* Newsletter section */}
      <div className="border-b border-[#1C2D38] bg-[#0D1F28]">
        <div className="w-full max-w-[1720px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0D2D1A] border border-[#1C4D2A] text-[10px] font-semibold text-[#00ED64] uppercase tracking-widest mb-3">
              <Sparkles className="w-3 h-3" />
              Research Updates
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Subscribe to Sri Lankan Media Fairness Reports
            </h3>
            <p className="text-xs text-[#5C6C75] mt-2 max-w-lg mx-auto leading-relaxed">
              Get notified when new monthly prime-time bulletin audits, political airtime indices,
              and fine-tuned Sinhala/Tamil NLP datasets are published.
            </p>

            <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter academic or institutional email..."
                className="flex-1 h-10 px-4 rounded-md bg-[#001E2B] border border-[#1C2D38] text-white placeholder-[#3D5A6A] text-xs focus:outline-none focus:border-[#2D4A5A] focus:ring-1 focus:ring-[#00ED64]/30 transition"
              />
              <button
                type="submit"
                className="h-10 px-5 rounded-md bg-[#00ED64] text-[#001E2B] font-semibold text-xs hover:bg-[#00D957] transition-colors shrink-0 cursor-pointer"
              >
                {subscribed ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Subscribed!
                  </span>
                ) : "Subscribe to Reports"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer links */}
      <div className="w-full max-w-[1720px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">

          {/* Column 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00ED64] flex items-center justify-center">
                <Scale className="w-4 h-4 text-[#001E2B]" />
              </div>
              <span className="font-semibold text-base text-white">
                MediaBias<span className="text-[#00ED64]">.LK</span>
              </span>
            </Link>

            <p className="text-xs text-[#5C6C75] leading-relaxed max-w-sm">
              An advanced machine learning framework for quantifying political slant, airtime skewness,
              and sentiment framing in Sri Lankan television news broadcasts.
            </p>

            <div className="flex flex-col gap-2 pt-1">
              {[
                { badge: "IIT", label: "Informatics Institute of Technology" },
                { badge: "UoW", label: "University of Westminster (UK)" },
              ].map((item) => (
                <div key={item.badge} className="flex items-center gap-2 text-xs text-[#5C6C75]">
                  <span className="px-2 py-0.5 rounded bg-[#112733] border border-[#1C2D38] text-[10px] font-mono text-[#89989F]">
                    {item.badge}
                  </span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Monitored Channels */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#89989F] flex items-center gap-1.5">
              <Tv className="w-3 h-3 text-[#3D5A6A]" />
              Monitored Channels
            </h4>
            <ul className="space-y-2 text-xs text-[#5C6C75]">
              {["Ada Derana 24 (අද දෙරණ)", "Hiru News (හිරු News)", "Sirasa News 1st (සිරස)", "ITN News (ස්වාධීන)", "SLRC Rupavahini", "Swarnavahini Live @ 8"].map((ch) => (
                <li key={ch}>
                  <Link href="/#channels" className="hover:text-white transition-colors">{ch}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Machine Learning */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#89989F] flex items-center gap-1.5">
              <BrainCircuit className="w-3 h-3 text-[#3D5A6A]" />
              Machine Learning
            </h4>
            <ul className="space-y-2 text-xs text-[#5C6C75]">
              {[
                { href: "/#airtime", label: "Audio & Video Speech Diarization" },
                { href: "/#sentiment", label: "Aspect-Based Sentiment (RoBERTa)" },
                { href: "/#channels", label: "Multilingual Whisper ASR" },
                { href: "/#channels", label: "Fairness Index & Gini Metric" },
                { href: "/#classifier", label: "Temporal Bias Forecasting" },
                { href: "/about", label: "Research Methodology" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Ethics & Research */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#89989F] flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-[#3D5A6A]" />
              Ethics & Research
            </h4>
            <ul className="space-y-2 text-xs text-[#5C6C75]">
              {[
                { href: "/about", label: "Ethical AI & Impartiality Policy" },
                { href: "/article", label: "Research Publications" },
                { href: "/legal", label: "Data Privacy & Copyright" },
                { href: "/contact", label: "Contact Research Team" },
                { href: "/account", label: "Researcher Portal" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1C2D38]">
        <div className="w-full max-w-[1720px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#3D5A6A]">
            <div>
              <p>© 2026 Machine Learning-Based Bias Analysis and Prediction of Sri Lankan Television News.</p>
              <p className="text-[10px] text-[#2D4A5A] mt-0.5">
                Developed as a BEng / BSc Final Year Project (FYP) at Informatics Institute of Technology (IIT).
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#5C6C75]">
              {[
                { href: "/legal", label: "Research Ethics" },
                { href: "/legal", label: "Terms of Use" },
                { href: "/contact", label: "Contact" },
              ].map((item, i, arr) => (
                <React.Fragment key={item.label}>
                  <Link href={item.href} className="hover:text-white transition-colors">{item.label}</Link>
                  {i < arr.length - 1 && <span className="text-[#1C2D38]">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
