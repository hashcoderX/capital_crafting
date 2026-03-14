"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import OpenAccountModal from "./OpenAccountModal";
import LoginModal from "./LoginModal";

export default function Hero() {
  const [openAccountModal, setOpenAccountModal] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [prefilledEmail, setPrefilledEmail] = useState("");
  const [hasAccount, setHasAccount] = useState(false);

  useEffect(() => {
    const syncAccountState = () => {
      const accountCreated = localStorage.getItem("cc_account_created") === "true";
      const loggedUser = localStorage.getItem("cc_user");
      setHasAccount(accountCreated || Boolean(loggedUser));
    };

    syncAccountState();
    window.addEventListener("cc:account-created", syncAccountState);
    window.addEventListener("storage", syncAccountState);

    return () => {
      window.removeEventListener("cc:account-created", syncAccountState);
      window.removeEventListener("storage", syncAccountState);
    };
  }, []);

  return (
    <>
      <section
        id="home"
        className="hero-with-particles border-b border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900"
      >
      <div className="hero-particles" aria-hidden="true">
        <span className="hero-particle" />
        <span className="hero-particle" />
        <span className="hero-particle" />
        <span className="hero-particle" />
        <span className="hero-particle" />
        <span className="hero-particle" />
        <span className="hero-particle" />
        <span className="hero-particle" />
        <span className="hero-particle" />
        <span className="hero-particle" />
        <span className="hero-particle" />
        <span className="hero-particle" />
      </div>
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-16 lg:flex-row lg:items-start lg:py-24 lg:px-6">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Regulated, secure, and audited
          </div>
          <div className="space-y-4">
            <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-slate-50 sm:text-4xl md:text-5xl">
              Secure Financial Growth
              <span className="block text-emerald-400">for Your Future.</span>
            </h1>
            <p className="max-w-xl text-balance text-sm leading-relaxed text-slate-300 sm:text-base">
              CapitalCrafting helps individuals and businesses grow their savings through
              intelligent investment plans, fixed deposits, and advisory services backed by
              bank-grade security.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            {!hasAccount && (
              <button
                type="button"
                onClick={() => setOpenAccountModal(true)}
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
              >
                Open an Account
              </button>
            )}
            <Link
              href="#plans"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-900"
            >
              View Investment Plans
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 lg:justify-start">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px] font-semibold text-emerald-400">
                256
              </span>
              <span>Bank-grade encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px] font-semibold text-emerald-400">
                24/7
              </span>
              <span>Real-time portfolio access</span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-md">
          <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-2xl shadow-emerald-500/10">
            <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
              <span>CapitalCrafting Dashboard</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-400">
                Live
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 rounded-xl bg-slate-950/60 p-4">
                <p className="text-xs text-slate-400">Total Portfolio Value</p>
                <p className="mt-2 text-2xl font-semibold text-slate-50">
                  LKR 128,450.23
                </p>
                <p className="mt-1 flex items-center gap-2 text-xs text-emerald-400">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-[11px]">
                    ↑
                  </span>
                  +8.4% this month
                </p>
              </div>
              <div className="space-y-3 rounded-xl bg-slate-950/60 p-4">
                <p className="text-xs text-slate-400">Active Plans</p>
                <p className="text-lg font-semibold text-slate-50">3</p>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  <li>Starter Savings</li>
                  <li>Growth Portfolio</li>
                  <li>Premium Yield</li>
                </ul>
              </div>
              <div className="space-y-3 rounded-xl bg-slate-950/60 p-4">
                <p className="text-xs text-slate-400">Next Payout</p>
                <p className="text-lg font-semibold text-slate-50">LKR 1,248.00</p>
                <p className="text-[11px] text-slate-400">Scheduled on 28 Mar 2026</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-3/4 rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-[11px] text-slate-300">
              <div className="rounded-lg bg-slate-950/70 p-3">
                <p className="text-slate-400">Risk</p>
                <p className="mt-1 font-semibold">Balanced</p>
              </div>
              <div className="rounded-lg bg-slate-950/70 p-3">
                <p className="text-slate-400">Strategy</p>
                <p className="mt-1 font-semibold">Long-term</p>
              </div>
              <div className="rounded-lg bg-slate-950/70 p-3">
                <p className="text-slate-400">Status</p>
                <p className="mt-1 font-semibold text-emerald-400">Secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
      <OpenAccountModal
        open={openAccountModal}
        onClose={() => setOpenAccountModal(false)}
        onAccountCreated={(email) => {
          setOpenAccountModal(false);
          setPrefilledEmail(email);
          setOpenLoginModal(true);
        }}
      />
      <LoginModal
        open={openLoginModal}
        onClose={() => {
          setOpenLoginModal(false);
          setPrefilledEmail("");
        }}
        initialEmail={prefilledEmail}
      />
    </>
  );
}
