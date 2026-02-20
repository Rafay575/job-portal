'use client'

import { JobSidebar } from '@/components/job-sidebar'
import { JobCard } from '@/components/job-card'

const recommendedJobs = [
  {
    id: '1',
    title: 'Job tip Analysis',
    company: 'Company Name',
    salary: '$1.20k–$70k–$30,000',
    jobType: 'Permanent',
    isPermanent: true,
    isFullTime: true,
    colorClass: 'bg-blue-900',
  },
  {
    id: '2',
    title: 'Job tip Analysis',
    company: 'Company Name',
    salary: '$1.20k–$70k–$30,000',
    jobType: 'Permanent',
    isPermanent: true,
    isFullTime: true,
    colorClass: 'bg-red-700',
  },
  {
    id: '3',
    title: 'Job tip Analysis',
    company: 'Company Name',
    salary: '$1.20k–$70k–$30,000',
    jobType: 'Permanent',
    isPermanent: true,
    isFullTime: true,
    colorClass: 'bg-blue-600',
  },
  {
    id: '4',
    title: 'Job tip Analysis',
    company: 'Company Name',
    salary: '$1.20k–$70k–$30,000',
    jobType: 'Permanent',
    isPermanent: true,
    isFullTime: true,
    colorClass: 'bg-pink-500',
  },
  {
    id: '5',
    title: 'Job tip Analysis',
    company: 'Company Name',
    salary: '$1.20k–$70k–$30,000',
    jobType: 'Permanent',
    isPermanent: true,
    isFullTime: true,
    colorClass: 'bg-blue-950',
  },
  {
    id: '6',
    title: 'Job tip Analysis',
    company: 'Company Name',
    salary: '$1.20k–$70k–$30,000',
    jobType: 'Permanent',
    isPermanent: true,
    isFullTime: true,
    colorClass: 'bg-amber-500',
  },
  {
    id: '4',
    title: 'Job tip Analysis',
    company: 'Company Name',
    salary: '$1.20k–$70k–$30,000',
    jobType: 'Permanent',
    isPermanent: true,
    isFullTime: true,
    colorClass: 'bg-pink-500',
  },
  {
    id: '5',
    title: 'Job tip Analysis',
    company: 'Company Name',
    salary: '$1.20k–$70k–$30,000',
    jobType: 'Permanent',
    isPermanent: true,
    isFullTime: true,
    colorClass: 'bg-blue-950',
  },
  {
    id: '6',
    title: 'Job tip Analysis',
    company: 'Company Name',
    salary: '$1.20k–$70k–$30,000',
    jobType: 'Permanent',
    isPermanent: true,
    isFullTime: true,
    colorClass: 'bg-amber-500',
  },
  {
    id: '4',
    title: 'Job tip Analysis',
    company: 'Company Name',
    salary: '$1.20k–$70k–$30,000',
    jobType: 'Permanent',
    isPermanent: true,
    isFullTime: true,
    colorClass: 'bg-pink-500',
  },
  {
    id: '5',
    title: 'Job tip Analysis',
    company: 'Company Name',
    salary: '$1.20k–$70k–$30,000',
    jobType: 'Permanent',
    isPermanent: true,
    isFullTime: true,
    colorClass: 'bg-blue-950',
  },
  {
    id: '6',
    title: 'Job tip Analysis',
    company: 'Company Name',
    salary: '$1.20k–$70k–$30,000',
    jobType: 'Permanent',
    isPermanent: true,
    isFullTime: true,
    colorClass: 'bg-amber-500',
  },
]

export default function Jobs() {
  return (
    <div className="flex min-h-screen bg-background container mx-auto">
      

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Recommended Jobs Section */}
        <div className="w-full  md:py-8 md:px-4 ">
          <div className="">
            {/* Header */}
            <div className="mb-5">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                <span className="text-primary">Recommended Jobs</span>
              </h1>
              
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-5">
              {recommendedJobs.map((job) => (
                <JobCard key={job.id} {...job} />
              ))}
            </div>

            {/* Load More Section */}
            <div className="mt-12 text-center">
              <button className="rounded-lg border border-primary bg-transparent px-6 py-2.5 font-semibold text-primary hover:bg-primary/5 transition-colors">
                Load More Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
