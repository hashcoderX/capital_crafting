"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer";
};

type DashboardStats = {
  total_users: number;
  total_customers: number;
  total_admins: number;
};

export default function AdminDashboardPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("cc_user");

    if (!raw) {
      window.location.href = "/";
      return;
    }

    const parsed = JSON.parse(raw) as SessionUser;

    if (parsed.role !== "admin") {
      window.location.href = "/";
      return;
    }

    setUser(parsed);
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:8000/api/admin/dashboard", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "X-User-Email": user.email,
            "X-User-Role": user.role,
          },
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message || "Unable to load dashboard.");
        }

        setStats(data.stats);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected error occurred.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user]);

  const cards = useMemo(
    () => [
      {
        label: "Total Users",
        value: stats?.total_users ?? 0,
      },
      {
        label: "Customers",
        value: stats?.total_customers ?? 0,
      },
      {
        label: "Admins",
        value: stats?.total_admins ?? 0,
      },
    ],
    [stats],
  );

  const handleLogout = () => {
    localStorage.removeItem("cc_user");
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-400">
              CapitalCrafting Admin
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-slate-700 px-4 py-2 text-xs font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-900"
            >
              Back to site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
        {loading && (
          <p className="text-sm text-slate-300">Loading dashboard data...</p>
        )}

        {error && (
          <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <article
                  key={card.label}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm shadow-slate-950/40"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {card.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-emerald-400">
                    {card.value}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm shadow-slate-950/40">
              <h2 className="text-sm font-semibold text-slate-50">Operations</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Link
                  href="/admin/customers"
                  className="rounded-2xl border border-sky-500/40 bg-sky-500/10 p-4 transition hover:border-sky-400 hover:bg-sky-500/15"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-sky-300">
                    Customers
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-50">
                    Manage Customers
                  </p>
                  <p className="mt-1 text-xs text-slate-300">
                    Open the dedicated customers page to search users, change roles,
                    and remove customer records.
                  </p>
                </Link>

                <Link
                  href="/admin/investments"
                  className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 transition hover:border-emerald-400 hover:bg-emerald-500/15"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">
                    Investments
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-50">
                    Register and Manage Investments
                  </p>
                  <p className="mt-1 text-xs text-slate-300">
                    Open the dedicated investments page to register new investment
                    agreements and review all registered investment records.
                  </p>
                </Link>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
