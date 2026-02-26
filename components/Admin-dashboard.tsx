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
import { TrendingUp, Users, Briefcase, CheckCircle2 } from "lucide-react";

// Dummy data for recruitment metrics
const applicationData = [
  { month: "Jan", applications: 240, hired: 24 },
  { month: "Feb", applications: 390, hired: 38 },
  { month: "Mar", applications: 420, hired: 45 },
  { month: "Apr", applications: 380, hired: 42 },
  { month: "May", applications: 520, hired: 58 },
  { month: "Jun", applications: 610, hired: 68 },
];

const jobPositions = [
  { name: "Software Engineer", value: 45, color: "#0066CC" },
  { name: "Product Manager", value: 18, color: "#0080FF" },
  { name: "Designer", value: 22, color: "#00A3FF" },
  { name: "DevOps", value: 15, color: "#4DB8FF" },
];

const candidatePool = [
  {
    id: 1,
    name: "Alice Johnson",
    position: "Senior Developer",
    status: "Interviewed",
    date: "2024-02-20",
  },
  {
    id: 2,
    name: "Bob Smith",
    position: "UX Designer",
    status: "Reviewing",
    date: "2024-02-19",
  },
  {
    id: 3,
    name: "Carol White",
    position: "Product Manager",
    status: "Offered",
    date: "2024-02-18",
  },
  {
    id: 4,
    name: "David Lee",
    position: "QA Engineer",
    status: "Interviewed",
    date: "2024-02-17",
  },
  {
    id: 5,
    name: "Emma Davis",
    position: "DevOps Engineer",
    status: "Applied",
    date: "2024-02-16",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Offered":
      return "bg-emerald-100 text-emerald-800";
    case "Interviewed":
      return "bg-blue-100 text-blue-800";
    case "Reviewing":
      return "bg-amber-100 text-amber-800";
    case "Applied":
      return "bg-slate-100 text-slate-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
};

export default function AdminDashboard() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br  p-8">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Total Applications */}
          <Card className="border-slate-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-primary">
                <span>Total Applications</span>
                <Users className="w-5 h-5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-700">2,560</div>
              <p className="text-sm text-primary flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4" /> 12% increase
              </p>
            </CardContent>
          </Card>

          {/* Active Positions */}
          <Card className="border-slate-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-primary">
                <span>Active Positions</span>
                <Briefcase className="w-5 h-5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-700">24</div>
              <p className="text-sm text-gray-500 mt-2">
                Across all departments
              </p>
            </CardContent>
          </Card>

          {/* Hired This Month */}
          <Card className="border-slate-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-primary">
                <span>Hired This Month</span>
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-700">68</div>
              <p className="text-sm text-primary flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4" /> 8% above target
              </p>
            </CardContent>
          </Card>

          {/* Avg. Offer Rate */}
          <Card className="border-slate-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-primary">
                <span>Avg. Offer Rate</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-700">34%</div>
              <p className="text-sm text-gray-500 mt-2">
                Of total applications
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Applications & Hires Trend */}
          <Card className="lg:col-span-2 border-slate-300">
            <CardHeader>
              <CardTitle className="text-primary">
                Applications & Hires Trend
              </CardTitle>
              <CardDescription className="text-gray-500">
                Last 6 months performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={applicationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#374151" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="#0066CC"
                    strokeWidth={2}
                    dot={{ fill: "#0066CC" }}
                    name="Total Applications"
                  />
                  <Line
                    type="monotone"
                    dataKey="hired"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981" }}
                    name="Hired"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Job Positions Distribution */}
          <Card className="border-slate-300">
            <CardHeader>
              <CardTitle className="text-primary">Hiring by Position</CardTitle>
              <CardDescription className="text-gray-500">
                Current distribution
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

        <Card className="mb-8 border-slate-300">
          <CardHeader>
            <CardTitle className="text-primary">
              Applications by Status
            </CardTitle>
            <CardDescription className="text-gray-500">
              Monthly application status breakdown
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={applicationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#374151" }}
                />
                <Legend />
                <Bar
                  dataKey="applications"
                  fill="#0066CC"
                  radius={[8, 8, 0, 0]}
                  name="Applications"
                />
                <Bar
                  dataKey="hired"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                  name="Hired"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-slate-300">
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
                  <TableRow className="border-slate-200 hover:bg-gray-50">
                    <TableHead className="text-gray-600">Name</TableHead>
                    <TableHead className="text-gray-600">Position</TableHead>
                    <TableHead className="text-gray-600">Status</TableHead>
                    <TableHead className="text-gray-600">
                      Date Applied
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {candidatePool.map((candidate) => (
                    <TableRow
                      key={candidate.id}
                      className="border-slate-200 hover:bg-gray-50 transition"
                    >
                      <TableCell className="text-gray-800 font-medium">
                        {candidate.name}
                      </TableCell>

                      <TableCell className="text-gray-600">
                        {candidate.position}
                      </TableCell>

                      <TableCell>
                        <Badge className={getStatusColor(candidate.status)}>
                          {candidate.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-gray-500">
                        {candidate.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
