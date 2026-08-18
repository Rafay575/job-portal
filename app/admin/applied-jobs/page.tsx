"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaBriefcase, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";

import { groupApplicationsByUser } from "@/lib/utils/groupApplications";

import type { GroupedUserApplications } from "@/types/appliedJobs";

import UserApplicationsDialog from "@/components/UserApplicationsDialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { getAppliedJobs } from "@/lib/getJobs";
import { Eye } from "lucide-react";

export const formatDate = (date: string) => {
  if (!date) return "N/A";

  try {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return date;
  }
};

export default function AppliedJobsTable() {
  const [applications, setApplications] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] =
    useState<GroupedUserApplications | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);

        const response = await getAppliedJobs({
          page: 1,
          limit: 100,
        });

        if (!response.success) {
          throw new Error("Failed to load applications");
        }

        setApplications(response.data);
      } catch (error) {
        console.error(error);

        toast.error("Failed to load applied jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // ============================================================
  // GROUP USERS
  // ============================================================

  const groupedUsers = useMemo(() => {
    const groups = groupApplicationsByUser(applications);

    // Search across USER + ALL applications
    if (!search.trim()) {
      return groups;
    }

    const query = search.toLowerCase().trim();

    return groups.filter((group) => {
      // User fields
      const userMatch =
        String(group.user.id).toLowerCase().includes(query) ||
        group.user.name.toLowerCase().includes(query) ||
        group.user.email.toLowerCase().includes(query);

      if (userMatch) return true;

      // Search every application
      return group.applications.some((application) => {
        const job = application.job;

        const values = [
          job.sale_id,
          job.title,
          job.category,
          job.position_type,
          job.salary,
          job.office,
          job.unit,
          job.region,
          job.status,
          application.appliedAt,
          application.applicationId,
        ];

        return values.some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query),
        );
      });
    });
  }, [applications, search]);

  // ============================================================
  // OPEN MODAL
  // ============================================================

  const openUserApplications = (user: GroupedUserApplications) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="w-full space-y-5 py-5 px-5">
        {/* HEADER */}

        <div>
          <h1 className="text-3xl font-bold text-primary">Applied Jobs</h1>

          <p className="text-sm text-muted-foreground mt-1">
            View users and their job applications.
          </p>
        </div>

        {/* SEARCH */}

        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, job title, category, salary..."
            className="pl-9"
          />
        </div>

        {/* TABLE */}

        <div className="border  overflow-hidden bg-white dark:bg-slate-900">
          <Table className="px-6">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">#</TableHead>

                <TableHead>User</TableHead>

                <TableHead>Email</TableHead>

                <TableHead>Applications</TableHead>

                <TableHead>Latest Applied</TableHead>

                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                Array.from({
                  length: 5,
                }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={6}>
                      <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : groupedUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No applications found.
                  </TableCell>
                </TableRow>
              ) : (
                groupedUsers.map((group, index) => (
                  <motion.tr
                    key={group.user.id}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.04,
                    }}
                    className=" hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <TableCell>{index + 1}</TableCell>

                    {/* USER */}

                    <TableCell>
                      <div className="font-semibold text-primary">{group.user.name}</div>
                    </TableCell>

                    {/* EMAIL */}

                    <TableCell>
                      <span className="text-sm">{group.user.email}</span>
                    </TableCell>

                    {/* COUNT */}

                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        <FaBriefcase className="text-primary size-"/>

                        {group.totalApplications}

                        {group.totalApplications === 1
                          ? " Application"
                          : " Applications"}
                      </Badge>
                    </TableCell>

                    {/* LATEST */}

                    <TableCell>
                      <span className="text-sm">
                        {formatDate(group.latestAppliedAt)}
                      </span>
                    </TableCell>

                    {/* ACTION */}

                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openUserApplications(group)}
                        className="gap-2 text-primary"
                      >
                        <Eye />
                        View
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* FOOTER */}

        {!loading && groupedUsers.length > 0 && (
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>
              Showing <strong>{groupedUsers.length}</strong> users
            </span>

            <span>{applications.length} total applications</span>
          </div>
        )}
      </div>

      {/* USER APPLICATION MODAL */}

      <UserApplicationsDialog
        user={selectedUser}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
