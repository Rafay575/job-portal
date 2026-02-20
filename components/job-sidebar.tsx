'use client'

import { CheckCircle2, Bookmark, AlertCircle, Heart, FileText, FileText as FileCheck, Settings, User, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface JobSidebarProps {
  className?: string
}

const profileSections = [
  { label: 'CV Upload', icon: FileText, completed: true },
  { label: 'About You', icon: User, completed: false },
  { label: 'Looking for', icon: Search, completed: false },
  { label: 'Status & Availability', icon: AlertCircle, completed: false },
  { label: 'Work Experience', icon: FileCheck, completed: false },
  { label: 'Qualifications', icon: CheckCircle2, completed: false },
  { label: 'Update Profile', icon: Settings, completed: false },
]

const activitySections = [
  { label: 'Applications', icon: FileText },
  { label: 'Draft Applications', icon: FileText },
  { label: 'Saved Jobs', icon: Bookmark },
  { label: 'Job Alerts', icon: AlertCircle },
  { label: 'Recommended Jobs', icon: Heart },
]

export function JobSidebar({ className }: JobSidebarProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  return (
    <aside
      className={cn(
        'sticky top-0 h-screen w-full max-w-md overflow-y-auto border-r border-border bg-background px-4 py-6 md:py-8',
        className
      )}
    >   
      {/* Profile Section */}
      <div className="space-y-4 pb-8">
        <div>
          <h2 className="text-lg font-semibold text-primary">Profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">Candidate Name</p>
          <p className="text-sm text-muted-foreground">London, United Kingdom</p>
          <Button
            variant="link"
            className="h-auto p-0 text-sm font-semibold text-primary underline"
          >
            Edit Your Profile & CV
          </Button>
        </div>

        {/* Profile Completion */}
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-sm font-medium">Profile Completion: 60%</p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-3/5 bg-primary rounded-full"></div>
          </div>
        </div>

        {/* Profile Sections */}
        <nav className="space-y-2">
          {profileSections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.label}
                onClick={() => setActiveSection(section.label)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted',
                  activeSection === section.label
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{section.label}</span>
                {section.completed && (
                  <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Activity Section */}
      <div className="space-y-4 border-t border-border pt-6">
        <h3 className="text-lg font-semibold text-foreground">Activity</h3>
        <nav className="space-y-2">
          {activitySections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.label}
                onClick={() => setActiveSection(section.label)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted',
                  activeSection === section.label
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{section.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
