import React from 'react'
import { IoSearchOutline } from "react-icons/io5";

export default function HeaderSearchBar() {
    return (
        <div className="w-[70%] sm:w-[55%] lg:w-[50%] relative flex items-center h-[35px] md:h-[40px]">
            <IoSearchOutline className="bg-primary/5 text-[20px] text-[var(--foreground)] h-[100%] w-[40px] pl-[15px] rounded-tl-[25px] rounded-bl-[25px] " />
            <input type="search" placeholder="Search" className="bg-primary/5! py-[7px] pl-[5px] pr-[20px] h-[100%] focus:outline-0 !border-0  !rounded-tr-[25px] !rounded-br-[25px] w-full para !rounded-tl-[0px] !rounded-bl-[0px]" />
        </div>
    )
}
