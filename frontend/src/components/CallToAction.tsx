"use client";

import { useEffect, useState } from "react";
import OpenAccountModal from "./OpenAccountModal";
import LoginModal from "./LoginModal";

export default function CallToAction() {
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
    <section
      id="open-account"
      className="border-b border-slate-800 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-sky-500/10 py-12 sm:py-16"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="overflow-hidden rounded-3xl border border-emerald-500/40 bg-slate-950/90 px-6 py-10 shadow-xl shadow-emerald-500/20 sm:px-10 sm:py-12">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-3">
              <h2
                id="cta-heading"
                className="text-balance text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl"
              >
                Start growing your savings today.
              </h2>
              <p className="text-sm text-slate-300 sm:text-base">
                Open an account in minutes, choose your preferred plan, and put your
                capital to work with transparent, predictable returns.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {!hasAccount && (
                <button
                  type="button"
                  onClick={() => setOpenAccountModal(true)}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
                >
                  Open Account
                </button>
              )}
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-emerald-500 hover:bg-slate-900"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
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
    </section>
  );
}
