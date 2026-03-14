type Step = {
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    title: "Create Account",
    description:
      "Sign up in minutes with secure identity verification and onboarding.",
  },
  {
    title: "Deposit Funds",
    description:
      "Connect your bank account and deposit securely via multiple payment rails.",
  },
  {
    title: "Choose Investment Plan",
    description:
      "Select curated plans aligned with your goals, timeline, and risk profile.",
  },
  {
    title: "Earn Returns",
    description:
      "Track performance in real time as your savings generate predictable returns.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-b border-slate-800 bg-slate-950/80 py-12 sm:py-16"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mb-10 max-w-2xl space-y-2">
          <h2
            id="how-heading"
            className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl"
          >
            How CapitalCrafting works.
          </h2>
          <p className="text-sm text-slate-400 sm:text-base">
            Four simple steps to move from idle cash to a diversified savings and
            investment strategy.
          </p>
        </div>

        <ol className="grid gap-4 md:grid-cols-2">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-semibold text-emerald-400">
                {index + 1}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-50">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs text-slate-400 sm:text-[13px]">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
