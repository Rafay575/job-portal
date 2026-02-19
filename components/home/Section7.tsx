"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { BiSolidQuoteRight } from "react-icons/bi";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";

export default function Section7() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const ratings = [
    {
      message:
        "We’ve had good experiences with call centers through binox. We hired my own remote team that I have complete control over the remote team.",
      name: "Mark Henry",
      position: "Developer, Oklavery",
      rating: 4.9,
    },
    {
      message:
        "We’ve had good experiences with call centers through binox. We hired my own remote team that I have complete control.",
      name: "Mark Henry",
      position: "Developer, Oklavery",
      rating: 3.9,
    },
    {
      message: "We’ve had good experiences with call centers through binox.",
      name: "Mark Henry",
      position: "Developer, Oklavery",
      rating: 4.2,
    },
    {
      message: "We’ve had good experiences with call centers through binox.",
      name: "Mark Henry",
      position: "Developer, Oklavery",
      rating: 5,
    },
  ];

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="container mx-auto py-20 flex flex-col items-center">
      <p className="text-primary font-medium text-center heading md:text-3xl  w-[60%]  md:w-[55%] lg:w-[50%] xl:w-[40%]">
        Hear what our great job seekers say
      </p>

      <div className="mt-10 flex flex-col lg:flex-row w-full gap-6 bg-muted/30 p-6 ">
        {/* LEFT SIDE (Carousel) */}
        <div className="lg:w-[80%] w-full">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              slidesToScroll: 1,
              loop: true, // important
            }}
          >
            <CarouselContent>
              {ratings.map((item, index) => (
                <CarouselItem
                  key={index}
                  className="basis-full lg:basis-1/2 border-r"
                >
                  <Card className="border-none shadow-none bg-transparent">
                    <CardContent className="flex flex-col gap-6 p-6">
                      {/* Testimonial Icon */}
                      <div className="text-primary text-5xl">
                        <BiSolidQuoteRight />
                      </div>

                      {/* Message */}
                      <p className="text-muted-foreground !text-lg leading-relaxed">
                        {item.message}
                      </p>

                      {/* Name + Position */}
                      <div>
                        <p className="font-semibold text-primary">
                          {item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.position}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* RIGHT SIDE (Rating + Controls) */}
        <div className="lg:w-[20%] w-full flex flex-col items-center justify-center gap-6 border-l pl-6">
          <p className="text-primary underline font-[600]">Average Rating</p>
          {/* Rating */}
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-primary">
              {ratings[current]?.rating}
            </div>

            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const rating = ratings[current]?.rating || 0;

                return (
                  <Star
                    key={star}
                    className={`size-5 ${
                      rating >= star
                        ? "text-yellow-500 fill-yellow-500"
                        : rating >= star - 0.5
                          ? "text-yellow-500 fill-yellow-500 opacity-60"
                          : "text-gray-300"
                    }`}
                  />
                );
              })}
            </div>
            <p className="text-primary mt-2 font-[600]">(30+) Customer reviews</p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => api?.scrollPrev()}
              className="rounded-full w-[40px] h-[40px]"
            >
              <FaArrowLeftLong />
            </Button>

            <Button
              onClick={() => api?.scrollNext()}
              className="rounded-full w-[40px] h-[40px]"
            >
              <FaArrowRightLong />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
