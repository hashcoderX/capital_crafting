"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer";
};

type CustomerInvestment = {
  id: number;
  customer_name: string;
  investment_topic: string;
  investment_amount: string;
  agreed_interest_rate: string;
  return_amount: string;
  agreed_time_range: string;
  start_date?: string | null;
  end_date?: string | null;
  status: "running" | "history";
  certificate_code?: string | null;
  certificate_pdf_url?: string | null;
  created_at: string;
};

type DashboardPayload = {
  running_investments: CustomerInvestment[];
  investment_history: CustomerInvestment[];
  summary: {
    total_investments: number;
    running_count: number;
    history_count: number;
    total_invested_lkr: number;
  };
};

function formatDate(value?: string | null): string {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export default function CustomerDashboardPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [running, setRunning] = useState<CustomerInvestment[]>([]);
  const [history, setHistory] = useState<CustomerInvestment[]>([]);
  const [summary, setSummary] = useState<DashboardPayload["summary"]>({
    total_investments: 0,
    running_count: 0,
    history_count: 0,
    total_invested_lkr: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("cc_user");

    if (!raw) {
      window.location.href = "/";
      return;
    }

    const parsed = JSON.parse(raw) as SessionUser;

    if (parsed.role === "admin") {
      window.location.href = "/admin";
      return;
    }

    if (parsed.role !== "customer") {
      window.location.href = "/";
      return;
    }

    setUser(parsed);
  }, []);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:8000/api/customer/investments", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "X-User-Email": user.email,
            "X-User-Role": user.role,
          },
        });

        const data = (await response.json().catch(() => null)) as DashboardPayload | null;

        if (!response.ok || !data) {
          throw new Error((data as { message?: string } | null)?.message || "Unable to load dashboard.");
        }

        setRunning(data.running_investments || []);
        setHistory(data.investment_history || []);
        setSummary(
          data.summary || {
            total_investments: 0,
            running_count: 0,
            history_count: 0,
            total_invested_lkr: 0,
          },
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected error occurred.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  const totalExpectedReturn = useMemo(() => {
    return [...running, ...history].reduce((sum, row) => sum + Number(row.return_amount || 0), 0);
  }, [running, history]);

  const logout = () => {
    localStorage.removeItem("cc_user");
    window.location.href = "/";
  };

  const renderTable = (rows: CustomerInvestment[], emptyText: string) => (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400">
            <th className="px-3 py-2 font-medium">Topic</th>
            <th className="px-3 py-2 font-medium">Amount</th>
            <th className="px-3 py-2 font-medium">Interest</th>
            <th className="px-3 py-2 font-medium">Return</th>
            <th className="px-3 py-2 font-medium">Start</th>
            <th className="px-3 py-2 font-medium">End</th>
            <th className="px-3 py-2 font-medium">Certificate</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((investment) => (
            <tr key={investment.id} className="border-b border-slate-800/70">
              <td className="px-3 py-2 text-slate-200">{investment.investment_topic}</td>
              <td className="px-3 py-2 text-slate-300">LKR {investment.investment_amount}</td>
              <td className="px-3 py-2 text-slate-300">{investment.agreed_interest_rate}%</td>
              <td className="px-3 py-2 text-emerald-300">LKR {investment.return_amount}</td>
              <td className="px-3 py-2 text-slate-300">{formatDate(investment.start_date)}</td>
              <td className="px-3 py-2 text-slate-300">{formatDate(investment.end_date)}</td>
              <td className="px-3 py-2 text-slate-300">
                {investment.certificate_pdf_url ? (
                  <a
                    href={investment.certificate_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-300 hover:text-emerald-200"
                  >
                    Download
                  </a>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="px-3 py-4 text-center text-slate-500">
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-400">Customer Dashboard</p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight">My Investments</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-slate-700 px-4 py-2 text-xs font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-900"
            >
              Home
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-400"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
        {loading && <p className="text-sm text-slate-300">Loading your investments...</p>}

        {error && (
          <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Total Investments</p>
                <p className="mt-2 text-xl font-semibold text-slate-50">{summary.total_investments}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Running</p>
                <p className="mt-2 text-xl font-semibold text-emerald-300">{summary.running_count}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">History</p>
                <p className="mt-2 text-xl font-semibold text-slate-50">{summary.history_count}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Total Expected Return</p>
                <p className="mt-2 text-xl font-semibold text-emerald-300">
                  LKR {totalExpectedReturn.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm shadow-slate-950/40">
              <h2 className="text-sm font-semibold text-slate-50">Running Investments</h2>
              <p className="mt-1 text-xs text-slate-400">Active investments that have not reached end date.</p>
              <div className="mt-4">{renderTable(running, "No running investments right now.")}</div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm shadow-slate-950/40">
              <h2 className="text-sm font-semibold text-slate-50">Investment History</h2>
              <p className="mt-1 text-xs text-slate-400">Completed investments and previous records.</p>
              <div className="mt-4">{renderTable(history, "No historical records yet.")}</div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
