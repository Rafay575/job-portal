"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  Badge,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { approveUser, rejectUser } from "@/lib/usersApproval";
import { toast } from "sonner";
import { FiCheck } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import { useDebouncedCallback } from "use-debounce";

type User = {
  id: number;
  name: string | null;
  email: string | null;
  role: string | null;
  type: string | null;
  phone: string | null;
  postcode: string | null;
  nationality: string | null;
  created_at: string | null;
  updated_at: string | null;
  is_approved: number | boolean | null;
};

type StatusFilter = "all" | "approved" | "unapproved";
type TypeFilter = "all" | "permanent" | "agency-work" | "both";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
const getTypeStyles = (type: string|null) => {
  switch (type) {
    case "permanent":
      return "bg-primary text-white";
    case "agency-work":
      return "bg-[#10b981] text-white";
    case "both":
      return "bg-[#f59e0b] text-white";
    default:
      return "bg-gray-400 text-white";
  }
};

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ── Filter state ──
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState(""); // debounced value sent to API
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  // ── Pagination state ──
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Debounce search input by 400 ms so we don't fire on every keystroke
  const debouncedSetSearch = useDebouncedCallback((val: string) => {
    setSearch(val);
    setCurrentPage(1);
  }, 400);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    debouncedSetSearch(e.target.value);
  };

  // ── Fetch from backend whenever filters / page change ──
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (typeFilter !== "all") params.set("type", typeFilter);
      params.set("page", String(currentPage));
      params.set("pageSize", String(pageSize));

      const res = await fetch(`/api/users?${params.toString()}`, {
        cache: "no-store",
      });
      const json = await res.json();

      if (json.success) {
        setUsers(json.data);
        setTotalCount(json.total ?? json.data.length);
      } else {
        toast.error(json.message ?? "Failed to load users");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, typeFilter, currentPage, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset to page 1 when filters change (but not on page change itself)
  const handleStatusChange = (v: string) => {
    setStatusFilter(v as StatusFilter);
    setCurrentPage(1);
  };
  const handleTypeChange = (v: string) => {
    setTypeFilter(v as TypeFilter);
    setCurrentPage(1);
  };
  const handlePageSizeChange = (v: string) => {
    setPageSize(Number(v));
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Smart page number window (max 5 visible)
  const pageNumbers: number[] = [];
  const delta = 2;
  const left = Math.max(1, currentPage - delta);
  const right = Math.min(totalPages, currentPage + delta);
  for (let i = left; i <= right; i++) pageNumbers.push(i);

  return (
    <Card className="border-0 shadow-none max-w-[100%]">
      <CardHeader>
        <CardTitle className="text-primary text-3xl">Compliance</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 w-full!">
        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row gap-3 ">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone or nationality…"
              value={searchInput}
              onChange={handleSearchChange}
              className="pl-9"
            />
          </div>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="unapproved">Unapproved</SelectItem>
            </SelectContent>
          </Select>

          {/* Type filter */}
          <Select value={typeFilter} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="permanent">Permanent</SelectItem>
              <SelectItem value="agency-work">Agency Work</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>

          {/* Page size */}
          <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
    

        {/* ── Table ── */}
        <div className="max-w-full overflow-x-auto ">
          <Table className="border rounded-2xl min-w-[100%]">
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="w-12">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Nationality</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-6 text-muted-foreground"
                  >
                    Loading…
                  </TableCell>
                </TableRow>
              )}

              {!loading && users.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No users match your filters.
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                users.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-gray-50 transition"
                  >
                    
                    <TableCell className="text-muted-foreground text-sm">
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>

                    <TableCell className="font-medium capitalize" >
                      {user.name || "N/A"}
                    </TableCell>
                    <TableCell> {user.email || "N/A"}</TableCell>

                    <TableCell className="text-center">
                      <span className={` text-white px-2 font-[500] py-1    rounded-full text-xs text-center ${getTypeStyles(user.type)}`}>
                        {user.type || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell> {user.phone || "N/A"}</TableCell>
                    <TableCell> {user.nationality || "N/A"}</TableCell>

                    <TableCell>
                      <span
                        className={
                          user.is_approved
                            ? "text-green-600 font-medium"
                            : "text-red-500 font-medium"
                        }
                      >
                        {user.is_approved ? "Approved" : "Unapproved"}
                      </span>
                    </TableCell>

                    <TableCell>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "N/A"}
                    </TableCell>

                    <TableCell className="text-center">
                      <ActionsMenu
                        id={user.id}
                        status={user.is_approved}
                        onUpdate={fetchUsers}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* ── Pagination ── */}
        {!loading && totalCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <p className="text-sm italic text-primary ">
              Showing{" "}
              <span className="font-semibold text-primary ">
                {(currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, totalCount)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-primary ">{totalCount}</span>{" "}
              users
            </p>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {pageNumbers[0] > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </Button>
                  {pageNumbers[0] > 2 && (
                    <span className="px-1 text-muted-foreground">…</span>
                  )}
                </>
              )}

              {pageNumbers.map((p) => (
                <Button
                  key={p}
                  variant={p === currentPage ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </Button>
              ))}

              {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                  {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                    <span className="px-1 text-muted-foreground">…</span>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Actions Menu ──
const ActionsMenu = ({
  id,
  status,
  onUpdate,
}: {
  id: number;
  status: number | boolean | null;
  onUpdate: () => void;
}) => {
  const router = useRouter();

  const handleApprove = async () => {
    const res = await approveUser(id);
    if (res.success) {
      toast.success("User approved");
      onUpdate();
    } else {
      toast.error(res.message);
    }
  };

  const handleReject = async () => {
    const res = await rejectUser(id);
    if (res.success) {
      toast.success("User rejected");
      onUpdate();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/admin/compliance/${id}`)}
          className="text-primary"
        >
          <Eye className="w-4 h-4 mr-2 text-primary" />
          View
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleApprove} >
          <FiCheck className="w-4 h-4 mr-2 text-green-600" />
          <span className="text-green-600">Approve</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleReject} >
          <RxCross1 className="w-4 h-4 mr-2 text-red-600" />
          <span className="text-red-600">Reject</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
