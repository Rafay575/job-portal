import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BsBell } from "react-icons/bs";
export default function Notification() {
  return (
    <div className='cursor-pointer'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative">
              <span className="absolute top-0 -right-1 h-2 w-2 rounded-full bg ring-1 ring-white" />
              <BsBell className="text-[20px] md:text-[22px]" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-60 bg2">
            <DropdownMenuItem className="">Notification1</DropdownMenuItem>
            <DropdownMenuItem className="">Notification2</DropdownMenuItem>
            <DropdownMenuItem className="">Notification3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
  )
}
