import Image from "next/image";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

export default function Section6() {
  const jobs = [
    {
      id: 1,
      company: "Expediz",
      location: "New York, USA",
      title: "Sr. Post Writer",
      tags: ["Full time"],
      type: "Permanent",
      salary: "$5,000–12,000",
      posted: "3 days ago",
      logo: "/pjob-1.png",
    },
    {
      id: 2,
      company: "Anderson",
      location: "New York, USA",
      title: "Jr. Designer",
      tags: ["Full time", "Urgent", "Part time"],
      type: "Permanent",
      salary: "$5,000–12,000",
      posted: "3 days ago",
      logo: "/pjob-2.png",
    },
    {
      id: 3,
      company: "Handblow",
      location: "New York, USA",
      title: "Back End Developer",
      tags: ["Full time", "Urgent"],
      type: "Permanent",
      salary: "$5,000–12,000",
      posted: "3 days ago",
      logo: "/pjob-3.png",
    },
  ];
  return (
    <div className=" pad bg-[#EDF3F5]">
      <div className="  container mx-auto flex flex-col items-center ">
        <p className="heading text-primary font-medium">Popular Jobs</p>
        <p className="text-center w-full sm:w-[70%] md:w-[55%] xl:w-[40%] mt-2">
          Global talent centers for specialized skills, or delivering managed
          programs across focused industries
        </p>
        <div className="grid  md:grid-cols-2 lg:grid-cols-3  gap-6 mt-10">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition relative"
            >
              <HiOutlineDotsHorizontal className="absolute top-5 right-5 text-[20px]" />
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src={job.logo}
                  alt={job.company}
                  width={45}
                  height={45}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-primary text-lg">
                    {job.company}
                  </h3>
                  <p className="text-sm text-gray-500">{job.location}</p>
                </div>
              </div>

              {/* Job Title */}
              <h4 className="text-primary font-semibold text-md mb-3">
                {job.title}
              </h4>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {job.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Details */}
              <div className="text-sm text-gray-500 space-y-1 mb-4">
                <p>{job.type}</p>
                <p>{job.salary}</p>
                <p>
                  From your web browser, perform live call monitoring and
                  provide feedback during or after calls.
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-6">
                <button className="px-5 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition text-[13px]">
                  Apply now
                </button>
                <span className="text-xs text-gray-400">{job.posted}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Browse More */}
        <div className="text-center mt-10">
          <div className="inline-block text-center">
            <button className="text-primary font-medium">
              Browse more jobs
            </button>

            <div className="h-[1px] bg-primary w-1/4  "></div>
          </div>
        </div>
      </div>
    </div>
  );
}
