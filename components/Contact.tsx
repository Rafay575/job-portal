// app/contact/page.tsx
"use client";

import { FullPageLoader } from "@/components/Loading";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaClock, FaEnvelope } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdCall } from "react-icons/io";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (loading) return;

  const form = e.currentTarget;
  const formData = new FormData(form);

  const formValues = Object.fromEntries(formData.entries());

  try {
    setLoading(true);

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send message");
    }

    console.log("Email sent successfully:", data);

    toast.success(
      "Message sent successfully! We will contact you within 24 hours."
    );

    form.reset();
  } catch (error) {
    console.error("Failed to send contact form:", error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Something went wrong while sending your message."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      {loading && <FullPageLoader text="Sending your message..." />}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-primary dark:text-primary font-bold uppercase tracking-widest text-xs mb-2 block">
            Get In Touch
          </span>

          <h1 className="text-3xl! sm:text-5xl! font-extrabold mb-4 text-slate-900 dark:text-white">
            Contact Our UK Headquarters
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-lg!">
            Our recruitment advisors are available around the clock to support
            candidates and employers across the United Kingdom.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Contact Information */}
          <motion.div className="bg-gradient-to-br from-primary to-primary text-white p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-8">Contact Information</h3>

              <ul className="space-y-6 text-sm">
                <li className="flex items-start gap-2">
                  <FaLocationDot className="text-[#D8B4FE] mt-1 size-5" />

                  <div>
                    <strong>London Headquarters</strong>
                    <br />
                    128 City Road
                    <br />
                    London, EC1V 2NX
                    <br />
                    United Kingdom
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <IoMdCall className="text-[#D8B4FE] size-5" />

                  <div>
                    <strong>Direct Line</strong>
                    <br />
                    +44 20 4620 4046
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <FaEnvelope className="text-[#D8B4FE] size-5" />

                  <div>
                    <strong>Support Email</strong>
                    <br />
                    recruitment@hayaibutalent.com
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <FaClock className="text-[#D8B4FE] size-5" />

                  <div>
                    <strong>Office Hours</strong>
                    <br />
                    Mon-Fri: 8am - 8pm
                    <br />
                    Sat: 9am - 5pm
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-12 pt-6 border-t border-slate-200/20 text-xs text-purple-200">
              Regulated &amp; Compliant UK Recruitment Provider. ICO Registered.
              REC Member.
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.25,
              ease: "easeOut",
            }}
            className="lg:col-span-2 p-10"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-800 dark:text-slate-200">
                    Your Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="John Doe"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-primary transition text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-800 dark:text-slate-200">
                    Email Address <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="john@example.co.uk"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-primary transition text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Phone + Enquiry Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-800 dark:text-slate-200">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="+44 7700 900123"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-primary transition text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-800 dark:text-slate-200">
                    Enquiry Type
                  </label>

                  <select
                    name="enquiryType"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-primary transition text-slate-800 dark:text-white"
                  >
                    <option value="General Enquiry">General Enquiry</option>

                    <option value="Candidate Support">Candidate Support</option>

                    <option value="Employer Services">Employer Services</option>

                    <option value="Technical Support">Technical Support</option>

                    <option value="Partnership Opportunity">
                      Partnership Opportunity
                    </option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-800 dark:text-slate-200">
                  Subject <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="subject"
                  required
                  placeholder="Inquiry regarding healthcare vacancies..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-primary transition text-slate-800 dark:text-white"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-800 dark:text-slate-200">
                  Message <span className="text-red-500">*</span>
                </label>

                <textarea
                  name="message"
                  rows={4}
                  required
                  placeholder="Type your message here..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-primary transition text-slate-800 dark:text-white"
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-white font-bold px-8 py-4 rounded-xl shadow-lg transition btn-glow cursor-pointer"
              >
                <i className="fa-solid fa-paper-plane mr-2"></i>
                Send Message
              </button>
            </form>
          </motion.div>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.4,
            ease: "easeOut",
          }}
          className="mt-12 bg-slate-200 dark:bg-slate-800 rounded-3xl flex items-center justify-center"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2873.3167904827937!2d-0.09124732317907959!3d51.52724160925339!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761ca668a1c7df%3A0xf17fea9676bed048!2s128%20City%20Rd%2C%20London%20EC1V%202NX%2C%20UK!5e1!3m2!1sen!2s!4v1786377005289!5m2!1sen!2s"
            width="600"
            height="450"
            style={{ border: "0px" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="w-full rounded-2xl"
          ></iframe>
        </motion.div>
      </section>
    </>
  );
}
