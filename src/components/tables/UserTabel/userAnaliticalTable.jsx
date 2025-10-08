import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { fetchUsers } from "../../../Services/UserServices/userServices.js";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaChartLine } from "react-icons/fa";

export default function UserTableAnalytical() {
  const navigate = useNavigate();
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (isError) {
    return <p className="text-center text-red-500 py-10">Failed to load users</p>;
  }

  // Simple page fade-in from right / fade-out to right
  const pageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
  };

  console.log(users)

  return (
    <AnimatePresence>
      <motion.div
        className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageVariants}
      >
        <div className="max-w-full overflow-x-auto">
          <Table className="w-full table-auto">
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader>User</TableCell>
                <TableCell isHeader>Registration Date</TableCell>
                <TableCell isHeader>Subscription Status</TableCell>
                <TableCell isHeader>Online Status</TableCell>
                <TableCell isHeader>Last Active</TableCell>
                <TableCell isHeader>Actions</TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {users.map((user,idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.01, backgroundColor: "#f9fafb" }}
                >
                  {/* User Info */}
                  <TableCell className="px-4 py-3 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <img
                          width={40}
                          height={40}
                          src={user.profileAvatar}
                          alt={user.userName}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 dark:text-white/90 text-sm">
                          {user.userName}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Registration Date */}
                  <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
                    {new Date(user.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>

                  {/* Subscription Status */}
                  <TableCell className="px-4 py-3 text-sm">
                    <Badge
                      size="sm"
                      color={user.subscriptionActive ? "success" : "warning"}
                    >
                      {user.subscriptionActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  {/* Online Status */}
                  <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
                    {user.isActive ? "Online" : "Offline"}
                  </TableCell>

                  {/* Last Active */}
                  <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
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
                  <TableCell className="px-4 py-3 text-sm">
                    <motion.button
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded shadow-sm hover:bg-blue-600 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/user/analitical/page/${user.userId}`)}
                    >
                      <FaChartLine />
                      Analytical
                    </motion.button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
