type Feature = {
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    title: "Secure Dashboard",
    description:
      "Monitor all your accounts and plans in a single, encrypted view.",
  },
  {
    title: "Real-Time Balance Tracking",
    description:
      "Stay in sync with market movements and account activity instantly.",
  },
  {
    title: "Automated Interest Calculation",
    description:
      "Interest is calculated and applied automatically to maximize compounding.",
  },
  {
    title: "Fast Withdrawals",
    description:
      "Access your funds quickly with transparent timelines and zero surprises.",
  },
  {
    title: "24/7 Support",
    description:
      "Reach our support specialists anytime through chat, email, or phone.",
  },
  {
    title: "Advanced Security",
    description:
      "Multi-factor authentication, device fingerprinting, and anomaly detection.",
  },
];

export default function Features() {
  return (
    <section
      id="security"
      className="border-b border-slate-800 bg-slate-950 py-12 sm:py-16"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mb-10 max-w-2xl space-y-2">
          <h2
            id="features-heading"
            className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl"
          >
            A modern platform engineered for security and performance.
          </h2>
          <p className="text-sm text-slate-400 sm:text-base">
            Every interaction with CapitalCrafting is encrypted, monitored, and designed to
            protect your capital across devices and regions.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm shadow-slate-950/40"
            >
              <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-semibold text-emerald-400">
                ●
              </div>
              <h3 className="text-sm font-semibold text-slate-50">
                {feature.title}
              </h3>
              <p className="mt-2 text-xs text-slate-400 sm:text-[13px]">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
