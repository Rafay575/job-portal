import Image from "next/image";
import { Button } from "../ui/button";

export default function Section3() {
  return (
    <div className=" pad relative">
      <Image
        src={"/bg-sec3.png"}
        alt="logo"
        className="w-[60%] absolute z-[-1] bottom-0 right-0"
        width={1500}
        height={1500}
        unoptimized
      />
      <div className="container  mx-auto flex flex-col lg:flex-row ">
        <div className=" w-[20%] ">
          <p className="text-primary font-medium">Why Plan-A</p>
        </div>
        <div className=" grow  ">
          <div className="flex items-end justify-between border-b py-[10px] md:py-[30px]">
            <p className="w-[70%] sm:w-[45%] xl:w-[30%] !text-[40px]  md:!text-[60px] text-primary font-semibold leading-[100%]">
              Why should you choose us?
            </p>
            <div className="w-[30%] flex justify-end sm:justify-start">
              <Image
                src={"/icon-sec3.png"}
                alt="logo"
                className="w-[40%]"
                width={500}
                height={500}
                unoptimized
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start py-[30px] gap-y-[20px]">
            <div className="w-full md:w-[30%]">
              {[
                "No Spam",
                "Premium Advantage",
                "Live CV Builder",
                "Support Team",
              ].map((ul, i) => (
                <div key={i} className="flex items-center gap-3 ">
                  <Image
                    src={"/tick.png"}
                    alt="logo"
                    className="w-[25px] "
                    width={500}
                    height={500}
                    unoptimized
                  />
                  <p className="text-primary">{ul}</p>
                </div>
              ))}
            </div>
            <div className="w-full md:w-[40%] md:px-5">
              <p className="text-[18px]! text-[#627785]!">
                We are your digital enablement partner to accelerate your
                transformation journey. Whether it is augmenting your existing
                team, leveraging our global talent centers for specialized
                skills, or delivering managed programs across focused
                industries, we’re designed to enable your digital journey.
              </p>
            </div>
            <div className=" w-full md:w-[30%] flex justify-end">
              <Button
                type="button"
                className="border bg-white text-primary rounded-[30px] !py-[25px] px-[30px] hover:text-white text-[18px] "
              >
                Know more us
              </Button>
            </div>
          </div>
          <Image
            src={"/sect3image.png"}
            alt="logo"
            className="w-full"
            width={1500}
            height={1500}
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
