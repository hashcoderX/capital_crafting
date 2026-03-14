"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import OpenAccountModal from "./OpenAccountModal";
import LoginModal from "./LoginModal";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Investment Plans", href: "#plans" },
  { label: "Security", href: "#security" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
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
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6"
        aria-label="Main navigation"
      >
        <Link href="#home" className="flex items-center gap-2 text-slate-50">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-lg font-semibold text-emerald-400 shadow-sm">
            CC
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight md:text-base">
              CapitalCrafting
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
              Digital Finance
            </span>
          </div>
        </Link>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 text-slate-200 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="sr-only">Open main menu</span>
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-5 rounded bg-current transition-transform ${open ? "translate-y-1.5 rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 rounded bg-current transition-opacity ${open ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`block h-0.5 w-5 rounded bg-current transition-transform ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
            />
          </div>
        </button>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
          <ul className="flex items-center gap-6">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-emerald-400"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpenLoginModal(true)}
              className="rounded-full border border-slate-700 px-4 py-2 text-xs font-medium text-slate-100 transition-colors hover:border-slate-500 hover:bg-slate-900"
            >
              Login
            </button>
            {!hasAccount && (
              <button
                type="button"
                onClick={() => setOpenAccountModal(true)}
                className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
              >
                Open Account
              </button>
            )}
          </div>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-800 bg-slate-950 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 text-sm font-medium text-slate-200">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2 py-2 hover:bg-slate-900"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <button
                type="button"
                className="rounded-full border border-slate-700 px-4 py-2 text-center text-xs font-medium hover:border-slate-500 hover:bg-slate-900"
                onClick={() => {
                  setOpen(false);
                  setOpenLoginModal(true);
                }}
              >
                Login
              </button>
              {!hasAccount && (
                <button
                  type="button"
                  className="rounded-full bg-emerald-500 px-4 py-2 text-center text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
                  onClick={() => {
                    setOpen(false);
                    setOpenAccountModal(true);
                  }}
                >
                  Open Account
                </button>
              )}
            </div>
          </div>
        </div>
      )}
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
    </header>
  );
}
