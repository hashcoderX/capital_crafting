type Testimonial = {
  name: string;
  role: string;
  quote: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  {
    name: "Amelia Johnson",
    role: "Founder, NorthStone Studio",
    quote:
      "CapitalCrafting has become our primary treasury partner. The fixed deposits give us predictable yield without sacrificing liquidity.",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "Senior Product Manager",
    quote:
      "The dashboard is clean, intuitive, and secure. I can track my savings goals and investment performance in real time.",
    rating: 5,
  },
  {
    name: "Sarah Williams",
    role: "Independent Consultant",
    quote:
      "Having a dedicated advisor who understands my goals has transformed how I plan for retirement and near-term needs.",
    rating: 5,
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={
            index < rating
              ? "text-emerald-400"
              : "text-slate-600"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="border-b border-slate-800 bg-slate-950 py-12 sm:py-16"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mb-10 max-w-2xl space-y-2">
          <h2
            id="testimonials-heading"
            className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl"
          >
            Trusted by modern teams and individuals.
          </h2>
          <p className="text-sm text-slate-400 sm:text-base">
            Hear how customers use CapitalCrafting to manage cash, plan for the
            unexpected, and grow long-term wealth.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex h-full flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm shadow-slate-950/40"
            >
              <blockquote className="text-xs text-slate-300 sm:text-[13px]">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-100">
                    {testimonial.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-50">
                      {testimonial.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <Stars rating={testimonial.rating} />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
