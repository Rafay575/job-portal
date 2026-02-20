"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreHorizontalIcon, CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { format, isAfter, isBefore, isSameDay } from "date-fns";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  desiredJob: string;
  preferedLocation: string;
  appliedDate: Date;
}

export default function Page() {
  const router = useRouter();

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const [users] = useState<User[]>([
    {
      id: 1,
      name: "Abdullah Khan",
      email: "abdullah@gmail.com",
      phone: "+923144644174",
      desiredJob: "React Developer",
      preferedLocation: "Remote",
      appliedDate: new Date("2026-02-01"),
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@gmail.com",
      phone: "+447123456789",
      desiredJob: "UI Designer",
      preferedLocation: "London",
      appliedDate: new Date("2026-02-05"),
    },
    {
      id: 3,
      name: "John Doe",
      email: "john@gmail.com",
      phone: "+12125551234",
      desiredJob: "Backend Developer",
      preferedLocation: "Hybrid",
      appliedDate: new Date("2026-02-10"),
    },
  ]);

  // Range filter logic (inclusive)
  const filteredUsers = users.filter((u) => {
    if (!startDate && !endDate) return true;

    if (startDate && !endDate)
      return isSameDay(u.appliedDate, startDate) || isAfter(u.appliedDate, startDate);

    if (!startDate && endDate)
      return isSameDay(u.appliedDate, endDate) || isBefore(u.appliedDate, endDate);

    if (startDate && endDate)
      return (
        (isAfter(u.appliedDate, startDate) || isSameDay(u.appliedDate, startDate)) &&
        (isBefore(u.appliedDate, endDate) || isSameDay(u.appliedDate, endDate))
      );

    return true;
  });

  return (
    <div className="bg-white rounded-xl p-4 space-y-4">

      {/* Date Range Filter */}

      <div className="flex items-center justify-end gap-3">

        {/* Start Date */}
        {(startDate || endDate) && (
          <Button variant="ghost" onClick={() => {
            setStartDate(undefined);
            setEndDate(undefined);
          }}>
            Clear
          </Button>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <CalendarIcon size={16} />
              {startDate ? format(startDate, "PPP") : "Start date"}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="p-0">
            <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
          </PopoverContent>
        </Popover>

        {/* End Date */}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <CalendarIcon size={16} />
              {endDate ? format(endDate, "PPP") : "End date"}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="p-0">
            <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
          </PopoverContent>
        </Popover>

        
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Desired Job</TableHead>
            <TableHead>Preferred Location</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id} className="hover:bg-accent cursor-pointer">
              <TableCell>{user.id}</TableCell>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.desiredJob}</TableCell>
              <TableCell>{user.preferedLocation}</TableCell>
              <TableCell>{format(user.appliedDate, "dd MMM yyyy")}</TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/users/${user.id}`)}>
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}

          {!filteredUsers.length && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
