type Service = {
  title: string;
  description: string;
};

const services: Service[] = [
  {
    title: "Savings Accounts",
    description:
      "Flexible, interest-bearing savings designed to preserve capital while earning stable returns.",
  },
  {
    title: "Fixed Deposits",
    description:
      "Lock in competitive, fixed rates with predictable payouts across multiple tenors.",
  },
  {
    title: "Investment Plans",
    description:
      "Curated portfolios aligned with your goals, risk appetite, and investment horizon.",
  },
  {
    title: "Financial Advisory",
    description:
      "Access certified advisors for tailored, data-driven financial planning and guidance.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="border-b border-slate-800 bg-slate-950 py-12 sm:py-16"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mb-10 max-w-2xl space-y-2">
          <h2
            id="services-heading"
            className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl"
          >
            Comprehensive financial services for every stage.
          </h2>
          <p className="text-sm text-slate-400 sm:text-base">
            From everyday savings to long-term wealth creation, CapitalCrafting provides
            the building blocks for a resilient financial future.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <article
              key={service.title}
              className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm shadow-slate-950/30 transition duration-200 hover:-translate-y-1 hover:border-emerald-500/70 hover:shadow-emerald-500/20"
            >
              <div>
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-sm font-semibold text-emerald-400">
                  LKR
                </div>
                <h3 className="text-sm font-semibold text-slate-50">
                  {service.title}
                </h3>
                <p className="mt-2 text-xs text-slate-400 sm:text-[13px]">
                  {service.description}
                </p>
              </div>
              <button
                type="button"
                className="mt-4 inline-flex items-center text-xs font-semibold text-emerald-400 transition group-hover:text-emerald-300"
              >
                Learn more
                <span aria-hidden="true" className="ml-1 text-[11px]">
                  
                  
                </span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
