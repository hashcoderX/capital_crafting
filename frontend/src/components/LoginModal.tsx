"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  initialEmail?: string;
}

interface LoginFormState {
  email: string;
  password: string;
}

export default function LoginModal({
  open,
  onClose,
  initialEmail = "",
}: LoginModalProps) {
  const [form, setForm] = useState<LoginFormState>({
    email: initialEmail,
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setForm((prev) => ({
      email: initialEmail || prev.email,
      password: "",
    }));

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
  }, [open, initialEmail, onClose]);

  if (!open) return null;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    if (submitting) return;
    setError(null);
    setSuccess(null);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (data?.errors) {
          const firstError = Object.values<string[]>(data.errors)[0]?.[0];
          throw new Error(firstError || "Unable to login. Please try again.");
        }
        throw new Error(data?.message || "Unable to login. Please try again.");
      }

      const user = data?.user;

      if (user) {
        localStorage.setItem("cc_user", JSON.stringify(user));
      }

      setSuccess(data?.message || "Login successful.");

      if (user?.role === "admin") {
        setTimeout(() => {
          window.location.href = "/admin";
        }, 300);
      } else if (user?.role === "customer") {
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 300);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error occurred.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4 backdrop-blur"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl shadow-emerald-500/20"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-400 hover:border-slate-500 hover:text-slate-200"
          aria-label="Close login modal"
        >
          ✕
        </button>

        <h2
          id="login-modal-title"
          className="mb-1 text-lg font-semibold tracking-tight text-slate-50"
        >
          Login to CapitalCrafting
        </h2>
        <p className="mb-4 text-xs text-slate-400">
          Use your account credentials to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="login-email" className="block text-xs font-medium text-slate-200">
              Email address
            </label>
            <input
              id="login-email"
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
            <label htmlFor="login-password" className="block text-xs font-medium text-slate-200">
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="block w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-50 shadow-sm outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2"
              placeholder="Enter your password"
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
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}
