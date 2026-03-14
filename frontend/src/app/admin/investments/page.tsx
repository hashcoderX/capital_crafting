"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function calculateYearsFromDateRange(startDate: string, endDate: string): number {
  if (!startDate || !endDate) {
    return 0;
  }

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return 0;
  }

  const diffMs = end.getTime() - start.getTime();
  const days = diffMs / (1000 * 60 * 60 * 24);

  return days / 365;
}

function calculateReturnAmount(
  amount: string,
  annualRate: string,
  startDate: string,
  endDate: string,
): string {
  const principal = Number(amount);
  const rate = Number(annualRate);

  if (!Number.isFinite(principal) || principal <= 0 || !Number.isFinite(rate) || rate < 0) {
    return "";
  }

  const years = calculateYearsFromDateRange(startDate, endDate);

  if (years <= 0) {
    return "";
  }

  const total = principal * (1 + (rate / 100) * years);

  return total.toFixed(2);
}

function buildAgreedTimeRange(startDate: string, endDate: string): string {
  if (!startDate || !endDate) {
    return "";
  }

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return "";
  }

  const diffMs = end.getTime() - start.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const approxMonths = (totalDays / 30.4375).toFixed(1);

  return `${startDate} to ${endDate} (${approxMonths} months)`;
}

type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer";
};

type CustomerOption = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer";
};

type InvestmentRecord = {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  contact_address?: string | null;
  investment_topic: string;
  investment_amount: string;
  agreed_interest_rate: string;
  return_amount: string;
  agreed_time_range: string;
  notes?: string | null;
  certificate_code?: string | null;
  certificate_pdf_url?: string | null;
  balance_confirmation_pdf_url?: string | null;
  certificate_qr_url?: string | null;
  created_at: string;
};

type InvestmentFormState = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  contact_address: string;
  investment_topic: string;
  investment_amount: string;
  agreed_interest_rate: string;
  return_amount: string;
  start_date: string;
  end_date: string;
  agreed_time_range: string;
  notes: string;
};

export default function AdminInvestmentsPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [investments, setInvestments] = useState<InvestmentRecord[]>([]);
  const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>([]);
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [submittingInvestment, setSubmittingInvestment] = useState(false);
  const [investmentForm, setInvestmentForm] = useState<InvestmentFormState>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    contact_address: "",
    investment_topic: "",
    investment_amount: "",
    agreed_interest_rate: "",
    return_amount: "",
    start_date: "",
    end_date: "",
    agreed_time_range: "",
    notes: "",
  });

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

  const reloadInvestments = async (currentUser: SessionUser) => {
    const response = await fetch("http://localhost:8000/api/admin/investments", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-User-Email": currentUser.email,
        "X-User-Role": currentUser.role,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || "Unable to load investments.");
    }

    setInvestments(data.investments || []);
  };

  const reloadCustomers = async (currentUser: SessionUser) => {
    const response = await fetch("http://localhost:8000/api/admin/customers", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-User-Email": currentUser.email,
        "X-User-Role": currentUser.role,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || "Unable to load customers.");
    }

    const users = (data?.users || []) as CustomerOption[];
    const onlyCustomers = users
      .filter((row) => row.role === "customer")
      .sort((a, b) => a.name.localeCompare(b.name));

    setCustomerOptions(onlyCustomers);
  };

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([reloadInvestments(user), reloadCustomers(user)]);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected error occurred.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  useEffect(() => {
    const computedReturn = calculateReturnAmount(
      investmentForm.investment_amount,
      investmentForm.agreed_interest_rate,
      investmentForm.start_date,
      investmentForm.end_date,
    );
    const timeRange = buildAgreedTimeRange(investmentForm.start_date, investmentForm.end_date);

    setInvestmentForm((prev) => {
      if (prev.return_amount === computedReturn && prev.agreed_time_range === timeRange) {
        return prev;
      }

      return {
        ...prev,
        return_amount: computedReturn,
        agreed_time_range: timeRange,
      };
    });
  }, [
    investmentForm.investment_amount,
    investmentForm.agreed_interest_rate,
    investmentForm.start_date,
    investmentForm.end_date,
  ]);

  const handleInvestmentInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setInvestmentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextEmail = event.target.value;
    setSelectedCustomerEmail(nextEmail);

    if (!nextEmail) {
      setInvestmentForm((prev) => ({
        ...prev,
        customer_name: "",
        customer_email: "",
      }));
      return;
    }

    const matched = customerOptions.find((customer) => customer.email === nextEmail);

    if (!matched) {
      return;
    }

    setInvestmentForm((prev) => ({
      ...prev,
      customer_name: matched.name,
      customer_email: matched.email,
    }));
  };

  const handleCreateInvestment = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) return;

    if (!investmentForm.start_date || !investmentForm.end_date) {
      setError("Please select both start date and end date.");
      return;
    }

    if (investmentForm.end_date <= investmentForm.start_date) {
      setError("End date must be after start date.");
      return;
    }

    setSubmittingInvestment(true);
    setActionMessage(null);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/admin/investments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-User-Email": user.email,
          "X-User-Role": user.role,
        },
        body: JSON.stringify(investmentForm),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (data?.errors) {
          const firstError = Object.values<string[]>(data.errors)[0]?.[0];
          throw new Error(firstError || "Unable to register investment.");
        }
        throw new Error(data?.message || "Unable to register investment.");
      }

      setActionMessage("Investment registered successfully.");
      setSelectedCustomerEmail("");
      setInvestmentForm({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        contact_address: "",
        investment_topic: "",
        investment_amount: "",
        agreed_interest_rate: "",
        return_amount: "",
        start_date: "",
        end_date: "",
        agreed_time_range: "",
        notes: "",
      });

      await reloadInvestments(user);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error occurred.";
      setError(message);
    } finally {
      setSubmittingInvestment(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-400">
              CapitalCrafting Admin
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight">Investments</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="rounded-full border border-slate-700 px-4 py-2 text-xs font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-900"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
        {loading && <p className="text-sm text-slate-300">Loading investments...</p>}

        {error && (
          <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </p>
        )}

        {actionMessage && !error && (
          <p className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {actionMessage}
          </p>
        )}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm shadow-slate-950/40">
          <h2 className="text-sm font-semibold text-slate-50">Register Investment</h2>
          <p className="mt-1 text-xs text-slate-400">
            Capture customer details, contact details, agreed interest, return amount,
            and date range.
          </p>

          <form onSubmit={handleCreateInvestment} className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-300" htmlFor="selected_customer">
                Select Customer
              </label>
              <select
                id="selected_customer"
                value={selectedCustomerEmail}
                onChange={handleCustomerSelect}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
              >
                <option value="">-- Select existing customer --</option>
                {customerOptions.map((customer) => (
                  <option key={customer.id} value={customer.email}>
                    {customer.name} ({customer.email})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-slate-400">
                Selecting a customer will auto-fill name and email.
              </p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300" htmlFor="customer_name">
                Customer Name
              </label>
              <input
                id="customer_name"
                name="customer_name"
                value={investmentForm.customer_name}
                onChange={handleInvestmentInputChange}
                required
                readOnly={Boolean(selectedCustomerEmail)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300" htmlFor="customer_email">
                Customer Email
              </label>
              <input
                id="customer_email"
                name="customer_email"
                type="email"
                value={investmentForm.customer_email}
                onChange={handleInvestmentInputChange}
                required
                readOnly={Boolean(selectedCustomerEmail)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300" htmlFor="customer_phone">
                Contact Phone
              </label>
              <input
                id="customer_phone"
                name="customer_phone"
                value={investmentForm.customer_phone}
                onChange={handleInvestmentInputChange}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300" htmlFor="contact_address">
                Contact Address
              </label>
              <input
                id="contact_address"
                name="contact_address"
                value={investmentForm.contact_address}
                onChange={handleInvestmentInputChange}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300" htmlFor="investment_topic">
                Investment Topic
              </label>
              <input
                id="investment_topic"
                name="investment_topic"
                value={investmentForm.investment_topic}
                onChange={handleInvestmentInputChange}
                required
                placeholder="FD, Agarwood, Software Dividend, etc."
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300" htmlFor="investment_amount">
                Investment Amount (LKR)
              </label>
              <input
                id="investment_amount"
                name="investment_amount"
                type="number"
                min="0"
                step="0.01"
                value={investmentForm.investment_amount}
                onChange={handleInvestmentInputChange}
                required
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300" htmlFor="agreed_interest_rate">
                Annual Interest Rate (%)
              </label>
              <input
                id="agreed_interest_rate"
                name="agreed_interest_rate"
                type="number"
                min="0"
                step="0.01"
                value={investmentForm.agreed_interest_rate}
                onChange={handleInvestmentInputChange}
                required
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300" htmlFor="return_amount">
                Return Amount (LKR) - Auto Calculated
              </label>
              <input
                id="return_amount"
                name="return_amount"
                type="number"
                min="0"
                step="0.01"
                value={investmentForm.return_amount}
                readOnly
                required
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Formula: `return = principal + (principal x annual rate x time in years)`.
              </p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300" htmlFor="start_date">
                Start Date
              </label>
              <input
                id="start_date"
                name="start_date"
                type="date"
                value={investmentForm.start_date}
                onChange={handleInvestmentInputChange}
                required
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Backdated start dates are allowed.
              </p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300" htmlFor="end_date">
                End Date
              </label>
              <input
                id="end_date"
                name="end_date"
                type="date"
                value={investmentForm.end_date}
                min={investmentForm.start_date || undefined}
                onChange={handleInvestmentInputChange}
                required
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-300" htmlFor="agreed_time_range">
                Agreed Time Range (auto)
              </label>
              <input
                id="agreed_time_range"
                name="agreed_time_range"
                value={investmentForm.agreed_time_range}
                readOnly
                required
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-300" htmlFor="notes">
                Notes (optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={investmentForm.notes}
                onChange={handleInvestmentInputChange}
                rows={3}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submittingInvestment}
                className="rounded-full bg-emerald-500 px-5 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submittingInvestment ? "Registering..." : "Register Investment"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm shadow-slate-950/40">
          <h2 className="text-sm font-semibold text-slate-50">Registered Investments</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="px-3 py-2 font-medium">Customer</th>
                  <th className="px-3 py-2 font-medium">Contact</th>
                  <th className="px-3 py-2 font-medium">Topic</th>
                  <th className="px-3 py-2 font-medium">Amount</th>
                  <th className="px-3 py-2 font-medium">Interest</th>
                  <th className="px-3 py-2 font-medium">Return</th>
                  <th className="px-3 py-2 font-medium">Time Range</th>
                  <th className="px-3 py-2 font-medium">Certificate</th>
                  <th className="px-3 py-2 font-medium">Balance Letter</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((investment) => (
                  <tr key={investment.id} className="border-b border-slate-800/70">
                    <td className="px-3 py-2 text-slate-100">
                      <div>{investment.customer_name}</div>
                      <div className="text-slate-400">{investment.customer_email}</div>
                    </td>
                    <td className="px-3 py-2 text-slate-300">
                      <div>{investment.customer_phone || "-"}</div>
                      <div className="text-slate-400">{investment.contact_address || "-"}</div>
                    </td>
                    <td className="px-3 py-2 text-slate-300">{investment.investment_topic}</td>
                    <td className="px-3 py-2 text-slate-300">LKR {investment.investment_amount}</td>
                    <td className="px-3 py-2 text-slate-300">{investment.agreed_interest_rate}%</td>
                    <td className="px-3 py-2 text-emerald-300">LKR {investment.return_amount}</td>
                    <td className="px-3 py-2 text-slate-300">{investment.agreed_time_range}</td>
                    <td className="px-3 py-2 text-slate-300">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-400">
                          {investment.certificate_code || "Pending"}
                        </span>
                        {investment.certificate_pdf_url ? (
                          <a
                            href={investment.certificate_pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-medium text-emerald-300 hover:text-emerald-200"
                          >
                            Download PDF
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-500">Not available</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-slate-300">
                      {investment.balance_confirmation_pdf_url ? (
                        <a
                          href={investment.balance_confirmation_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-medium text-emerald-300 hover:text-emerald-200"
                        >
                          Download Balance PDF
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-500">Not available</span>
                      )}
                    </td>
                  </tr>
                ))}
                {investments.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-3 py-4 text-center text-slate-400">
                      No investments registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
