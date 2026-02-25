'use client'

import { useState } from 'react'
import { Clock, Briefcase, Users } from 'lucide-react'
import Image from 'next/image'

interface Role {
  id: string
  title: string
  description: string
  image:string
}

const roles: Role[] = [
  {
    id: 'part-time',
    title: 'Part Time Role',
    description: 'Flexible hours, work part of the day',
    image:"/role-icon1.png"
  },
  {
    id: 'full-time',
    title: 'Full Time Role',
    description: 'Flexible hours, work part of the day',
    image:"/role-icon2.png"

  },
  {
    id: 'both',
    title: 'Both',
    description: 'Flexible hours, work part of the day',
    image:"/role-icon3.png"

  },
]

export default function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  return (
    <div className=" py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            What type of role are you looking?
          </h1>
          <p className="text-gray-600 text-lg">
            What can I do with Hayaibu Talent. What can I do with Hayaibu Talent.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 gap-4">
          {roles.map((role) => {
            const isSelected = selectedRole === role.id
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`relative flex flex-col items-center p-8 rounded-2xl transition-all duration-300 ${
                  isSelected
                    ? 'bg-white border-2 border-primary shadow-lg'
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Radio Circle Indicator */}
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all duration-300"
                  style={{
                    borderColor: isSelected ? '#5C49D8' : '#D1D5DB',
                    backgroundColor: isSelected ? '#5C49D8' : 'transparent',
                  }}
                >
                  {isSelected && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>

                {/* Icon */}
                <div className={`mb-6 transition-colors duration-300 ${
                  isSelected ? 'text-priamry' : 'text-gray-400'
                }`}>
                  <Image src={role.image} alt='icon' className='w-full' width={400} height={400} unoptimized/>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {role.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-6 flex-grow">
                  {role.description}
                </p>

                {/* Select Button */}
                <button
                  onClick={() => setSelectedRole(role.id)}
                  className={`w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
                    isSelected
                      ? 'bg-primary text-white'
                      : 'bg-primary text-white hover:bg-primary/90 cursor-pointer'
                  }`}
                >
                  Select
                </button>
              </button>
            )
          })}
        </div>

      </div>
    </div>
  )
}
