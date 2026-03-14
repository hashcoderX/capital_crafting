"use client";

import { useEffect, useRef } from "react";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateAccountModal({ isOpen, onClose }: CreateAccountModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleOutsideClick = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission here
    alert("Account creation logic goes here");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur"
      onClick={handleOutsideClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-account-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-[420px] rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-slate-950/50 animate-in fade-in-0 zoom-in-95 duration-200"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-slate-600 px-2 py-1 text-xs text-slate-400 hover:border-slate-500 hover:text-slate-200 transition-colors"
          aria-label="Close create account modal"
        >
          ✕
        </button>

        <h2
          id="create-account-title"
          className="mb-2 text-lg font-semibold tracking-tight text-slate-50"
        >
          Create Account
        </h2>
        <p className="mb-6 text-xs text-slate-400">
          Join CapitalCrafting to start your financial journey.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-xs font-medium text-slate-200">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="block w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-xs text-slate-50 shadow-sm outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="phone" className="block text-xs font-medium text-slate-200">
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="block w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-xs text-slate-50 shadow-sm outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 transition-colors"
              placeholder="e.g. +1 234 567 8900"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-xs font-medium text-slate-200">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="block w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-xs text-slate-50 shadow-sm outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 transition-colors"
              placeholder="Minimum 8 characters"
            />
          </div>

          <button
            type="submit"
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
