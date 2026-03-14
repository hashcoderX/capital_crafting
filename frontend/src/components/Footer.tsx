import Link from "next/link";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-slate-950 py-10 text-xs text-slate-400 sm:py-12"
      aria-label="Footer"
    >
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="grid gap-8 border-t border-slate-800 pt-8 md:grid-cols-[2fr,1fr,1fr,1.5fr]">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-50">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-sm font-semibold text-emerald-400">
                CC
              </span>
              <span className="text-sm font-semibold tracking-tight">
                CapitalCrafting
              </span>
            </div>
            <p className="max-w-xs text-[11px] text-slate-400">
              CapitalCrafting is a digital savings and investment platform helping
              individuals and businesses grow capital with confidence.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
              Company
            </h3>
            <ul className="space-y-1">
              <li>
                <Link href="#about" className="hover:text-emerald-400">
                  About
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-emerald-400">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#plans" className="hover:text-emerald-400">
                  Investment Plans
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
              Legal
            </h3>
            <ul className="space-y-1">
              <li>
                <Link href="#" className="hover:text-emerald-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400">
                  Security
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
              Contact
            </h3>
            <p className="text-[11px] text-slate-400">
              support@capitalcrafting.finance
              <br />
              +1 (555) 013-2048
            </p>
            <div className="flex gap-3 text-slate-400">
              <a
                href="#"
                aria-label="Visit CapitalCrafting on LinkedIn"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 hover:border-emerald-500 hover:text-emerald-400"
              >
                in
              </a>
              <a
                href="#"
                aria-label="Visit CapitalCrafting on X (Twitter)"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 hover:border-emerald-500 hover:text-emerald-400"
              >
                x
              </a>
              <a
                href="#"
                aria-label="Visit CapitalCrafting on Facebook"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 hover:border-emerald-500 hover:text-emerald-400"
              >
                f
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-3 border-t border-slate-800 pt-4 text-[11px] text-slate-500 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} CapitalCrafting Finance. All rights reserved.
          </p>
          <p>
            CapitalCrafting is preparing for full API integration with regulated banking
            partners.
          </p>
        </div>
      </div>
    </footer>
  );
}
