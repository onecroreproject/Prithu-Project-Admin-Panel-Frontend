import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { fetchUsers } from "../../../Services/UserServices/userServices.js";
import { useNavigate } from "react-router-dom";

export default function AnalyticalUserTable() {
  const navigate = useNavigate();

  // ✅ Fetch users
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (isError) return <p className="text-center text-red-500 py-10">Failed to load users</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table className="min-w-full text-sm text-gray-700">
          {/* Table Header */}
          <TableHeader className="border-b border-gray-200 dark:border-white/[0.05] bg-gray-50 dark:bg-gray-900">
            <TableRow>
              <TableCell isHeader className="px-6 py-4 font-semibold text-left">User</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-left">Registration Date</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-left">Subscription Status</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-left">Online Status</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-left">Last Active</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-left">Actions</TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {users.map((user, idx) => (
              <TableRow key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                {/* User Info */}
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img width={40} height={40} src={user.profileAvatar} alt={user.userName} />
                    </div>
                    <div>
                      <span className="block font-medium">{user.userName}</span>
                      <span className="block text-gray-500">{user.role}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Registration Date */}
                <TableCell className="px-6 py-4">
                  {new Date(user.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>

                {/* Subscription Status */}
                <TableCell className="px-6 py-4">
                  <Badge size="sm" color={user.subscriptionActive ? "success" : "warning"}>
                    {user.subscriptionActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>

                {/* Online Status */}
                <TableCell
                  className={`px-6 py-4 text-center rounded-md ${
                    user.isOnline
                      ? "text-green-700 bg-green-50 dark:text-green-500"
                      : "text-red-700 bg-red-50 dark:text-red-500"
                  }`}
                >
                  {user.isOnline ? "Online" : "Offline"}
                </TableCell>

                {/* Last Active */}
                <TableCell className="px-6 py-4">
                  {user.lastActiveAt
                    ? new Date(user.lastActiveAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Never Active"}
                </TableCell>

                {/* Actions */}
                <TableCell className="px-6 py-4">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => navigate(`/user/analitical/page/${user.userId}`)}
                  >
                    Analytical
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
