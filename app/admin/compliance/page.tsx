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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ✅ Type added
type User = {
  id: number;
  full_name: string | null;
  email: string | null;
  type: string | null;
  phone: string | null;
  nationality: string | null;
  created_at: string | null;
};

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users", {
          cache: "no-store", // ✅ important for fresh data
        });
        const json = await res.json();

        if (json.success) {
          setUsers(json.data);
          console.log("data",json.data)
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // ✅ stop loading
      }
    };

    fetchUsers();
  }, []);

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-primary text-3xl">Compliance</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table className="border rounded-2xl">
            <TableHeader>
              <TableRow className="border-slate-200">
                <TableHead className="text-gray-600">Name</TableHead>
                <TableHead className="text-gray-600">Email</TableHead>
                <TableHead className="text-gray-600">Type</TableHead>
                <TableHead className="text-gray-600">Phone</TableHead>
                <TableHead className="text-gray-600">Nationality</TableHead>
                <TableHead className="text-gray-600">Created At</TableHead>
                <TableHead className="text-gray-600 text-center">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* ✅ Loading */}
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Loading...
                  </TableCell>
                </TableRow>
              )}

              {/* ✅ Empty State */}
              {!loading && users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No users found
                  </TableCell>
                </TableRow>
              )}

              {/* ✅ Data */}
              {!loading &&
                users.map((user) => (
                  <TableRow
                    key={user.id} // ✅ fixed
                    className="border-slate-200 hover:bg-gray-50 transition"
                  >
                    <TableCell className="font-medium text-gray-800 capitalize">
                      {user.full_name || "N/A"}
                    </TableCell>

                    <TableCell className="text-gray-600">
                      {user.email || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {user.type || "N/A"}
                    </TableCell>

                    <TableCell className="text-gray-600">
                      {user.phone || "N/A"}
                    </TableCell>

                    <TableCell className="text-gray-600">
                      {user.nationality || "N/A"}
                    </TableCell>

                    <TableCell className="text-gray-500">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "N/A"}
                    </TableCell>

                    <TableCell className="text-center">
                      <ActionsMenu id={user.id} />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

const ActionsMenu = ({ id }: { id: number }) => {
  const router = useRouter();

  const handleView = () => {
    router.push(`/admin/compliance/${id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleView}>
          <Eye className="w-4 h-4 mr-2" />
          View
        </DropdownMenuItem>

        <DropdownMenuItem className="text-red-600">
          <Trash className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};