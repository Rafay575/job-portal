"use client";

import {
  FaBalanceScale,
  FaChevronRight,
  FaFileContract,
  FaShieldAlt,
} from "react-icons/fa";

const sections = [
  { id: "definitions", number: "01", title: "Definitions" },
  { id: "contract", number: "02", title: "The Contract" },
  { id: "fees", number: "03", title: "Notification and Fees" },
  { id: "refunds", number: "04", title: "Refunds" },
  {
    id: "third-party",
    number: "05",
    title: "Introductions to Third Parties",
  },
  { id: "suitability", number: "06", title: "Suitability Checks" },
  {
    id: "exclusivity",
    number: "07",
    title: "Exclusivity Term",
  },
  {
    id: "information",
    number: "08",
    title: "Information to Be Provided",
  },
  {
    id: "confidentiality",
    number: "09",
    title: "Confidentiality and Data Protection",
  },
  { id: "liability", number: "10", title: "Liability" },
  { id: "notices", number: "11", title: "Notices" },
  { id: "severability", number: "12", title: "Severability" },
  {
    id: "governing-law",
    number: "13",
    title: "Governing Law and Jurisdiction",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {/* =========================================================
          HERO
      ========================================================== */}

      <section className="relative overflow-hidden bg-primary text-white">
        {/* Background decoration */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            {/* Label */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.11em] text-purple-200">
              <FaFileContract />
              Legal Information
            </div>

            {/* Title */}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Terms & Conditions
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              These Terms and Conditions govern the relationship between
              Hayaibu Talent and its clients in connection with the
              introduction and engagement of candidates.
            </p>

            
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTENT AREA
      ========================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-12">
          {/* =====================================================
              SIDEBAR
          ====================================================== */}

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
                    className="group flex items-start gap-2 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-white hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-primary"
                  >
                    <span className="w-6 shrink-0 text-[12px] font-bold text-primary mt-0.5">
                      {section.number}
                    </span>

                    <span className="min-w-0 flex-1">
                      {section.title}
                    </span>

                    <FaChevronRight className="shrink-0 text-[8px] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* =====================================================
              MAIN CONTENT
          ====================================================== */}

          <article className="min-w-0">
            {/* ===================================================
                01 DEFINITIONS
            ==================================================== */}

            <section id="definitions" className="scroll-mt-8">
              <SectionHeading number="01" title="Definitions" />

              <p className="legal-text">
                In these Terms the following definitions apply:
              </p>

              <Definition
                title="Agency"
                text="Hayaibu Talent Ltd, registered company no. 11804530, of Apollo Centre, Desborough Road, High Wycombe, England, HP11 2QW (the Agency)."
              />

              <Definition
                title="Cancellation Fee"
                text="The fee payable by the Client to the Agency when the Client withdraws an offer of Engagement made to the Candidate before the Candidate has accepted the offer, calculated in accordance with these Terms."
              />

              <Definition
                title="Candidate"
                text="The person Introduced by the Agency to the Client for an Engagement, including any officer, employee or other representative of the Candidate if the Candidate is a corporate body, and members of the Agency's own staff."
              />

              <Definition
                title="Client"
                text="The person, firm or corporate body together with any subsidiary or associated person, firm or corporate body (as the case may be) to which the Candidate is introduced."
              />

              <Definition
                title="Data Protection Laws"
                text="The Data Protection Act 1998, the General Data Protection Regulation (EU 2016/679), or any applicable statutory or regulatory provisions in force from time to time relating to the protection and transfer of personal data."
              />

              <Definition
                title="Engagement"
                text={`The engagement (including the Candidate's acceptance of the Client's offer), employment or use of the Candidate by the Client or by any third party to whom the Candidate has been introduced by the Client, on a permanent or temporary basis, whether under a contract of service or for services; under an agency, licence, franchise or partnership agreement; or any other engagement; or through a limited company of which the Candidate is an officer, employee or other representative. "Engage", "Engages" and "Engaged" are construed accordingly.`}
              />

              <Definition
                title="Introduction"
                text={`(i) The passing to the Client of a curriculum vitae or information which identifies the Candidate, or (ii) the Client's interview of a Candidate (in person, by telephone or by any other means), following the Client's instruction to the Agency to search for a Candidate, which in either case leads to an Engagement of the Candidate. "Introduces" and "Introduced" are construed accordingly.`}
              />

              <Definition
                title="Introduction Fee"
                text="The fee payable by the Client to the Agency for an Introduction resulting in an Engagement."
              />

              <Definition
                title="Losses"
                text="All losses, liabilities, damages, costs, expenses, fines, penalties or interest, whether direct, indirect, special or consequential (including, without limitation, any economic loss or other loss of profits, business or goodwill, management time and reasonable legal fees) and charges, including such items arising out of or resulting from actions, proceedings, claims and demands."
              />

              <Definition
                title="Remuneration"
                text="Gross base salary or fees, guaranteed and/or anticipated bonus and commission earnings, allowances, inducement payments, the benefit of a company car and all other payments and taxable (and, where applicable, non-taxable) emoluments payable to or receivable by the Candidate for services rendered to or on behalf of the Client or any third party. Where the Client provides a company car, a notional amount will be added to the salary to calculate the Agency's fee."
              />

              <Definition
                title="Replacement Candidate"
                text="Any Candidate Introduced by the Agency to the Client to fill the Engagement following the Introduction of another Candidate whose Engagement either did not commence or was terminated during the first 10 weeks of the Engagement."
              />

              <p className="legal-text">
                Unless the context requires otherwise, references to the
                singular include the plural and the masculine includes the
                feminine and vice versa. The headings in these Terms are for
                convenience only and do not affect their interpretation.
              </p>
            </section>

            {/* ===================================================
                02 CONTRACT
            ==================================================== */}

            <section id="contract" className="legal-section">
              <SectionHeading number="02" title="The Contract" />

              <LegalList
                items={[
                  "These Terms and the attached Schedule(s) constitute the contract between the Agency and the Client for the Introduction of permanent or contract staff (to be engaged directly by the Client), and are deemed accepted by the Client by virtue of an Introduction, the Engagement of a Candidate, or the passing by the Client of any information about a Candidate to a third party following an Introduction.",
                  "This agreement does not need to be signed to become binding on the parties. These Terms of business can be sent to the Client electronically.",
                  "These Terms contain the entire agreement between the parties and, unless otherwise agreed in writing by a director of the Agency, prevail over any other terms of business or purchase conditions put forward by the Client.",
                  "No variation or alteration to these Terms is valid unless agreed between a director of the Agency and the Client, set out in writing, with a copy of the varied terms given to the Client stating the date from which the varied terms apply.",
                  "The Agency acts as an employment agency (as defined in Section 13(2) of the Employment Agencies Act 1973) when Introducing Candidates to the Client for direct Engagement by that Client.",
                ]}
              />
            </section>

            {/* ===================================================
                03 FEES
            ==================================================== */}

            <section id="fees" className="legal-section">
              <SectionHeading number="03" title="Notification and Fees" />

              <p className="legal-text font-semibold">
                The Client agrees to:
              </p>

              <LegalList
                items={[
                  "Notify the Agency immediately of the terms of any offer of Engagement it makes to the Candidate;",
                  "Notify the Agency immediately when its offer of Engagement to the Candidate has been accepted, and provide details of the Remuneration agreed with the Candidate, together with any documentary evidence requested by the Agency; and",
                  "Pay the Introduction Fee, calculated in accordance with this clause, by the due date for payment.",
                ]}
              />

              <p className="legal-text">
                The Introduction Fee is payable if the Client Engages the
                Candidate within 6 calendar months from the date of (a) the
                Introduction, (b) the Client's withdrawal of an offer of
                Engagement, or (c) the Candidate's rejection of an offer of
                Engagement — whichever is the later. The Introduction Fee is
                payable within 7 days of the date of the Agency's invoice,
                which is rendered once the Candidate commences the Engagement,
                unless different payment terms have been agreed.
              </p>

              <p className="legal-text">
                The Introduction Fee is calculated in accordance with the Fee
                Structure Schedule below, based on the Remuneration applicable
                during the first 12 months of the Engagement:
              </p>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full min-w-[400px] text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900">
                      <th className="px-4 py-3 text-left font-bold text-slate-800 dark:text-slate-200">
                        Remuneration
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {[
                      "£0 – £20,000",
                      "£20,001 – £30,000",
                      "£30,001 – £40,000",
                      "£40,001 – £50,000",
                      "£50,001+",
                    ].map((item) => (
                      <tr
                        key={item}
                        className="border-t border-slate-200 dark:border-slate-800"
                      >
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {item}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="legal-text">
                Where the actual Remuneration is not known, the Agency will
                charge an Introduction Fee{" "}
                <strong>
                  for care/domestic/kitchen/housekeeping staff
                </strong>
                , based on its determination of the market-rate remuneration
                for the position, having regard to any information supplied by
                the Client and comparable positions in the market generally.
              </p>

              <h3 className="subheading">Additional terms</h3>

              <LegalList
                items={[
                  "Where the Engagement is agreed on a fixed-term basis of less than 12 months, the Introduction Fee applies pro-rata. If the Client extends the Engagement beyond the initial fixed term, or re-Engages the Candidate within 6 calendar months of termination of the fixed term, a further Introduction Fee applies based on the additional Remuneration — capped so the Client never pays more in total than the full 12-month fee under these Terms.",
                  "The Client's payment obligations under this clause are performed without any right of set-off, deduction, withholding or other similar rights.",
                  "VAT is charged at the standard rate on all fees where applicable.",
                  "The Agency reserves the right to charge interest under the Late Payment of Commercial Debts (Interest) Act 1998 on invoiced amounts unpaid by the due date, at 8% per annum above the Bank of England base rate, from the due date until payment.",
                  "If, after an offer of Engagement has been made, the Client withdraws it for any reason before the Candidate accepts, the Client is liable to pay the Agency a Cancellation Fee of £500.",
                  "If any Agency staff with whom the Client has had personal dealings accepts an Engagement with the Client while employed by the Agency (or within 3 months of leaving the Agency), the Client is liable to pay a fee equivalent to the Introduction Fee. No refund is available for any fee due under this provision, in any circumstances.",
                ]}
              />
            </section>

            {/* ===================================================
                04 REFUNDS
            ==================================================== */}

            <section id="refunds" className="legal-section">
              <SectionHeading number="04" title="Refunds" />

              <p className="legal-text">
                If, after an offer has been made and accepted, the Engagement
                (a) does not commence because the Candidate withdraws their
                acceptance, or (b) once commenced is terminated by either the
                Candidate or the Client (except where the Candidate is made
                redundant) before the expiry of 10 weeks from commencement,
                the Agency will refund the Introduction Fee in accordance with
                the Scale of Refunds below, subject to the conditions in this
                clause.
              </p>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full min-w-[500px] text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900">
                      <th
                        colSpan={2}
                        className="px-4 py-3 text-left font-bold text-slate-800 dark:text-slate-200"
                      >
                        Scale of Refunds — week in which the Engagement
                        terminates
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {[
                      "Non-commencement",
                      "Weeks 1 – 4",
                      "Weeks 5 – 6",
                      "Weeks 7 – 8",
                      "Weeks 9 – 10",
                    ].map((item) => (
                      <tr
                        key={item}
                        className="border-t border-slate-200 dark:border-slate-800"
                      >
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          Week
                        </td>

                        <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                          {item}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="legal-text">
                No refund is payable where the Candidate's Engagement is
                terminated (or would have terminated but for garden leave or
                payment in lieu of notice) during or after the 10th week of the
                Engagement.
              </p>

              <LegalList
                items={[
                  "To qualify for a refund, the Client must comply with the notification requirements above and must notify the Agency in writing of the termination or non-commencement within 7 days of it occurring.",
                  "The Client must exclusively give the Agency 4 to 8 weeks from the date of that notice to find one suitable Replacement Candidate based on the original specification. If no suitable Replacement Candidate is found in that window, or the Replacement Candidate's Engagement is also terminated before the expiry of 10 weeks, the Client becomes eligible for a refund, subject to the rest of this clause.",
                  "The date of termination is the date the Candidate ceases (or would have ceased) working for the Client, but for any period of garden leave or payment in lieu of notice — whichever is the later.",
                  "Where the fixed-term pro-rata provision applies, the full Introduction Fee is payable and there is no entitlement to a refund.",
                  "If, after the Client receives a refund, the Candidate is re-Engaged within 6 calendar months of termination, the refund must be repaid to the Agency, and the Client is not entitled to any further refunds in relation to that re-Engagement.",
                ]}
              />
            </section>

            {/* ===================================================
                05 THIRD PARTY
            ==================================================== */}

            <section id="third-party" className="legal-section">
              <SectionHeading
                number="05"
                title="Introductions to Third Parties"
              />

              <p className="legal-text">
                Introductions of Candidates are confidential. If a Client
                discloses a Candidate's details to a third party, this is
                deemed a "Third Party Introduction". If that Third Party
                Introduction results in an Engagement of the Candidate by the
                third party within 6 months of the Agency's original
                Introduction, the Client is liable to the Agency for an
                Introduction Fee. Neither the Client nor the third party is
                entitled to a refund of that fee in any circumstances.
              </p>
            </section>

            {/* ===================================================
                06 SUITABILITY
            ==================================================== */}

            <section id="suitability" className="legal-section">
              <SectionHeading number="06" title="Suitability Checks" />

              <p className="legal-text">
                The Agency endeavours to ensure the suitability of Candidates
                Introduced to the Client by taking reasonably practicable steps
                to:
              </p>

              <LegalList
                items={[
                  "Ensure it would not be detrimental to the interests of either the Client or the Candidate;",
                  "Ensure both the Client and Candidate are aware of any requirements imposed by law or a professional body; and",
                  "Confirm that the Candidate is willing to work in the position.",
                ]}
              />

              <p className="legal-text">
                Notwithstanding the above, the Client must satisfy itself as to
                the suitability of the Candidate. The Client is responsible
                for:
              </p>

              <LegalList
                items={[
                  "Taking up any references provided by the Candidate before Engaging them;",
                  "Checking the Candidate's right to work and obtaining any permission to work required by law;",
                  "Arranging any medical examinations or investigations into the Candidate's medical history; and",
                  "Satisfying any medical, qualification or other requirements needed for the Candidate to work in the Engagement.",
                ]}
              />

              <p className="legal-text">
                To enable the Agency to meet these obligations, the Client
                undertakes to provide details of the position, including:
              </p>

              <LegalList
                items={[
                  "The type of work required;",
                  "The location and hours of work;",
                  "The experience, training, qualifications and authorisation required by the Client, law or a professional body;",
                  "Any known health and safety risks and the steps taken to prevent or control them;",
                  "The date the Candidate is required to commence;",
                  "The duration or likely duration of the Engagement;",
                  "The minimum rate of Remuneration, expenses and other benefits offered;",
                  "The intervals of payment of Remuneration; and",
                  "The notice period the Candidate would be entitled to give and receive.",
                ]}
              />
            </section>

            {/* ===================================================
                07 EXCLUSIVITY
            ==================================================== */}

            <section id="exclusivity" className="legal-section">
              <SectionHeading
                number="07"
                title="Exclusivity Term (If Applicable)"
              />

              <LegalList
                items={[
                  "The Agency agrees to Introduce Candidates to the Client for direct Engagement for the duration of the Exclusivity Term.",
                  "During the Exclusivity Term, the Client agrees to use only the Agency's services for the Introduction of permanent or contract staff, except where the Agency is unable to Introduce a suitable Candidate, or in the circumstances set out below.",
                  "Nothing in these Terms prevents the Client from responding to unsolicited approaches from third-party agencies (by referring them to the Agency as a sub-contractor), responding to unsolicited approaches from work-seekers directly, or directly approaching work-seekers using its own resources.",
                  "Subject to earlier termination rights, the Exclusivity Term ends when either party gives the other 3 months' written notice.",
                  "Either party may immediately terminate the Exclusivity Term by notice if the other commits an unremedied breach of these Terms (14 days to remedy after notice), or is unable to pay its debts or enters compulsory or voluntary liquidation (other than for a genuine reconstruction or amalgamation where the resulting entity assumes the contract and liabilities).",
                  "For the avoidance of doubt, if the Exclusivity Term is terminated by either party, the Client remains obligated to pay any fees owed to the Agency, whether relating to an Introduction made before or after termination.",
                ]}
              />
            </section>

            {/* ===================================================
                08 INFORMATION
            ==================================================== */}

            <section id="information" className="legal-section">
              <SectionHeading
                number="08"
                title="Information to Be Provided"
              />

              <p className="legal-text">
                When the Agency Introduces a Candidate, it will inform the
                Client that it has obtained confirmation of the suitability
                matters set out in clause 6. Where this information is not
                given in paper or electronic form at the time, it will be
                confirmed by such means by the end of the third business day
                following (excluding weekends and public/bank holidays) —
                save where the Candidate is being Introduced for an Engagement
                the same as one they worked within the previous 5 business
                days, and that information has already been given to the
                Client.
              </p>
            </section>

            {/* ===================================================
                09 CONFIDENTIALITY
            ==================================================== */}

            <section id="confidentiality" className="legal-section">
              <SectionHeading
                number="09"
                title="Confidentiality and Data Protection"
              />

              <p className="legal-text">
                All information relating to a Candidate is confidential and
                subject to the Data Protection Laws, and is provided solely for
                the purpose of providing work-finding services to the Client.
                Such information must not be used for any other purpose nor
                divulged to any third party, and the Client undertakes to abide
                by the Data Protection Laws in receiving and processing the
                data at all times. Information relating to the Agency's
                business which is capable of being confidential must also be
                kept confidential and not divulged to any third party, except
                information that is in the public domain.
              </p>
            </section>

            {/* ===================================================
                10 LIABILITY
            ==================================================== */}

            <section id="liability" className="legal-section">
              <SectionHeading number="10" title="Liability" />

              <p className="legal-text">
                The Agency is not liable under any circumstances for any loss,
                expense, damage, delay, costs or compensation (whether direct,
                indirect or consequential) suffered or incurred by the Client
                arising from or connected with the Agency seeking a Candidate,
                the Introduction or Engagement of any Candidate, or the
                Agency's failure to introduce a Candidate. For the avoidance of
                doubt, the Agency does not exclude liability for death or
                personal injury arising from its own negligence, or for any
                other loss it is not permitted to exclude under law.
              </p>

              <p className="legal-text">
                The Client shall indemnify and keep indemnified the Agency
                against any Losses incurred by the Agency arising out of any
                non-compliance with the Data Protection Laws and/or as a result
                of any breach of these Terms by the Client.
              </p>
            </section>

            {/* ===================================================
                11 NOTICES
            ==================================================== */}

            <section id="notices" className="legal-section">
              <SectionHeading number="11" title="Notices" />

              <p className="legal-text">
                All notices required under these Terms must be in writing, and
                may be delivered personally, by first-class prepaid post to the
                registered office of the party being served, or to any other
                address the party has notified in writing, by email or by
                facsimile transmission. A notice is deemed served: if by hand,
                when delivered; if by first-class post, 48 hours after posting;
                and if by email or facsimile, when sent.
              </p>
            </section>

            {/* ===================================================
                12 SEVERABILITY
            ==================================================== */}

            <section id="severability" className="legal-section">
              <SectionHeading number="12" title="Severability" />

              <p className="legal-text">
                If any provision of these Terms is determined by a competent
                authority to be unenforceable to any extent, that provision
                shall be severed to that extent, and the remaining terms shall
                continue to be valid to the fullest extent permitted by
                applicable law.
              </p>
            </section>

            {/* ===================================================
                13 GOVERNING LAW
            ==================================================== */}

            <section id="governing-law" className="legal-section">
              <SectionHeading
                number="13"
                title="Governing Law and Jurisdiction"
              />

              <p className="legal-text">
                These Terms are governed by the law of England & Wales and are
                subject to the exclusive jurisdiction of the Courts of England
                & Wales.
              </p>
            </section>

            {/* ===================================================
                COMPANY DETAILS
            ==================================================== */}

            <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FaBalanceScale />
                </div>

                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Company Information
                </h2>
              </div>

              <div className="space-y-3 text-sm">
                <CompanyDetail
                  label="Company"
                  value="Hayaibu Talent Ltd (Company No. 11804530)"
                />

                <CompanyDetail
                  label="Registered office"
                  value="Apollo Centre, Desborough Road, High Wycombe, England, HP11 2QW"
                />

                <CompanyDetail
                  label="Telephone"
                  value="01494 211220"
                />

                <CompanyDetail
                  label="Email"
                  value="info@hayaibutalent.com"
                />
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* =========================================================
          LOCAL STYLES
      ========================================================== */}

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        .legal-section {
          margin-top: 4rem;
          padding-top: 0.25rem;
          scroll-margin-top: 2rem;
        }

        .legal-text {
          margin-top: 1rem;
          color: rgb(71 85 105);
          font-size: 0.9rem;
          line-height: 1.85;
        }

        .dark .legal-text {
          color: rgb(148 163 184);
        }

        .subheading {
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          font-size: 1rem;
          font-weight: 800;
          color: rgb(15 23 42);
        }

        .dark .subheading {
          color: white;
        }

        @media (max-width: 640px) {
          .legal-section {
            margin-top: 3rem;
          }

          .legal-text {
            font-size: 0.875rem;
            line-height: 1.8;
          }
        }
      `}</style>
    </main>
  );
}

/* =============================================================
   SECTION HEADING
============================================================= */

function SectionHeading({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
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

/* =============================================================
   DEFINITION
============================================================= */

function Definition({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6">
      <h3 className="font-bold text-slate-900 dark:text-slate-200 text-[15px]! mt-2">
        {title}
      </h3>

      <p className="legal-text !mt-0">{text}</p>
    </div>
  );
}

/* =============================================================
   LEGAL LIST
============================================================= */

function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item, index) => (
        <li
          key={index}
          className="relative pl-6 text-sm leading-7 text-slate-600 dark:text-slate-400"
        >
          <span className="absolute left-0 top-[10px] h-1.5 w-1.5 rounded-full bg-primary" />

          {item}
        </li>
      ))}
    </ul>
  );
}

/* =============================================================
   COMPANY DETAIL
============================================================= */

function CompanyDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-slate-200 pb-3 last:border-0 last:pb-0 dark:border-slate-800 sm:grid-cols-[150px_1fr]">
      <span className="font-bold text-slate-800 dark:text-slate-300">
        {label}
      </span>

      <span className="break-words text-slate-600 dark:text-slate-400">
        {value}
      </span>
    </div>
  );
}