import Image from "next/image";

export default function Section5() {
  const featurecard = [
    {
      icon: "/sec5icon2.png",
      title: "An inclusive workplace",
      description:
        "Delivering managed programs across over the tedious tasks of risk",
    },
    {
      icon: "/sec5icon3.png",
      title: "Best-in-class applications",
      description:
        "Delivering managed programs across over the tedious tasks of risk",
    },
    {
      icon: "/sec5icon4.png",
      title: "Job search workshops",
      description:
        "Delivering managed programs across over the tedious tasks of risk",
    },
    {
      icon: "/sec5icon5.png",
      title: "Interview preparation",
      description:
        "Delivering managed programs across over the tedious tasks of risk",
    },
  ];

  return (
    <div className=" pad container mx-auto flex flex-col md:flex-row items-center">
      <div className=" w-full md:w-1/2 relative ">
        <Image
          src="/recruiter.png"
          alt="recruiter"
          width={1245}
          height={1245}
          className="w-[90%] mr-auto ml-auto md:ml-0"
        />
        <Image
          src="/sec5icon.png"
          alt="icon"
          width={1245}
          height={1245}
          className="w-[70%] absolute -left-[22%]  md:-left-[34%] top-[30%]"
        />
      </div>
      <div className=" w-full md:w-1/2 flex flex-col justify-content-center items-start">
        <div className="w-[90%] lg:w-full mx-auto">
          <p className="!text-[35px] md:!text-[40px] lg:!text-[45px] xl:!text-[60px]  leading-[120%] text-primary font-medium ">
            A huge opportunity change your life and career.
          </p>
          <div className="grid grid-cols-2  gap-8 mt-10">
            {featurecard.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-start  gap-4 w-[70%] md:w-full xl:w-[60%]"
              >
                {/* Icon */}
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
                />

                {/* Title */}
                <h3 className="text-primary font-semibold text-lg lg:text-2xl">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 lg:!text-lg">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
