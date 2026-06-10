import Image from "next/image";
import React from "react";

export default function Page() {
  return (
    <main className="flex items-center justify-center ">
      <div className="mx-auto container flex flex-row justify-around items-start gap-4 pt-[50px] lg:pt-[80px]">
        <div>
          <h1 className="mb-4 !text-[7vw] lg:!text-[3vw] font-bold text-primary mt-6">Coming Soon</h1>

          <p className="max-w-md text-slate-400">
            This page of Hayaibu Talent is currently under development. We're
            working hard to bring it to you soon.
          </p>

          <div className="mt-8">
            <a
              href="/"
              className=" bg-primary px-5 py-3 text-sm font-medium text-white transition"
            >
              Back to Home
            </a>
          </div>
        </div>
        <Image
          src="/girl.png"
          alt="Coming Soon"
          width={190}
          height={200}
          className="-translate-x-[10%] w-[20%] border-b border-primary shadow-b-5xl hidden lg:block"
        /> 
      </div>
    </main>
  );
}
