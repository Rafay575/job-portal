import React from "react";

export default function Section9() {
  const stats = [
    {
      value: "20",
      description:
        "Of users indicate they would use Offered again in their next job search",
    },
    {
      value: "2k+",
      description:
        "We have completed more than 2k projects world-wide with 100% satisfaction",
    },
    {
      value: "90+",
      description:
        "We are a team of 90+ experienced members, who are always ready to help you",
    },
    {
      value: "10",
      description:
        "With 10 official branches, we've started our consultancy agency world-wide",
    },
  ];
  return (
    <div className="bg-primary pad">
      <div className="container mx-auto  flex flex-col items-center">
        <p className="heading text-white text-center leading-[110%]  sm:w-[80%] md:w-[70%] lg:w-[\60%] xl:w-[40%]">
          We're empowered to assist with a recruiting system for 10k positions
          worldwide.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-t mt-7 border-[#ebf7ff2d]">
          {stats.map((stat, index) => {
            // For md: first column in each row (2-cols) has no border
            const isFirstColMd = index % 2 === 0;
            // For lg: first column in each row (4-cols) has no border
            const isFirstColLg = index % 4 === 0;

            return (
              <div
                key={index}
                className={`text-center flex flex-col items-center
          sm:${!isFirstColMd ? "border-l border-[#ebf7ff2d]" : ""}
          lg:${!isFirstColLg ? "border-l border-[#ebf7ff2d]" : ""}
          px-4
        `}
              >
                <div className="text-[50px] md:text-[70px]  font-medium text-white">
                  {stat.value}
                </div>
                <p className="text-[#A3BFD1] mt-2 w-[50%] md:w-[70%] sm:w-[90%]">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
