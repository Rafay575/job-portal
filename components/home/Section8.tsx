"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const featurecard = [
  {
    icon: "/ca.png",
    title: "Create an account",
    description:
      "Delivering managed programs across over the tedious tasks of risk",
    btn: "Register",
    arrow: "/arrow1.png",
    pos: "absolute bottom-8  -right-[65%] lg:-right-[55%] ",
  },
  {
    icon: "/ur.png",
    title: "Upload your resume",
    description:
      "Delivering managed programs across over the tedious tasks of risk",
    btn: "Upload CV",
    arrow: "/arrow2.png",
    pos: "absolute top-8 -right-[65%] lg:-right-[55%] ",
  },
  {
    icon: "/ap.png",
    title: "Apply your dream job",
    description:
      "Delivering managed programs across over the tedious tasks of risk",
    btn: "Apply now",
  },
];

export default function Section8() {
  return (
    <section className="pad  ">
      <div className="container mx-auto ">
        <div className="grid  md:grid-cols-3 gap-8">
          {featurecard.map((item, index) => (
            <Card
              key={index}
              className=" shadow-none border-0 transition w-[70%] mx-auto"
            >
              <CardContent className="flex flex-col items-center text-center gap-4 px-2 lg:p-6 relative">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={64}
                  height={64}
                  className="object-contain"
                />

                <h3 className="text-primary font-medium !text-2xl md:w-[70%]">
                  {item.title}
                </h3>

                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>

                {/* Browse More */}
                <div className="text-center mt-1">
                  <div className="inline-block text-center">
                    <button className="text-primary !text-[13px]">
                      {item.btn}
                    </button>

                    <div className="h-[1px] bg-primary w-1/4  "></div>
                  </div>
                </div>
                {item.arrow && (
                  <Image
                    src={item.arrow}
                    alt={item.arrow}
                    width={700}
                    height={700}
                    className={`object-contain w-[60%] hidden md:block ${item.pos}`}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
