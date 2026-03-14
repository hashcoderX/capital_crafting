type Plan = {
  name: string;
  rate: string;
  minimum: string;
  duration: string;
  features: string[];
  highlighted?: boolean;
};

const plans: Plan[] = [
  {
    name: "Fixed Deposit (FD) Plan",
    rate: "12.5% p.a.",
    minimum: "LKR 50,000",
    duration: "12 months",
    features: [
      "Invest as fixed deposit and earn massive interest",
      "Guaranteed returns with predictable monthly statements",
      "Capital protection with low-risk structure",
    ],
  },
  {
    name: "Agarwood Investment Plan",
    rate: "28% projected return",
    minimum: "LKR 150,000",
    duration: "24–36 months",
    highlighted: true,
    features: [
      "Invest in Agarwood cultivation and value growth",
      "Potential for massive profit at harvest and export stage",
      "Portfolio tracking and quarterly progress updates",
    ],
  },
  {
    name: "Software Venture Plan",
    rate: "Yearly dividend 15%",
    minimum: "LKR 200,000",
    duration: "3+ years",
    features: [
      "Invest in software products with recurring revenue",
      "Receive yearly dividend from net operating profits",
      "Long-term growth through scalable digital businesses",
    ],
  },
];

export default function InvestmentPlans() {
  return (
    <section
      id="plans"
      className="border-b border-slate-800 bg-slate-950/80 py-12 sm:py-16"
      aria-labelledby="plans-heading"
    >
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-2">
            <h2
              id="plans-heading"
              className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl"
            >
              Investment plans designed around your goals.
            </h2>
            <p className="text-sm text-slate-400 sm:text-base">
              Choose focused plans in FD, Agarwood, and Software sectors with clear
              return models and transparent timelines.
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Indicative rates only. Final yields may vary based on market conditions.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`flex h-full flex-col justify-between rounded-2xl border bg-slate-950/70 p-6 shadow-sm shadow-slate-950/40 transition hover:-translate-y-1 hover:shadow-emerald-500/20 ${
                plan.highlighted
                  ? "border-emerald-500/80 ring-1 ring-emerald-500/40"
                  : "border-slate-800"
              }`}
            >
              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-50">
                    {plan.name}
                  </h3>
                  {plan.highlighted && (
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                      Most Popular
                    </span>
                  )}
                </div>
                <div className="mb-4 flex items-baseline gap-2">
                  <p className="text-2xl font-semibold text-emerald-400">
                    {plan.rate}
                  </p>
                  <p className="text-xs text-slate-400">estimated annual return</p>
                </div>
                <dl className="mb-4 grid grid-cols-2 gap-3 text-xs text-slate-300">
                  <div>
                    <dt className="text-slate-400">Minimum deposit</dt>
                    <dd className="mt-1 font-medium">{plan.minimum}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Duration</dt>
                    <dd className="mt-1 font-medium">{plan.duration}</dd>
                  </div>
                </dl>
                <ul className="space-y-2 text-xs text-slate-300">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-[3px] h-3 w-3 rounded-full bg-emerald-500/70"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                className={`mt-6 inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                  plan.highlighted
                    ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
                    : "border border-slate-700 text-slate-100 hover:border-emerald-500 hover:bg-slate-900"
                }`}
              >
                Start Investment
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
