'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Bookmark } from 'lucide-react'
import Image from 'next/image'

interface JobCardProps {
  id: string
  title: string
  company: string
  salary: string
  jobType: string
  isPermanent?: boolean
  isFullTime?: boolean
  colorClass: string
}

export function JobCard({
  id,
  title,
  company,
  salary,
  jobType,
  isPermanent = true,
  isFullTime = true,
  colorClass,
}: JobCardProps) {
  return (
    <Card className="flex flex-col gap-2 p-5 hover:shadow-lg transition-shadow">
      {/* Color Badge */}
      <div className={cn('h-12 w-12 rounded-lg', colorClass)} />

      {/* Job Title */}
      <div className="space-y-1">
        <h3 className="font-semibold text-primary text-base leading-snug">{title}</h3>
        <p className="text-sm text-muted-foreground">{company}</p>
      </div>

      {/* Salary Range */}
      <div className="text-sm font-medium text-foreground">{salary}</div>

      {/* Job Type Tags */}
      <div className="flex flex-wrap gap-2">
        {isPermanent && (
          <span className="rounded-full py-1 text-sm font-medium text-primary flex items-center gap-2">
            <Image src={"/per.png"} className='w-[15px]' alt='icon' width={200} height={200}/>
            Permanent
          </span>
        )}
        {isFullTime && (
          <span className="rounded-full  py-1 text-sm font-medium text-primary flex items-center gap-2">
            <Image src={"/full.png"} className='w-[15px]' alt='icon' width={200} height={200}/>
            Full Time
          </span>
        )}
      </div>

      {/* Action Line */}
      <div className="bg-primary text-primary w-[70%] h-[4.5px] ">
        .
      </div>
    </Card>
  )
}
