"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer";
};

type DashboardUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer";
  created_at: string;
};

type CustomerCreateForm = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "customer";
};

type CustomerEditForm = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "customer";
};

export default function AdminCustomersPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [customers, setCustomers] = useState<DashboardUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [createForm, setCreateForm] = useState<CustomerCreateForm>({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [editForm, setEditForm] = useState<CustomerEditForm>({
    name: "",
    email: "",
    password: "",
    role: "customer",
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
      throw new Error(data?.message || "Unable to load users.");
    }

    setCustomers(data.users || []);
  };

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        await reloadCustomers(user);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected error occurred.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  const handleCreateInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateCustomer = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) return;

    setCreating(true);
    setActionMessage(null);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/admin/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-User-Email": user.email,
          "X-User-Role": user.role,
        },
        body: JSON.stringify(createForm),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (data?.errors) {
          const firstError = Object.values<string[]>(data.errors)[0]?.[0];
          throw new Error(firstError || "Unable to register customer.");
        }
        throw new Error(data?.message || "Unable to register customer.");
      }

      setActionMessage(data?.message || "Customer registered successfully.");
      setCreateForm({
        name: "",
        email: "",
        password: "",
        role: "customer",
      });

      await reloadCustomers(user);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error occurred.";
      setError(message);
    } finally {
      setCreating(false);
    }
  };

  const startEditing = (targetUser: DashboardUser) => {
    setEditingUserId(targetUser.id);
    setEditForm({
      name: targetUser.name,
      email: targetUser.email,
      password: "",
      role: targetUser.role,
    });
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditForm({
      name: "",
      email: "",
      password: "",
      role: "customer",
    });
  };

  const handleUpdateCustomer = async (targetUser: DashboardUser) => {
    if (!user) return;

    setUpdatingId(targetUser.id);
    setActionMessage(null);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/customers/${targetUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-User-Email": user.email,
            "X-User-Role": user.role,
          },
          body: JSON.stringify(editForm),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (data?.errors) {
          const firstError = Object.values<string[]>(data.errors)[0]?.[0];
          throw new Error(firstError || "Unable to update customer.");
        }
        throw new Error(data?.message || "Unable to update customer.");
      }

      setActionMessage(data?.message || `Updated ${targetUser.email}.`);
      cancelEditing();
      await reloadCustomers(user);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error occurred.";
      setError(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (targetUser: DashboardUser) => {
    if (!user) return;

    const accepted = window.confirm(`Delete user ${targetUser.email}?`);
    if (!accepted) return;

    setActionMessage(null);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/api/admin/customers/${targetUser.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "X-User-Email": user.email,
          "X-User-Role": user.role,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Unable to delete user.");
      }

      setActionMessage(`Deleted ${targetUser.email}.`);
      await reloadCustomers(user);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error occurred.";
      setError(message);
    }
  };

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return customers;

    return customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(term)
        || customer.email.toLowerCase().includes(term)
        || customer.role.toLowerCase().includes(term)
      );
    });
  }, [customers, search]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-400">
              CapitalCrafting Admin
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight">Customers</h1>
          </div>
          <Link
            href="/admin"
            className="rounded-full border border-slate-700 px-4 py-2 text-xs font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-900"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
        {loading && <p className="text-sm text-slate-300">Loading customers...</p>}

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

        <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm shadow-slate-950/40">
          <h2 className="text-sm font-semibold text-slate-50">Register New Customer</h2>
          <p className="mt-1 text-xs text-slate-400">
            Create a new customer account from admin panel.
          </p>

          <form onSubmit={handleCreateCustomer} className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300" htmlFor="create-name">
                Full Name
              </label>
              <input
                id="create-name"
                name="name"
                value={createForm.name}
                onChange={handleCreateInputChange}
                required
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300" htmlFor="create-email">
                Email
              </label>
              <input
                id="create-email"
                name="email"
                type="email"
                value={createForm.email}
                onChange={handleCreateInputChange}
                required
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300" htmlFor="create-password">
                Password
              </label>
              <input
                id="create-password"
                name="password"
                type="password"
                minLength={8}
                value={createForm.password}
                onChange={handleCreateInputChange}
                required
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300" htmlFor="create-role">
                Role
              </label>
              <select
                id="create-role"
                name="role"
                value={createForm.role}
                onChange={handleCreateInputChange}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={creating}
                className="rounded-full bg-emerald-500 px-5 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {creating ? "Registering..." : "Register Customer"}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm shadow-slate-950/40">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold text-slate-50">Manage Customers</h2>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, or role"
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 sm:w-72"
            />
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Role</th>
                  <th className="px-3 py-2 font-medium">Joined</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((recentUser) => (
                  <tr key={recentUser.id} className="border-b border-slate-800/70">
                    <td className="px-3 py-2 text-slate-100">{recentUser.name}</td>
                    <td className="px-3 py-2 text-slate-300">{recentUser.email}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                          recentUser.role === "admin"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-sky-500/20 text-sky-300"
                        }`}
                      >
                        {recentUser.role}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-400">
                      {new Date(recentUser.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(recentUser)}
                          className="rounded-full border border-slate-700 px-2 py-1 text-[10px] font-medium text-slate-100 hover:border-emerald-500 hover:bg-slate-900"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(recentUser)}
                          className="rounded-full border border-rose-500/40 px-2 py-1 text-[10px] font-medium text-rose-300 hover:bg-rose-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredCustomers
                  .filter((row) => row.id === editingUserId)
                  .map((targetUser) => (
                    <tr key={`edit-${targetUser.id}`} className="bg-slate-900/70">
                      <td colSpan={5} className="px-3 py-3">
                        <div className="grid gap-3 md:grid-cols-4">
                          <input
                            name="name"
                            value={editForm.name}
                            onChange={handleEditInputChange}
                            placeholder="Name"
                            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
                          />
                          <input
                            name="email"
                            type="email"
                            value={editForm.email}
                            onChange={handleEditInputChange}
                            placeholder="Email"
                            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
                          />
                          <input
                            name="password"
                            type="password"
                            minLength={8}
                            value={editForm.password}
                            onChange={handleEditInputChange}
                            placeholder="New password (optional)"
                            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
                          />
                          <select
                            name="role"
                            value={editForm.role}
                            onChange={handleEditInputChange}
                            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
                          >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateCustomer(targetUser)}
                            disabled={updatingId === targetUser.id}
                            className="rounded-full bg-emerald-500 px-4 py-1.5 text-[11px] font-semibold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {updatingId === targetUser.id ? "Saving..." : "Save Changes"}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="rounded-full border border-slate-700 px-4 py-1.5 text-[11px] font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-900"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-center text-slate-400">
                      No users found for the current search.
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
