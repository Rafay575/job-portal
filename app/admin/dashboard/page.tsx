"use client";

import {
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
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
  UserCheck,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboard, getLatestUsers } from "@/lib/api/Dashboard";
import { FullPageLoader } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// 2. Import Shadcn Chart Utilities
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

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
      return "bg-[#5C49D8] text-white";
    case "agency-work":
      return "bg-[#10B981] text-white ";
    case "both":
      return "bg-[#F59E0B] text-white";
    default:
      return "bg-gray-100 text-gray-500 ";
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
      return "bg-[#10B981] text-white";
    case "pending":
      return "bg-[#F59E0B] text-white";
    case "rejected":
      return "bg-[#EF4444] text-white ";
    default:
      return "bg-gray-100 text-gray-500 border border-gray-200";
  }
};

const getInitials = (name: string) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
  return initials.toUpperCase();
};

const chartConfig = {
  permanent: {
    label: "Permanent",
    color: "#5C49D8",
  },
  agency: {
    label: "Agency Work",
    color: "#10b981",
  },
  both: {
    label: "Both",
    color: "#f59e0b",
  },
} satisfies ChartConfig;

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
      color: "#3d3d3d",
    },
    {
      title: "Permanent",
      value: permanentUsers,
      icon: UserCheck,
      description: "Permanent employees",
      highlight: true,
      color: "#5C49D8",
    },
    {
      title: "Agency Work",
      value: agencyUsers,
      icon: Briefcase,
      description: "Agency employees",
      highlight: true,
      color: "#10b981",
    },
    {
      title: "Both Type",
      value: bothUsers,
      icon: Layers,
      description: "Both category users",
      highlight: true,
      color: "#f59e0b",
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
    <div className="w-full min-h-screen bg-slate-50 p-6 md:p-8 max-w-full overflow-x-hidden">
      <div className="mx-auto ">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-700">
            Recruitment Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Monitor applications, candidates, and hiring metrics
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4 max-w-full overflow-x-hidden">
          {kpiCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <Card
                key={index}
                className="relative overflow-hidden border border-slate-200 shadow-sm transition-shadow hover:shadow-md"
                style={{ borderTopWidth: 7, borderTopColor: card.color }}
              >
                <CardContent className="pt-2 ">
                  <div className="flex items-start justify-between" >
                    <div>
                      <p className="text-sm font-medium text-slate-500" >
                        {card.title}
                      </p>
                      <div className="mt-2 text-3xl font-bold text-slate-700">
                        {card.value}
                      </div>
                    </div>

                    {Icon && (
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: `${card.color}1A`,
                        }}
                      >
                        <Icon
                          className="h-5 w-5"
                          style={{ color: card.color }}
                        />
                      </div>
                    )}
                  </div>

                  <p className="mt-3 flex items-center gap-1 text-xs " style={{ color: card.color }}>
                    {card.highlight && (
                      <TrendingUp
                        className="h-3.5 w-3.5"
                        style={{ color: card.color }}
                      />
                    )}
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 max-w-full overflow-x-hidden">
          {/* User Registrations Trend */}
          <Card className="lg:col-span-2 border border-slate-200 shadow-sm h-full flex flex-col max-h-[500px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-700">
                User Registrations Trend
              </CardTitle>
              <CardDescription className="text-slate-500">
                Monthly employee registrations by type
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 min-h-0">
              <ChartContainer config={chartConfig} className="h-[100%] w-full">
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    top: 10,
                    left: 12,
                    right: 12,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    domain={[0, "auto"]}
                    allowDecimals={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />

                  <ChartTooltip
                    cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                    content={<ChartTooltipContent indicator="dot" />}
                  />

                  <defs>
                    <linearGradient
                      id="fillPermanent"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#5C49D8" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#5C49D8"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillAgency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#10b981"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillBoth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#f59e0b"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>

                  <Area
                    dataKey="permanent"
                    type="monotone"
                    fill="url(#fillPermanent)"
                    fillOpacity={0.4}
                    stroke="#5C49D8"
                    strokeWidth={2}
                  />
                  <Area
                    dataKey="agency"
                    type="monotone"
                    fill="url(#fillAgency)"
                    fillOpacity={0.4}
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                  <Area
                    dataKey="both"
                    type="monotone"
                    fill="url(#fillBoth)"
                    fillOpacity={0.4}
                    stroke="#f59e0b"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Job Positions Distribution */}
          <Card className="border border-slate-200 shadow-sm h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-700">
                User Type Distribution
              </CardTitle>
              <CardDescription className="text-slate-500">
                Breakdown of employee types
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-between min-h-0 pb-4">
              <div className="w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={jobPositions}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
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
                        borderRadius: "10px",
                        fontSize: "13px",
                      }}
                      labelStyle={{ color: "#374151" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2.5 mt-auto">
                {jobPositions.map((pos) => (
                  <div
                    key={pos.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: pos.color }}
                      />
                      <span className="text-slate-700">{pos.name}</span>
                    </div>

                    <span className="text-slate-700 font-semibold">
                      {pos.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Candidates */}
        <Card className="border border-slate-200 shadow-sm max-w-full overflow-x-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base font-semibold text-slate-700">
                Recent Candidates
              </CardTitle>
              <CardDescription className="text-slate-500">
                Latest applicants and their status
              </CardDescription>
            </div>
            <Link href={"/admin/users"}>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                View All Users
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="pt-2">
            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 bg-slate-50 hover:bg-slate-50">
                    <TableHead className="text-slate-500 font-medium">
                      Name
                    </TableHead>
                    <TableHead className="text-slate-500 font-medium">
                      Email
                    </TableHead>
                    <TableHead className="text-slate-500 font-medium">
                      Phone
                    </TableHead>
                    <TableHead className="text-center text-slate-500 font-medium">
                      Type
                    </TableHead>
                    <TableHead className="text-center text-slate-500 font-medium">
                      Status
                    </TableHead>
                    <TableHead className="text-slate-500 font-medium">
                      Date
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {latestUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-slate-400 py-10"
                      >
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    latestUsers.map((user: any) => (
                      <TableRow
                        key={user.id}
                        className="border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        {/* Name */}
                        <TableCell className="font-medium text-slate-800">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5C49D8]/10 text-[11px] font-semibold text-[#5C49D8]">
                              {getInitials(user.name)}
                            </div>
                            {user.name}
                          </div>
                        </TableCell>

                        {/* Email */}
                        <TableCell className="text-slate-500">
                          {user.email}
                        </TableCell>

                        {/* Phone */}
                        <TableCell className="text-slate-500">
                          {user.phone || "NA"}
                        </TableCell>

                        {/* Type */}
                        <TableCell className="text-center">
                          <Badge
                            className={`font-medium w-[90px] justify-center rounded-full ${getTypeStyles(user.type)}`}
                          >
                            {formatType(user.type)}
                          </Badge>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <div
                            className={`font-medium py-0.5 w-[70px] mx-auto rounded-full text-[11px] text-center ${getStatusStyles(user.is_approved)}`}
                          >
                            {user.is_approved === "approved"
                              ? "Approved"
                              : user.is_approved === "pending"
                                ? "Pending"
                                : "Rejected"}
                          </div>
                        </TableCell>

                        {/* Date */}
                        <TableCell className="text-slate-500">
                          {formatDate(user.created_at)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}