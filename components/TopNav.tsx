import { FaInstagramSquare } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";

export default function TopNav() {
  return (
    <div className="bg-primary text-white py-2">
      <div className="container flex items-center justify-between mx-auto">
        <div className="flex items-center gap-5">
          <p className="text-[12px] sm:!text-[14px]">
            <a href="mailto:info@hayaibutalent.com">info@hayaibutalent.com</a>
          </p>

          <a href="tel:+44365336587">
            <p className="hidden sm:block">+44-3653-36587</p>
          </a>
        </div>
        <div className="flex items-center gap-2">
          <FaFacebookSquare className="text-[22px]" />
          <FaInstagramSquare className="text-[22px]" />
          <FaLinkedin className="text-[22px]" />
        </div>
      </div>
    </div>
  );
}
