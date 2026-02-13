"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [direction, setDirection] = useState(1); // 1 = next, -1 = back
  const [prevStep, setPrevStep] = useState(1);

  // Determine current step from pathname
  const getStep = (path: string) => {
    const match = path.match(/step(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  };

  useEffect(() => {
    const currentStep = getStep(pathname);
    setDirection(currentStep >= prevStep ? 1 : -1);
    setPrevStep(currentStep);
  }, [pathname]);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden bg-white w-[90%] max-w-4xl mx-auto px-[30px] md:px-[50px] py-[30px] md:py-[50px]"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
