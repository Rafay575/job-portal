"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Briefcase,
  CheckCircle2,
  UserCheck,
  Layers,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboard, getLatestUsers } from "@/lib/api/Dashboard";
import { FullPageLoader } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatMonth = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", { month: "short" });
};

const groupByMonth = (data: any[]) => {
  const map: Record<string, any> = {};

  // Step 1: Initialize ALL months with 0
  MONTHS.forEach((month) => {
    map[month] = {
      month,
      permanent: 0,
      agency: 0,
      both: 0,
    };
  });

  // Step 2: Fill real data
  data.forEach((item) => {
    const month = formatMonth(item.created_at);

    if (map[month]) {
      if (item.type === "permanent") map[month].permanent += 1;
      if (item.type === "agency-work") map[month].agency += 1;
      if (item.type === "both") map[month].both += 1;
    }
  });

  // Step 3: Return in correct order
  return MONTHS.map((m) => map[m]);
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
const formatType = (type: string) => {
  if (type === "permanent") return "Permanent";
  if (type === "agency-work") return "Agency Work";
  if (type === "both") return "Both";
  return "Not Submitted";
};
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
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
export default function AdminDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latestUsers, setLatestUsers] = useState([]);
  const totalUsers = data.length;
  const permanentUsers = data.filter((u: any) => u.type === "permanent").length;
  const agencyUsers = data.filter((u: any) => u.type === "agency-work").length;
  const bothUsers = data.filter((u: any) => u.type === "both").length;
  const jobPositions = [
    {
      name: "Permanent",
      value: permanentUsers,
      color: "#5C49D8",
    },
    {
      name: "Agency Work",
      value: agencyUsers,
      color: "#10b981",
    },
    {
      name: "Both",
      value: bothUsers,
      color: "#f59e0b",
    },
  ];
  const kpiCards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      description: "All registered employees",
      highlight: true,
    },
    {
      title: "Permanent",
      value: permanentUsers,
      icon: UserCheck,
      description: "Permanent employees",
      highlight: true,
    },
    {
      title: "Agency Work",
      value: agencyUsers,
      icon: Briefcase,
      description: "Agency employees",
      highlight: true,
    },
    {
      title: "Both Type",
      value: bothUsers,
      icon: Layers,
      description: "Both category users",
      highlight: true,
    },
  ];
  const fetchData = async () => {
    const res = await getDashboard();
    if (res.success) {
      setData(res.data);
    } else {
      setError(res.message);
    }
  };
  const fetchLatest = async () => {
    const res = await getLatestUsers();
    if (res.success) {
      setLatestUsers(res.data);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    fetchLatest();
    setLoading(false);
  }, []);

  const chartData = groupByMonth(data);

  if (loading) return <FullPageLoader />;
  if (error) return <p>{error}</p>;
  return (
    <div className="w-full min-h-screen bg-gradient-to-br  p-8 max-w-full overflow-x-hidden">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold  mb-2 text-primary">
            Recruitment Dashboard
          </h1>
          <p className="">
            Monitor applications, candidates, and hiring metrics
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 max-w-full overflow-x-hidden">
          {kpiCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <Card key={index} className="border-slate-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-primary">
                    <span>{card.title}</span>
                    {Icon && <Icon className="w-5 h-5 text-primary" />}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="text-4xl font-bold text-gray-700">
                    {card.value}
                  </div>

                  <p
                    className={`text-sm mt-2 flex items-center gap-1 text-primary`}
                  >
                    {card.highlight && <TrendingUp className="w-4 h-4" />}
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 max-w-full overflow-x-hidden">
          {/* Applications & Hires Trend */}
          <Card className="lg:col-span-2 border-slate-300">
            <CardHeader>
              <CardTitle className="text-primary">
                User Registrations Trend
              </CardTitle>
              <CardDescription className="text-gray-500">
                Monthly employee registrations by type
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                  <XAxis dataKey="month" stroke="#5C49D8" />
                  <YAxis stroke="#5C49D8" />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #5C49D8",
                      borderRadius: "8px",
                    }}
                  />

                  <Legend />

                  {/* Permanent */}
                  <Line
                    type="monotone"
                    dataKey="permanent"
                    stroke="#5C49D8"
                    strokeWidth={2}
                    name="Permanent"
                  />

                  {/* Agency Work */}
                  <Line
                    type="monotone"
                    dataKey="agency"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Agency Work"
                  />

                  {/* Both */}
                  <Line
                    type="monotone"
                    dataKey="both"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Both"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Job Positions Distribution */}
          <Card className="border-slate-300 ">
            <CardHeader>
              <CardTitle className="text-primary">
                User Type Distribution
              </CardTitle>
              <CardDescription className="text-gray-500">
                Breakdown of employee types
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={jobPositions}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {jobPositions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#374151" }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-4 space-y-2">
                {jobPositions.map((pos) => (
                  <div
                    key={pos.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: pos.color }}
                      />
                      <span className="text-gray-700">{pos.name}</span>
                    </div>

                    <span className="text-primary font-semibold">
                      {pos.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-300 max-w-full overflow-x-hidden">
          <CardHeader>
            <CardTitle className="text-primary">Recent Candidates</CardTitle>
            <CardDescription className="text-gray-500">
              Latest applicants and their status
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 bg-gray-200">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-center">Type</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {latestUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-gray-400 py-6"
                      >
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    latestUsers.map((user: any) => (
                      <TableRow
                        key={user.id}
                        className="border-slate-200 hover:bg-gray-50 transition"
                      >
                        {/* Name */}
                        <TableCell className="text-gray-800 font-medium">
                          {user.name}
                        </TableCell>

                        {/* Email */}
                        <TableCell className="text-gray-600">
                          {user.email}
                        </TableCell>

                        {/* Phone */}
                        <TableCell className="text-gray-600">
                          {user.phone || "NA"}
                        </TableCell>

                        {/* Type */}
                        <TableCell className="text-center">
                          <Badge
                            className={` text-white w-[100px] ${getTypeStyles(user.type)}`}
                          >
                            {formatType(user.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div
                            className={`font-[500] py-0.5 w-[65px] mx-auto rounded-full text-[11px] text-center ${getStatusStyles(user.is_approved)}`}
                          >
                            {user.is_approved === "approved"
                              ? "Approved"
                              : user.is_approved === "pending"
                                ? "Pending"
                                : "Rejected"}
                          </div>
                        </TableCell>

                        {/* Date */}
                        <TableCell className="text-gray-500">
                          {formatDate(user.created_at)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <Link href={"/admin/users"} className="">
              <Button className="mt-3" size={"sm"}>
                View All Users
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
