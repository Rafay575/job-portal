import { ArrowLeft, ShieldCheck, Check, MapPin, Heart, Users, Briefcase, Award, Clock } from "lucide-react";
import Link from "next/link";

export default function HCAPage() {
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
          <p className="text-xs font-bold tracking-wide text-primary">
            CARE WORKER PORTAL
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-[42px]">
            Healthcare Assistant &amp; Care Worker Jobs
          </h1>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Discover rewarding care worker and support roles at residential facilities, 
            domiciliary care providers, and specialized medical centers across the UK. 
            Fast-track your application with our streamlined onboarding system. No previous 
            experience required for entry-level positions - full training provided. With 
            380+ active roles, we offer flexible shift patterns including days, nights, 
            and weekends to suit your lifestyle.
          </p>
        </div>

        {/* Content grid */}
        <div className="mt-8 grid grid-cols-1 gap-6">
          <aside className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* HCA Requirements */}
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 fill-primary text-white" />
                  <h2 className="text-lg font-bold text-slate-900">
                    HCA Requirements
                  </h2>
                </div>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-slate-600 leading-relaxed">
                      Compassionate nature and desire to help others
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-slate-600 leading-relaxed">
                      Good communication skills (English essential)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-slate-600 leading-relaxed">
                      Right to work in the UK
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-slate-600 leading-relaxed">
                      DBS check (Enhanced)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-slate-600 leading-relaxed">
                      NVQ Level 2/3 preferred but not essential
                    </span>
                  </li>
                </ul>
              </div>

              {/* Free Training Provided */}
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Free Training Provided
                  </h2>
                </div>
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    All HCA roles include free mandatory training:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="h-3.5 w-3.5 text-primary" />
                      Manual Handling
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="h-3.5 w-3.5 text-primary" />
                      Basic Life Support
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="h-3.5 w-3.5 text-primary" />
                      Safeguarding
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="h-3.5 w-3.5 text-primary" />
                      Infection Control
                    </li>
                  </ul>
                  <Link href="/user/dashboard">
                    <button
                      type="button"
                      className="mt-4 w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary hover:cursor-pointer"
                    >
                      Apply as HCA
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