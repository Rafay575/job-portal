import Image from "next/image";
import { GoArrowRight } from "react-icons/go";

export default function TrendingJobs() {
  const jobs = [
    {
      title: "Manufacturing & Production",
      icon: "/job-icon-1.png",
      openings: "36",
    },
    { title: "Administration", icon: "/job-icon-2.png", openings: "36" },
    { title: "Healthcare", icon: "/job-icon-3.png", openings: "36" },
    {
      title: "Engineering and Construction",
      icon: "/job-icon-4.png",
      openings: "36",
    },
    {
      title: "Business, & Management",
      icon: "/job-icon-5.png",
      openings: "36",
    },
    { title: "Finance & Accounting", icon: "/job-icon-6.png", openings: "36" },
    { title: "Hospitality & Tourism", icon: "/job-icon-7.png", openings: "36" },
    {
      title: "Logistics & Distribution",
      icon: "/job-icon-8.png",
      openings: "36",
    },
    {
      title: "Transportation & Logistics",
      icon: "/job-icon-9.png",
      openings: "36",
    },
    {
      title: "Media & Entertainment",
      icon: "/job-icon-10.png",
      openings: "36",
    },
  ];
  return (
    <div className="pad container mx-auto flex flex-col items-center  ">
      <p className="heading text-primary font-medium">Job Category</p>
      <p className="text-center w-full sm:w-[70%] md:w-[55%] xl:w-[40%] mt-2">
        Global talent centers for specialized skills or delivering managed
        programs across focused industries.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full mt-7">
        {jobs.map((job, i) => (
          <div
            className="flex items-center gap-4 shadow rounded-xs cursor-pointer hover:scale-[1.02] duration-300 px-5   py-4"
            key={i}
          >
            <Image
              src={job.icon}
              alt="sector"
              className="w-[40px] h-[40px]"
              width={400}
              height={350}
              unoptimized
            />
            <div>
              <p className="!text-[20px] text-primary font-medium">
                {job.title}
              </p>
              <div className="flex items-center gap-1 ">
                <p className="text-primary !text-[13px] font-medium">
                  ({job.openings} openings)
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
