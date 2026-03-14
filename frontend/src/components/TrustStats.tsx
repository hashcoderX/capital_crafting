type Stat = {
  label: string;
  value: string;
  description: string;
};

const stats: Stat[] = [
  {
    label: "Total Customers",
    value: "120k+",
    description: "Individuals and businesses trusting CapitalCrafting globally.",
  },
  {
    label: "Assets Managed",
    value: "LKR 2.4B",
    description: "Total assets managed across savings and investment plans.",
  },
  {
    label: "Years of Experience",
    value: "12+",
    description: "Institutional-grade experience in regulated financial markets.",
  },
  {
    label: "Secure Transactions",
    value: "99.99%",
    description: "Uptime and transaction reliability with multi-layer security.",
  },
];

export default function TrustStats() {
  return (
    <section
      id="about"
      className="border-b border-slate-800 bg-slate-950/80 py-12 sm:py-16"
      aria-labelledby="trust-heading"
    >
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="trust-heading"
              className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl"
            >
              Built for trust, designed to scale.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-400 sm:text-base">
              CapitalCrafting combines modern technology with regulatory best practices to
              protect your capital and optimize long-term growth.
            </p>
          </div>
          <p className="text-xs text-slate-500">
            PCI-DSS compliant 
            <span aria-hidden="true" className="mx-1">
              •
            </span>
            Encrypted at rest and in transit
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm shadow-slate-950/40"
            >
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-sky-500" />
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                {stat.label}
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-50">
                {stat.value}
              </p>
              <p className="mt-2 text-xs text-slate-400">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
