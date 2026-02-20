import Image from "next/image";

export default function Section2() {
  const logos = [
    "/com-logo1.png",
    "/com-logo2.png",
    "/com-logo3.png",
    "/com-logo4.png",
    "/com-logo5.png",
  ];
  return (
    <div className="border-b py-[20px] md:py-0">
      <div className="container mx-auto flex flex-col md:flex-row ">
        <div className="text-primary w-full md:w-[20%] border-r py-[20px] md:py-[40px]">
          <p className="!text-[25px] w-[70%] font-medium leading-8 ">
            We worked with industry leader
          </p>
        </div>
        <div className="flex items-center  md:justify-between w-full flex-wrap md:flex-nowrap gap-y-7">
          {logos.map((logo, i) => (
            <div className="h-full w-[20%] flex justify-start md:justify-end">
              <Image
                src={logo}
                alt="logo"
                className="w-[60%] my-auto"
                width={200}
                height={200}
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
