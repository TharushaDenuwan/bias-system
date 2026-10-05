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
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";

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
    <footer className="w-full bg-slate-950 text-slate-300 border-t border-slate-800/80 relative overflow-hidden">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-600/5 blur-[140px] pointer-events-none" />

      {/* Top Section: Research Digest Newsletter */}
      <div className="border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Broadcast Bias Research Updates</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Subscribe to Sri Lankan Media Fairness Reports
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto leading-relaxed">
              Get notified when new monthly prime-time bulletin audits, political airtime indices,
              and fine-tuned Sinhala/Tamil NLP datasets are published.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter academic or institutional email..."
                className="bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500 text-xs h-10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              <Button
                type="submit"
                className="h-10 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs px-5 shrink-0"
              >
                {subscribed ? (
                  <span className="flex items-center gap-1 text-slate-950 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Subscribed!
                  </span>
                ) : (
                  "Subscribe to Reports"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Column 1: Project Identity & Scope (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                MediaBias<span className="text-cyan-400">.LK</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              An advanced machine learning framework for quantifying political slant, airtime skewness,
              and sentiment framing in Sri Lankan television news broadcasts across Sinhala, Tamil, and English.
            </p>

            {/* Academic Credential Badges */}
            <div className="pt-1 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-400">
                  IIT Sri Lanka
                </span>
                <span>Informatics Institute of Technology</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-blue-400">
                  UoW
                </span>
                <span>University of Westminster (UK)</span>
              </div>
            </div>
          </div>

          {/* Column 2: Monitored Broadcasters */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-cyan-400" />
              Monitored Channels
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/#channels" className="hover:text-cyan-300 transition-colors">
                  Ada Derana 24 (අද දෙරණ)
                </Link>
              </li>
              <li>
                <Link href="/#channels" className="hover:text-cyan-300 transition-colors">
                  Hiru News (හිරු News)
                </Link>
              </li>
              <li>
                <Link href="/#channels" className="hover:text-cyan-300 transition-colors">
                  Sirasa News 1st (සිරස)
                </Link>
              </li>
              <li>
                <Link href="/#channels" className="hover:text-cyan-300 transition-colors">
                  ITN News (ස්වාධීන රූපවාහිනිය)
                </Link>
              </li>
              <li>
                <Link href="/#channels" className="hover:text-cyan-300 transition-colors">
                  SLRC Rupavahini (රූපවාහිනී)
                </Link>
              </li>
              <li>
                <Link href="/#channels" className="hover:text-cyan-300 transition-colors">
                  Swarnavahini Live @ 8
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: ML Pipeline & Methodology */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
              Machine Learning
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/#airtime" className="hover:text-cyan-300 transition-colors">
                  Audio & Video Speech Diarization
                </Link>
              </li>
              <li>
                <Link href="/#sentiment" className="hover:text-cyan-300 transition-colors">
                  Aspect-Based Sentiment (RoBERTa)
                </Link>
              </li>
              <li>
                <Link href="/#channels" className="hover:text-cyan-300 transition-colors">
                  Multilingual Whisper ASR
                </Link>
              </li>
              <li>
                <Link href="/#channels" className="hover:text-cyan-300 transition-colors">
                  Fairness Index & Gini Metric
                </Link>
              </li>
              <li>
                <Link href="/#classifier" className="hover:text-cyan-300 transition-colors">
                  Temporal Bias Forecasting
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-300 transition-colors">
                  Research Methodology
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Ethics, Data & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Ethics & Research
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/about" className="hover:text-cyan-300 transition-colors">
                  Ethical AI & Impartiality Policy
                </Link>
              </li>
              <li>
                <Link href="/article" className="hover:text-cyan-300 transition-colors">
                  Research Publications & Articles
                </Link>
              </li>
              <li>
                <Link href="/legal" className="hover:text-cyan-300 transition-colors">
                  Data Privacy & Copyright
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-300 transition-colors">
                  Contact Research Team
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-cyan-300 transition-colors">
                  Researcher Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Research Disclaimer */}
      <div className="border-t border-slate-800/80 bg-slate-950/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <p>
                © 2026 Machine Learning-Based Bias Analysis and Prediction of Sri Lankan Television News.
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Developed as a BEng / BSc Final Year Project (FYP) at Informatics Institute of Technology (IIT).
              </p>
            </div>

            <div className="flex items-center gap-5 text-xs text-slate-400">
              <Link href="/legal" className="hover:text-slate-200 transition-colors">
                Research Ethics
              </Link>
              <span>•</span>
              <Link href="/legal" className="hover:text-slate-200 transition-colors">
                Terms of Use
              </Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-slate-200 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
