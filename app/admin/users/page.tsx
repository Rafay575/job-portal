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
import { Checkbox } from "@/components/ui/checkbox";
import {
  MoreHorizontal,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { FiCheck } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import { useDebouncedCallback } from "use-debounce";
import { FullPageLoader } from "@/components/Loading";
import {
  fetchAllUsers,
  approveUser,
  deleteUser,
  rejectUser,
  bulkApproveUsers,
  bulkRejectUsers,
  bulkDeleteUsers,
} from "@/lib/users";
import { Badge } from "@/components/ui/badge";
import { CiEdit } from "react-icons/ci";
import Link from "next/link";
import { GoPlus } from "react-icons/go";

type User = {
  id: number;
  name: string | null;
  email: string | null;
  role: string | null;
  type: string | null;
  created_at: string | null;
  updated_at: string | null;
  is_approved: "pending" | "approved" | "rejected";
};

type StatusFilter = "all" | "approved" | "pending" | "rejected";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const getStatusStyles = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-600 text-white ";
    case "pending":
      return "bg-gray-500 text-white ";
    case "rejected":
      return "bg-red-500 text-white ";
    default:
      return "bg-gray-400 text-white ";
  }
};
const getTypeStyles = (type: string | null) => {
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
const formatType = (type: string | null) => {
  if (type === "permanent") return "Permanent";
  if (type === "agency-work") return "Agency Work";
  if (type === "both") return "Both";
  return "Not Submitted";
};
export default function UsersListTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingForStatus, setLoadingForStatus] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const debouncedSetSearch = useDebouncedCallback((val: string) => {
    setSearch(val);
    setCurrentPage(1);
  }, 400);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    debouncedSetSearch(e.target.value);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setSelectedIds(new Set());
    const result = await fetchAllUsers({
      search,
      status: statusFilter,
      page: currentPage,
      type: typeFilter,
      pageSize,
    });
    if (result.success) {
      setUsers(result.data);
      setTotalCount(result.total);
    } else {
      toast.error(result.message ?? "Failed to load users");
    }
    setLoading(false);
  }, [search, statusFilter, currentPage, pageSize, typeFilter]);

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    setCurrentPage(1);
    setSelectedIds(new Set());
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ── Selection helpers ──
  const allCurrentIds = users.map((u) => u.id);
  const isAllSelected =
    allCurrentIds.length > 0 &&
    allCurrentIds.every((id) => selectedIds.has(id));
  const isIndeterminate =
    !isAllSelected && allCurrentIds.some((id) => selectedIds.has(id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        allCurrentIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        allCurrentIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const showBulkApprove =
    statusFilter === "pending" || statusFilter === "rejected";
  const showBulkReject =
    statusFilter === "pending" || statusFilter === "approved";

  // ── Bulk actions ──
  const handleBulkApprove = () => {
    const ids = Array.from(selectedIds);
    if (!ids.length) return toast.error("No users selected");
    toast.custom((t) => (
      <div className="bg-white shadow-lg rounded-lg p-4 border w-[300px]">
        <p className="text-sm font-medium mb-3">
          Approve <span className="font-bold">{ids.length}</span> selected
          user(s)?
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 text-sm rounded bg-gray-200"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 text-sm rounded bg-primary text-white"
            onClick={async () => {
              toast.dismiss(t.id);
              setBulkLoading(true);
              const res = await bulkApproveUsers(ids);
              if (res.success) {
                toast.success(`${res.updated} user(s) approved`);
                fetchUsers();
              } else toast.error(res.message);
              setBulkLoading(false);
            }}
          >
            Approve
          </button>
        </div>
      </div>
    ));
  };

  const handleBulkReject = () => {
    const ids = Array.from(selectedIds);
    if (!ids.length) return toast.error("No users selected");
    toast.custom((t) => (
      <div className="bg-white shadow-lg rounded-lg p-4 border w-[300px]">
        <p className="text-sm font-medium mb-3">
          Reject <span className="font-bold">{ids.length}</span> selected
          user(s)?
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 text-sm rounded bg-gray-200"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 text-sm rounded bg-red-600 text-white"
            onClick={async () => {
              toast.dismiss(t.id);
              setBulkLoading(true);
              const res = await bulkRejectUsers(ids);
              if (res.success) {
                toast.success(`${res.updated} user(s) rejected`);
                fetchUsers();
              } else toast.error(res.message);
              setBulkLoading(false);
            }}
          >
            Reject
          </button>
        </div>
      </div>
    ));
  };

  const handleBulkDelete = () => {
    const ids = Array.from(selectedIds);
    if (!ids.length) return toast.error("No users selected");
    toast.custom((t) => (
      <div className="bg-white shadow-lg rounded-lg p-4 border w-[300px]">
        <p className="text-sm font-medium mb-3">
          Delete <span className="font-bold">{ids.length}</span> selected
          user(s)? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 text-sm rounded bg-gray-200"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 text-sm rounded bg-red-600 text-white"
            onClick={async () => {
              toast.dismiss(t.id);
              setBulkLoading(true);
              const res = await bulkDeleteUsers(ids);
              if (res.success) {
                toast.success(`${res.deleted} user(s) deleted`);
                fetchUsers();
              } else toast.error(res.message);
              setBulkLoading(false);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  const handleStatusChange = (v: string) => {
    setStatusFilter(v as StatusFilter);
    setCurrentPage(1);
    setSelectedIds(new Set());
  };
  const handlePageSizeChange = (v: string) => {
    setPageSize(Number(v));
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const pageNumbers: number[] = [];
  const delta = 2;
  const left = Math.max(1, currentPage - delta);
  const right = Math.min(totalPages, currentPage + delta);
  for (let i = left; i <= right; i++) pageNumbers.push(i);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loadingForStatus || bulkLoading) return <FullPageLoader />;

  return (
    <Card className="border-0 shadow-none max-w-[100%]">
      <CardHeader>
        <CardTitle className="text-primary text-3xl lato">All Users</CardTitle>
        <p className="text-gray-600">
          Manage team members, roles, and access permissions in one place.
        </p>
      </CardHeader>

      <CardContent className="space-y-4 w-full!">
        {/* ── Filters + Bulk Actions Row ── */}
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email…"
              value={searchInput}
              onChange={handleSearchChange}
              className="pl-9"
            />
          </div>

          {/* Bulk action buttons */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground self-center">
                {selectedIds.size} selected
              </span>
              {showBulkApprove && (
                <Button
                  size="sm"
                  className="bg-primary text-white hover:bg-primary/90 gap-1.5"
                  onClick={handleBulkApprove}
                >
                  <FiCheck className="w-4 h-4" /> Bulk Approve
                </Button>
              )}
              {showBulkReject && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="text-white gap-1.5"
                  onClick={handleBulkReject}
                >
                  <RxCross1 className="w-4 h-4" /> Bulk Reject
                </Button>
              )}
              <Button
                size="sm"
                variant="destructive"
                className="text-white gap-1.5"
                onClick={handleBulkDelete}
              >
                <Trash2 className="w-4 h-4" /> Bulk Delete
              </Button>
            </div>
          )}
          <Select value={typeFilter} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="permanent">Permanent</SelectItem>
              <SelectItem value="agency-work">Agency</SelectItem>
              <SelectItem value="both">Both</SelectItem>
              <SelectItem value="not_submitted">Not Submitted</SelectItem>
            </SelectContent>
          </Select>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
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
          <Link href={"/admin/users/create"}>
            <Button>
              Add New
              <GoPlus className="size-5" />
            </Button>
          </Link>
        </div>

        {/* ── Table ── */}
        <div className="max-w-full overflow-x-auto">
          <Table className="border rounded-2xl min-w-[100%]">
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="w-10">
                  <Checkbox
                    checked={isAllSelected}
                    data-state={
                      isIndeterminate
                        ? "indeterminate"
                        : isAllSelected
                          ? "checked"
                          : "unchecked"
                    }
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Registered At</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-10 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-13 w-13 animate-spin text-primary" />
                      <span className="text-sm">Loading data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!loading && users.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
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
                    className={`hover:bg-gray-50 transition ${selectedIds.has(user.id) ? "bg-primary/5" : ""}`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(user.id)}
                        onCheckedChange={() => toggleSelectOne(user.id)}
                        aria-label={`Select user ${user.name}`}
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell className="font-medium capitalize">
                      {user.name || "N/A"}
                    </TableCell>
                    <TableCell>{user.email || "N/A"}</TableCell>
                    {/* Type */}
                    <TableCell className="text-center">
                      <Badge
                        className={` text-white text-[11px] py-0.5 w-[80px] ${getTypeStyles(user.type)}`}
                      >
                        {formatType(user.type) || "NA"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div
                        className={`font-[500] py-0.5 w-[60px] mx-auto rounded-full text-[11px] text-center ${getStatusStyles(user.is_approved)}`}
                      >
                        {user.is_approved === "approved"
                          ? "Approved"
                          : user.is_approved === "pending"
                            ? "Pending"
                            : "Rejected"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.created_at ? formatDate(user.created_at) : "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      <AllUsersActionsMenu
                        id={user.id}
                        status={user.is_approved}
                        setLoading={setLoadingForStatus}
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
            <p className="text-sm italic text-primary">
              Showing{" "}
              <span className="font-semibold text-primary">
                {(currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, totalCount)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-primary">{totalCount}</span>{" "}
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
const AllUsersActionsMenu = ({
  id,
  status,
  setLoading,
  onUpdate,
}: {
  id: number;
  status: string;
  setLoading: (v: boolean) => void;
  onUpdate: () => void;
}) => {
  const router = useRouter();

  const handleApprove = () => {
    toast.custom((t) => (
      <div className="bg-white shadow-lg rounded-lg p-4 border w-[280px]">
        <p className="text-sm font-medium mb-3">
          Are you sure you want to approve this user?
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 text-sm rounded bg-gray-200"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 text-sm rounded bg-primary text-white"
            onClick={async () => {
              toast.dismiss(t.id);
              setLoading(true);
              const res = await approveUser(id);
              if (res.success) {
                toast.success("User approved");
                onUpdate();
              } else toast.error(res.message);
              setLoading(false);
            }}
          >
            Approve
          </button>
        </div>
      </div>
    ));
  };

  const handleReject = () => {
    toast.custom((t) => (
      <div className="bg-white shadow-lg rounded-lg p-4 border w-[280px]">
        <p className="text-sm font-medium mb-3">
          Are you sure you want to reject this user?
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 text-sm rounded bg-gray-200"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 text-sm rounded bg-red-600 text-white"
            onClick={async () => {
              toast.dismiss(t.id);
              setLoading(true);
              const res = await rejectUser(id);
              if (res.success) {
                toast.success("User rejected");
                onUpdate();
              } else toast.error(res.message);
              setLoading(false);
            }}
          >
            Reject
          </button>
        </div>
      </div>
    ));
  };

  const handleDelete = () => {
    toast.custom((t) => (
      <div className="bg-white shadow-lg rounded-lg p-4 border w-[280px]">
        <p className="text-sm font-medium mb-3">
          Are you sure you want to delete this user?
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 text-sm rounded bg-gray-200"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 text-sm rounded bg-red-600 text-white"
            onClick={async () => {
              toast.dismiss(t.id);
              setLoading(true);
              const res = await deleteUser(id);
              if (res.success) {
                toast.success("User deleted");
                onUpdate();
              } else toast.error(res.message);
              setLoading(false);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ));
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
          className="text-primary cursor-pointer"
        >
          <Eye className="w-4 h-4 mr-2 text-primary" />
          <span className="text-primary">View</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/admin/compliance/${id}/edit`)}
          className="text-primary cursor-pointer"
        >
          <CiEdit className="w-5 h-5 mr-2 text-primary" />
          <span className="text-primary">Edit</span>
        </DropdownMenuItem>
        {status === "pending" && (
          <>
            <DropdownMenuItem
              onClick={handleApprove}
              className="cursor-pointer"
            >
              <FiCheck className="w-4 h-4 mr-2 text-green-600" />
              <span className="text-green-600">Approve</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleReject} className="cursor-pointer">
              <RxCross1 className="w-4 h-4 mr-2 text-red-600" />
              <span className="text-red-600">Reject</span>
            </DropdownMenuItem>
          </>
        )}
        {status === "approved" && (
          <DropdownMenuItem onClick={handleReject} className="cursor-pointer">
            <RxCross1 className="w-4 h-4 mr-2 text-red-600" />
            <span className="text-red-600">Reject</span>
          </DropdownMenuItem>
        )}
        {status === "rejected" && (
          <DropdownMenuItem onClick={handleApprove} className="cursor-pointer">
            <FiCheck className="w-4 h-4 mr-2 text-green-600" />
            <span className="text-green-600">Approve</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-red-600 cursor-pointer"
        >
          <Trash2 className="w-4 h-4 mr-2 text-red-600" />
          <span className="text-red-600">Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
