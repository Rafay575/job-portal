import { ArrowLeft, Star, ShieldCheck, Check, MapPin, Heart, Users, Briefcase } from "lucide-react";
import Link from "next/link";

export default function NursingJobsPage() {
  return (
    <div className=" bg-slate-50">
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
          <p className="text-xs font-bold tracking-wide text-emerald-600">
            NURSING SPECIALISM PORTAL
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-[42px]">
            Registered Nurse Jobs in the UK
          </h1>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Explore permanent and temporary nursing opportunities across premier hospitals, 
            specialized care homes, and private medical clinics throughout the United Kingdom. 
            All vacancies require active NMC registration and dedication to exceptional patient 
            care standards. With over 580+ active nursing positions, we cover Band 5 through 
            Band 7 roles across all major specialties including ICU, A&E, Oncology, Paediatrics, 
            and Mental Health.
          </p>
        </div>

        {/* Content grid */}
        <div className="mt-8 grid grid-cols-1 gap-6">
          <aside className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nursing Requirements */}
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 fill-emerald-500 text-white" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Nursing Requirements
                  </h2>
                </div>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-sm text-slate-600 leading-relaxed">
                      Active Nursing and Midwifery Council (NMC) registration
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-sm text-slate-600 leading-relaxed">
                      Valid PIN number and good standing status
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-sm text-slate-600 leading-relaxed">
                      Relevant post-registration experience
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-sm text-slate-600 leading-relaxed">
                      Right to work in the UK
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-sm text-slate-600 leading-relaxed">
                      DBS check (Enhanced) within last 12 months
                    </span>
                  </li>
                </ul>
              </div>

              {/* Nursing Career Support */}
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-emerald-500" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Nursing Career Support
                  </h2>
                </div>
                <div className="mt-4 space-y-4">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Free NMC revalidation support and CPD tracking for all registered nurses.
                  </p>
                  <Link href="/auth/register">
                    <button
                      type="button"
                      className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 hover:cursor-pointer"
                    >
                      Register as a Nurse
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}