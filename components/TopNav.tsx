import { FaInstagramSquare } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";

export default function TopNav() {
  return (
    <div className="bg-primary from-brand-900 via-brand-800 to-brand-900 text-white text-xs py-2.5 px-4 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="flex items-center animate-pulse">
            <i className="fa-solid fa-bolt mr-2 text-yellow-400"></i>
            <span className="font-medium tracking-wide text-center md:text-left">⚡ Empowering UK Private Healthcare Networks with Elite Medical Talent & Advanced Workforce Solutions.</span>
            <span className="mx-4 text-brand-300 hidden md:block">|</span>
            <span className="text-brand-200 font-medium hidden md:block">Now serving 450+ verified employers across England, Scotland, Wales & Northern Ireland</span>
          </div>
        </div>
      </div>
  );
}
