"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface OpenAccountModalProps {
  open: boolean;
  onClose: () => void;
  onAccountCreated?: (email: string) => void;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export default function OpenAccountModal({
  open,
  onClose,
  onAccountCreated,
}: OpenAccountModalProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/api/open-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        if (data?.errors) {
          const firstError = Object.values<string[]>(data.errors)[0]?.[0];
          throw new Error(firstError || "Unable to create account. Please try again.");
        }
        throw new Error(data?.message || "Unable to create account. Please try again.");
      }

      const data = await response.json();
      const createdEmail = form.email;
      setSuccess(data.message ?? "Account created successfully.");
      setForm({ name: "", email: "", phone: "", password: "" });
      localStorage.setItem("cc_account_created", "true");
      window.dispatchEvent(new Event("cc:account-created"));

      setTimeout(() => {
        setError(null);
        setSuccess(null);
        onClose();

        if (onAccountCreated) {
          onAccountCreated(createdEmail);
        }
      }, 500);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error occurred.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setError(null);
    setSuccess(null);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4 backdrop-blur"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="open-account-title"
    >
      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl shadow-emerald-500/20"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-400 hover:border-slate-500 hover:text-slate-200"
          aria-label="Close open account modal"
        >
          ✕
        </button>

        <h2
          id="open-account-title"
          className="mb-1 text-lg font-semibold tracking-tight text-slate-50"
        >
          Open a CapitalCrafting account
        </h2>
        <p className="mb-4 text-xs text-slate-400">
          Enter your basic details to register. You will receive a confirmation email
          once your profile is created.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-xs font-medium text-slate-200">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-50 shadow-sm outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2"
              placeholder="e.g. Kavindu Perera"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="block text-xs font-medium text-slate-200">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-50 shadow-sm outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="phone" className="block text-xs font-medium text-slate-200">
              Phone number (optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className="block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-50 shadow-sm outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2"
              placeholder="e.g. +94 77 123 4567"
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
              value={form.password}
              onChange={handleChange}
              className="block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-50 shadow-sm outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2"
              placeholder="Minimum 8 characters"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="text-xs text-emerald-400" role="status">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}
