import Image from "next/image";
import { Button } from "../ui/button";
import { GoArrowUpRight } from "react-icons/go";
import  Link  from "next/link";

export default function Hero() {
  const cards = [
    {
      title: "APPLICANT JOURNEY",
      subtitle: "Elevate Your Career with Top Opportunities",
      image: "/hero1.png",
      btn: "Find a Job Now ",
      link: "/user/dashboard",
    },
    {
      title: "EMPLOYER JOURNEY",
      subtitle: "Access Premier Talent Hire Faster ",
      image: "/hero2.png",
      btn: "Post a Job Now ",
      link: "/coming-soon",
    },
  ];

  return (
    <div className=" md:h-[70vh]  bg-primary flex items-center justify-center px-6 py-4 md:py-10 relative ">
      <Image
        src="/boy.png"
        alt="hero-image"
        width={500}
        height={900}
        className="w-[13%] h-auto mt-auto absolute bottom-7 left-8 hidden xl:block"
        unoptimized
      />
      <Image
        src="/girl.png"
        alt="hero-image"
        width={500}
        height={900}
        className="w-[15%] h-auto mt-auto absolute  bottom-7  right-8 hidden xl:block"
        unoptimized
      />
      <div className="w-full max-w-5xl xl:max-w-[65%]   border-white rounded-4xl flex flex-col sm:flex-row md:p-5 sm:p-8 gap-5 md:gap-10">
        {cards.map((card, index) => (
          <div
            key={index}
            className="border-2 border-white rounded-4xl grow flex flex-col items-center gap-5 p-8"
          >
            <p className="text-white text-center !text-[6vw] sm:!text-[4vw]  lg:!text-[3vw] xl:!text-[2vw] leading-[100%] font-bold">
              {card.title}
            </p>

            <p className="text-white text-center !text-[18px]  md:!text-[20px] lg:w-[70%]">
              {card.subtitle}
            </p>

            <Image
              src={card.image}
              alt="hero-image"
              width={500}
              height={260}
              className="w-full h-auto mt-auto"
              unoptimized
            />

            <Link href={card.link} className="w-full">
              <Button
                type="button"
                className="bg-white text-primary font-semibold hover:text-white border border-white cursor-pointer w-full text-[15pxz] sm:text-[17px] md:text-[23px] py-[2vw] sm:py-[1.5vw]"
              >
                {card.btn}
                <GoArrowUpRight className="font-semibold size-4 md:size-[1.5vw]" />
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
