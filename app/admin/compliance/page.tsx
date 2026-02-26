"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type User = {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "HR" | "Manager" | "User";
  status: "Active" | "Inactive" | "Suspended";
  createdAt: string;
};

const users: User[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    createdAt: "2025-01-12",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "HR",
    status: "Active",
    createdAt: "2025-02-02",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    role: "Manager",
    status: "Inactive",
    createdAt: "2025-01-28",
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma@example.com",
    role: "User",
    status: "Suspended",
    createdAt: "2025-02-10",
  },
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    createdAt: "2025-01-12",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "HR",
    status: "Active",
    createdAt: "2025-02-02",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    role: "Manager",
    status: "Inactive",
    createdAt: "2025-01-28",
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma@example.com",
    role: "User",
    status: "Suspended",
    createdAt: "2025-02-10",
  },
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    createdAt: "2025-01-12",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "HR",
    status: "Active",
    createdAt: "2025-02-02",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    role: "Manager",
    status: "Inactive",
    createdAt: "2025-01-28",
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma@example.com",
    role: "User",
    status: "Suspended",
    createdAt: "2025-02-10",
  },
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    createdAt: "2025-01-12",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "HR",
    status: "Active",
    createdAt: "2025-02-02",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    role: "Manager",
    status: "Inactive",
    createdAt: "2025-01-28",
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma@example.com",
    role: "User",
    status: "Suspended",
    createdAt: "2025-02-10",
  },
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    createdAt: "2025-01-12",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "HR",
    status: "Active",
    createdAt: "2025-02-02",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    role: "Manager",
    status: "Inactive",
    createdAt: "2025-01-28",
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma@example.com",
    role: "User",
    status: "Suspended",
    createdAt: "2025-02-10",
  },
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    createdAt: "2025-01-12",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "HR",
    status: "Active",
    createdAt: "2025-02-02",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    role: "Manager",
    status: "Inactive",
    createdAt: "2025-01-28",
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma@example.com",
    role: "User",
    status: "Suspended",
    createdAt: "2025-02-10",
  },
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    createdAt: "2025-01-12",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "HR",
    status: "Active",
    createdAt: "2025-02-02",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    role: "Manager",
    status: "Inactive",
    createdAt: "2025-01-28",
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma@example.com",
    role: "User",
    status: "Suspended",
    createdAt: "2025-02-10",
  },
];

function getStatusVariant(status: User["status"]) {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700 border-green-200";
    case "Inactive":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "Suspended":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "";
  }
}

export default function UsersTable() {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-primary text-3xl">Compliance</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200">
                <TableHead className="text-gray-600">Name</TableHead>
                <TableHead className="text-gray-600">Email</TableHead>
                <TableHead className="text-gray-600">Role</TableHead>
                <TableHead className="text-gray-600">Status</TableHead>
                <TableHead className="text-gray-600">Created At</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-slate-200 hover:bg-gray-50 transition"
                >
                  <TableCell className="font-medium text-gray-800">
                    {user.name}
                  </TableCell>

                  <TableCell className="text-gray-600">
                    {user.email}
                  </TableCell>

                  <TableCell className="text-gray-600">
                    {user.role}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusVariant(user.status)}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-gray-500">
                    {user.createdAt}
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