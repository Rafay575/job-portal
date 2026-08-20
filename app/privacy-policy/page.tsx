"use client";

import {
  FaShieldAlt,
  FaUserShield,
  FaLock,
  FaChevronRight,
} from "react-icons/fa";

const sections = [
  { id: "introduction", number: "01", title: "Introduction" },
  { id: "contact-details", number: "02", title: "Contact Details" },
  {
    id: "information-we-collect",
    number: "03",
    title: "Information We Collect",
  },
  {
    id: "how-we-collect",
    number: "04",
    title: "How We Collect Information",
  },
  {
    id: "why-we-process",
    number: "05",
    title: "Why We Process Your Data",
  },
  { id: "lawful-basis", number: "06", title: "Lawful Basis" },
  {
    id: "sharing-information",
    number: "07",
    title: "Sharing Information",
  },
  {
    id: "international-transfers",
    number: "08",
    title: "International Transfers",
  },
  { id: "retention", number: "09", title: "Retention" },
  { id: "your-rights", number: "10", title: "Your Rights" },
  { id: "security", number: "11", title: "Security" },
  { id: "complaints", number: "12", title: "Complaints" },
];

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);

  if (element) {
    const offset = 100;
    const elementPosition =
      element.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: elementPosition - offset,
      behavior: "smooth",
    });
  }
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-700">
      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative overflow-hidden bg-primary text-white">
        {/* Background decoration */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="py-12 sm:py-16 lg:py-20">
            <div className="max-w-3xl">
              {/* Small label */}

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.11em] text-purple-200">
                <FaShieldAlt className="text-purple-200" />
                Privacy & Data Protection
              </div>

              {/* Heading */}

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Privacy Policy
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                This Privacy Policy explains how Hayaibu Talent collects, uses,
                stores and protects your personal information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CONTENT
      ============================================================ */}

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
          {/* ========================================================
              TABLE OF CONTENTS
          ======================================================== */}

          <aside className="lg:sticky lg:top-22 lg:h-fit">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 border-b border-slate-200 pb-4 dark:border-slate-800">
                <p className="text-xs font-extrabold uppercase tracking-widest text-primary">
                  Content
                </p>
              </div>

              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group flex items-stretch gap-2 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-white hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-primary"
                  >
                    <span className="w-6 shrink-0 text-[12px] font-bold text-primary mt-0.5">
                      {section.number}
                    </span>

                    <span className="min-w-0 flex-1">{section.title}</span>

                   
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* ========================================================
              POLICY CONTENT
          ======================================================== */}

          <article className="min-w-0 max-w-4xl">
            {/* ======================================================
                01 INTRODUCTION
            ====================================================== */}

            <section
              id="introduction"
              className="scroll-mt-24 border-b border-slate-200 pb-8 sm:pb-10"
            >
              <SectionHeading number="01" title="Introduction" />

              <p className="text-sm leading-7 text-slate-600 sm:text-[15px]">
                Hayaibu Talent Ltd is a recruitment agency and employment
                business providing permanent and temporary recruitment services.
                We process personal information in accordance with the UK GDPR
                and the Data Protection Act 2018.
              </p>
            </section>

            {/* ======================================================
                02 CONTACT DETAILS
            ====================================================== */}

            <section
              id="contact-details"
              className="scroll-mt-24 border-b border-slate-200 py-8 sm:py-10"
            >
              <SectionHeading number="02" title="Contact Details" />

              <div className="space-y-3 text-sm leading-7 text-slate-600 sm:text-[15px]">
                <p>
                  <strong className="font-bold text-slate-900">Company:</strong>{" "}
                  Hayaibu Talent Ltd
                </p>

                <p>
                  <strong className="font-bold text-slate-900">Contact:</strong>{" "}
                  Naseer Miyan
                </p>

                <p>
                  <strong className="font-bold text-slate-900">
                    Telephone:
                  </strong>{" "}
                  <a
                    href="tel:+441494211220"
                    className="text-primary hover:underline"
                  >
                    +44 20 4620 4046
                  </a>
                </p>

                <p>
                  <strong className="font-bold text-slate-900">Email:</strong>{" "}
                  <a
                    href="mailto:naseer@hayaibu.com"
                    className="break-all text-primary hover:underline"
                  >
                    naseer@hayaibu.com
                  </a>
                </p>
              </div>
            </section>

            {/* ======================================================
                03 INFORMATION WE COLLECT
            ====================================================== */}

            <section
              id="information-we-collect"
              className="scroll-mt-24 border-b border-slate-200 py-8 sm:py-10"
            >
              <SectionHeading number="03" title="Information We Collect" />

              <p className="mb-4 text-sm leading-7 text-slate-600 sm:text-[15px]">
                We may collect:
              </p>

              <BulletList
                items={[
                  "Name and contact details",
                  "CV and employment history",
                  "Qualifications and professional registrations",
                  "Right to Work documents",
                  "DBS/criminal record information where required",
                  "References",
                  "Bank details for payroll",
                  "Health/disability information where relevant",
                  "Training records",
                  "Emergency contact details",
                ]}
              />
            </section>

            {/* ======================================================
                04 HOW WE COLLECT
            ====================================================== */}

            <section
              id="how-we-collect"
              className="scroll-mt-24 border-b border-slate-200 py-8 sm:py-10"
            >
              <SectionHeading number="04" title="How We Collect Information" />

              <p className="text-sm leading-7 text-slate-600 sm:text-[15px]">
                Directly from you, job boards, referrals, referees, clients,
                publicly available professional profiles, and third-party
                recruitment partners.
              </p>
            </section>

            {/* ======================================================
                05 WHY WE PROCESS
            ====================================================== */}

            <section
              id="why-we-process"
              className="scroll-mt-24 border-b border-slate-200 py-8 sm:py-10"
            >
              <SectionHeading number="05" title="Why We Process Your Data" />

              <p className="mb-4 text-sm leading-7 text-slate-600 sm:text-[15px]">
                To:
              </p>

              <BulletList
                items={[
                  "Match you to vacancies",
                  "Submit your CV to clients (with appropriate lawful basis)",
                  "Arrange interviews",
                  "Verify identity and Right to Work",
                  "Obtain references",
                  "Process payroll",
                  "Meet legal and regulatory obligations",
                  "Improve our recruitment services",
                ]}
              />
            </section>

            {/* ======================================================
                06 LAWFUL BASIS
            ====================================================== */}

            <section
              id="lawful-basis"
              className="scroll-mt-24 border-b border-slate-200 py-8 sm:py-10"
            >
              <SectionHeading number="06" title="Lawful Basis" />

              <p className="mb-4 text-sm leading-7 text-slate-600 sm:text-[15px]">
                We rely on:
              </p>

              <BulletList
                items={[
                  "Consent",
                  "Performance of a contract",
                  "Legitimate interests",
                  "Legal obligations",
                ]}
              />

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-[15px]">
                Special category data is processed only where permitted by UK
                GDPR.
              </p>
            </section>

            {/* ======================================================
                07 SHARING INFORMATION
            ====================================================== */}

            <section
              id="sharing-information"
              className="scroll-mt-24 border-b border-slate-200 py-8 sm:py-10"
            >
              <SectionHeading number="07" title="Sharing Information" />

              <p className="text-sm leading-7 text-slate-600 sm:text-[15px]">
                We may share information with prospective employers, clients,
                payroll providers, DBS providers, training providers, HMRC,
                pension providers, regulators, legal advisers and IT providers
                where necessary.
              </p>
            </section>

            {/* ======================================================
                08 INTERNATIONAL TRANSFERS
            ====================================================== */}

            <section
              id="international-transfers"
              className="scroll-mt-24 border-b border-slate-200 py-8 sm:py-10"
            >
              <SectionHeading number="08" title="International Transfers" />

              <p className="text-sm leading-7 text-slate-600 sm:text-[15px]">
                We do not routinely transfer personal data outside the UK. Where
                transfers occur, appropriate safeguards will be implemented.
              </p>
            </section>

            {/* ======================================================
                09 RETENTION
            ====================================================== */}

            <section
              id="retention"
              className="scroll-mt-24 border-b border-slate-200 py-8 sm:py-10"
            >
              <SectionHeading number="09" title="Retention" />

              <p className="text-sm leading-7 text-slate-600 sm:text-[15px]">
                We retain data only as long as necessary and in line with legal
                and regulatory requirements, including the Conduct of Employment
                Agencies and Employment Businesses Regulations 2003 and HMRC
                obligations.
              </p>
            </section>

            {/* ======================================================
                10 YOUR RIGHTS
            ====================================================== */}

            <section
              id="your-rights"
              className="scroll-mt-24 border-b border-slate-200 py-8 sm:py-10"
            >
              <SectionHeading number="10" title="Your Rights" />

              <p className="mb-4 text-sm leading-7 text-slate-600 sm:text-[15px]">
                You have the right to:
              </p>

              <BulletList
                items={[
                  "Access your data",
                  "Correct inaccurate data",
                  "Request deletion where applicable",
                  "Restrict processing",
                  "Object to processing",
                  "Data portability",
                  "Withdraw consent where consent is relied upon",
                  "Lodge a complaint with the ICO",
                ]}
              />
            </section>

            {/* ======================================================
                11 SECURITY
            ====================================================== */}

            <section
              id="security"
              className="scroll-mt-24 border-b border-slate-200 py-8 sm:py-10"
            >
              <SectionHeading number="11" title="Security" />

              <p className="text-sm leading-7 text-slate-600 sm:text-[15px]">
                We maintain appropriate technical and organisational measures to
                protect your information from unauthorised access, loss or
                misuse.
              </p>
            </section>

            {/* ======================================================
                12 COMPLAINTS
            ====================================================== */}

            <section id="complaints" className="scroll-mt-24 pt-8 sm:pt-10">
              <SectionHeading number="12" title="Complaints" />

              <p className="text-sm leading-7 text-slate-600 sm:text-[15px]">
                If you have any concerns, contact 
                <a
                  href="tel:+441494211220"
                  className="text-primary hover:underline"
                >
                  {" "} +44 20 4620 4046
                </a>{" "}
                or{" "}
                <a
                  href="mailto:info@hayaibutalent.com"
                  className="break-all text-primary hover:underline"
                >
                  info@hayaibutalent.com
                </a>
                . You may also complain to the Information Commissioner's Office
                (ICO) via{" "}
                <a
                  href="https://www.ico.org.uk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  www.ico.org.uk
                </a>{" "}
                or telephone 0303 123 1113.
              </p>

             
            </section>
          </article>
        </div>
      </section>
    </main>
  );
}

/* ================================================================
   SECTION HEADING
================================================================ */

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-extrabold text-white">
        {number}
      </div>

      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          {title}
        </h2>
      </div>
    </div>
  );
}

/* ================================================================
   BULLET LIST
================================================================ */

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li
          key={item}
          className="relative pl-6 text-sm leading-7 text-slate-600 sm:text-[15px]"
        >
          <span className="absolute left-1.5 top-[11px] h-1.5 w-1.5 rounded-full bg-primary" />

          {item}
        </li>
      ))}
    </ul>
  );
}
