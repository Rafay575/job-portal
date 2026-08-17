import { ArrowLeft, Star, ShieldCheck, Check, MapPin } from "lucide-react";
import Link from "next/link";

/**
 * Uses Tailwind's built-in `purple` palette as the primary color
 * (primary / primary) — no tailwind.config.js changes required.
 * All content below is static JSX (no props, no mapping over job data).
 */

export default function DoctorJobsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mt-6 max-w-3xl">
          <p className="text-xs font-bold tracking-wide text-primary">
            SPECIALISM PORTAL
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-[42px]">
            Doctor &amp; Specialist Jobs in the UK
          </h1>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Browse elite vacancies for General Practitioners, Consultants, and
            Specialist Surgeons across private hospital groups, diagnostic
            centers, and premium medical clinics throughout the UK. All listings
            require valid GMC registration and verified clinical credentials.
            The UK private healthcare market is valued at &pound;14.8 billion in
            2026 and growing at 3.4% CAGR, creating unprecedented demand for
            specialist medical professionals.
          </p>
        </div>

        {/* Content grid */}
        <div className="mt-8 grid grid-cols-1 gap-6">
          {/* Sidebar */}
          <aside className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Typical Requirements */}
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-7 fill-primary text-white" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Typical Requirements
                  </h2>
                </div>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-sm text-slate-600 leading-relaxed">
                      Valid General Medical Council (GMC) registration with
                      licence to practise
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-sm text-slate-600 leading-relaxed">
                      Entry on the GMC Specialist Register or GP Register
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-sm text-slate-600 leading-relaxed">
                      Relevant specialty qualification / fellowship (CCT or
                      equivalent)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-sm text-slate-600 leading-relaxed">
                      Full right to work in the UK (sponsorship available for
                      qualifying tiers)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-sm text-slate-600 leading-relaxed">
                      Appraisal and revalidation documentation up to date
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-sm text-slate-600 leading-relaxed">
                      Medical indemnity insurance coverage
                    </span>
                  </li>
                </ul>
              </div>

              {/* Popular Hubs */}
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Popular Hubs
                  </h2>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-purple-100 px-3 py-2 text-sm font-medium text-primary transition"
                  >
                    London
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                  >
                    Manchester
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                  >
                    Birmingham
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                  >
                    Edinburgh
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                  >
                    Leeds
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                  >
                    Bristol
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                  >
                    Glasgow
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                  >
                    Cardiff
                  </button>
                </div>
              </div>
            </div>
            {/* CTA */}
            <div className="rounded-2xl bg-primary p-6 text-white shadow-sm">
              <h2 className="text-lg font-bold">Need Help Finding a Role?</h2>
              <p className="mt-2 text-sm text-purple-100 leading-relaxed">
                Our specialist medical recruitment consultants can help you find
                the perfect position.
              </p>
              <Link href={"/contact"}>
                <button
                  type="button"
                  className="mt-4 w-full rounded-lg bg-white px-4 py-3 hover:cursor-pointer text-sm font-bold text-primary shadow-sm transition hover:bg-purple-50"
                >
                  Speak to a Consultant
                </button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* Dependencies: npm install lucide-react */
