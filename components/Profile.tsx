"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";


export default function Profile() {
    return (
        <div className=" justify-center gap-[5px] md:gap-[10px] items-center flex z-[999] cursor-pointer">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 rounded-full border focus-visible:ring-0 focus-visible:ring-offset-0" >
                        <div className="relative inline-block">
                            <Avatar className="w-[35px] h-[35px] cursor-pointer">
                                {/* <AvatarImage src="/avatar22.png" className="object-cover"/> */}
                                <AvatarFallback>AS</AvatarFallback>
                            </Avatar>

                            {/* Badge OUTSIDE Avatar */}
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg ring-2 ring-white" />
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 md:w-60  ">
                    <DropdownMenuItem className="">
                        <div className="relative inline-block">
                            <Avatar className="w-[35px] md:w-[40px] h-[35px] md:h-[40px]">
                                {/* <AvatarImage src="/avatar22.png" className="object-cover"/> */}
                                <AvatarFallback>AS</AvatarFallback>
                            </Avatar>

                            {/* Badge OUTSIDE Avatar */}
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg ring-2 ring-white" />
                        </div>
                        <div className="flex flex-col gap-[0px] items-start mt-[5px]  lg:w-[100px]">
                            <p className="text-[16px] md:text-[20px] font-[500] leading-5">Abdullah</p>
                            <p className="text-[10px] md:text-[13px] font-[400]">Job Seeker</p>
                        </div>
                    </DropdownMenuItem>
                    <Link href={"/profile"}><DropdownMenuItem >Profile</DropdownMenuItem></Link>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500" >
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
