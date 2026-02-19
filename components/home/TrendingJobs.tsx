import Image from "next/image";
import { PiCrownSimpleThin } from "react-icons/pi";
import { IoIosHeartEmpty } from "react-icons/io";
import { CiCircleCheck } from "react-icons/ci";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import { IoIosArrowDropright } from "react-icons/io";
export default function TrendingJobs() {
  const jobs = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: "Full Stack Engineer",
    company: "Dayfor",
    category: "Graphic & Design",
    location: "New York",
    type: "Full-Time",
    salary: "$40-$60 / day",
    date: "Dec 24, 2026",
  }));
  return (
    <div className="pad container mx-auto flex flex-col items-center  ">
      <p className="heading text-primary font-medium">Trending Jobs</p>
      <p className="text-center w-[90%]">Handpicked roles from top companies — apply before they’re gone!</p>
      <div className="flex items-center justify-center flex-wrap gap-x-5 gap-y-2 text-primary font-medium mt-2">
        <p className="text-[14px] md:!text-[18px]">All Jobs</p>
        <p className="text-[14px] md:!text-[18px]">Sales & Marketing</p>
        <p className="text-[14px] md:!text-[18px]">Digital Marketing</p>
        <p className="text-[14px] md:!text-[18px]">Graphic Design</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-0 md:gap-x-3 gap-y-5 w-full p-1">
        {jobs.map((job) => (
          <div key={job.id} className="flex items-center gap-5 shadow p-1">
            <Image
              src="/job-icon.png"
              alt="logo"
              width={500}
              height={500}
              className="w-[15%]"
            />

            <div className="grow flex flex-col items-stretch gap-1 sm:gap-2">
              <div className="flex items-start gap-2">
                <p className="grow !text-[20px] font-[600]">{job.title}</p>

                <div className="flex items-center">
                  <PiCrownSimpleThin className="size-8" />
                  <IoIosHeartEmpty className="size-7" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  <CiCircleCheck className="size-4" />
                  <p className="!text-[11px] sm:!text-[13px]">{job.company}</p>
                </div>

                <div className="flex items-center gap-0.5">
                  <LuBriefcaseBusiness className="size-4" />
                  <p className="!text-[11px] sm:!text-[13px]">{job.category}</p>
                </div>

                <div className="flex items-center gap-0.5">
                  <IoLocationOutline className="size-4.5" />
                  <p className="!text-[11px] sm:!text-[13px]">{job.location}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 xl:gap-6">
                <div className="flex items-center justify-start gap-4 xl:gap-6">
                  <p className="!text-[13px] xl:!text-[15px] font-medium">
                    {job.type}
                  </p>

                  <p className="!text-[13px] xl:!text-[15px] font-medium">
                    {job.salary}
                  </p>

                  <p className="!text-[13px] xl:!text-[15px] font-medium">
                    {job.date}
                  </p>
                </div>

                <button className="flex items-center gap-1 text-[13px] xl:text-[15px] !font-semibold text-black ml-auto">
                  Apply Now <IoIosArrowDropright className="size-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
