import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { FaEye, FaBan, FaTrash } from "react-icons/fa";
import UserDetailModal from "../../../components/Pop-UP/userDetailPopUp"; 
import { fetchUsers, blockUser, deleteUser } from "../../../Services/UserServices/userServices.js";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import IndividualUserProfilePage from "../../../pages/UserProfile/UserAnalitical/individualUserProfilePage.jsx";

export default function BasicTableOne() {
  const queryClient = useQueryClient();
  const navigate=useNavigate();

  // ✅ Fetch users
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
  });

  // ✅ Block/Unblock mutation
  const blockMutation = useMutation({
    mutationFn: blockUser,
    onSuccess: (data, userId) => {
      queryClient.setQueryData(["users"], (oldUsers) =>
        oldUsers.map((u) =>
          u.userId === userId ? { ...u, isBlocked: data.isBlocked } : u
        )
      );
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Action failed");
    },
  });

const handleView=async(id)=>{
  navigate(`/individual/user/profile/${id}`)
}

  // ✅ Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data, userId) => {
      queryClient.setQueryData(["users"], (oldUsers) =>
        oldUsers.filter((u) => u.userId !== userId)
      );
      toast.success(data.message || "User deleted successfully");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete user");
    },
  });

  // Fallback handler for missing values
  const displayVal = (value) =>
    value === null || value === undefined || value === "" ? "No Data Available" : value;

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (isError) return <p className="text-center text-red-500 py-10">Failed to load users</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <Toaster position="top-right" reverseOrder={false} />
      {/* Download Button */}
     
      <div className="max-w-full overflow-x-auto">
        <Table className="min-w-full text-sm text-gray-700">
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
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500 font-semibold">
                  No Data Available
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, idx) => (
                <TableRow key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  {/* User Info */}
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center">
                        {user.profileAvatar ?
                          <img width={40} height={40} src={user.profileAvatar} alt={user.userName || "Avatar"} />
                          : <span className="text-xs text-gray-400">No Data Available</span>
                        }
                      </div>
                      <div>
                        <span className="block font-medium">{displayVal(user.userName)}</span>
                        <span className="block text-gray-500">{displayVal(user.role)}</span>
                      </div>
                    </div>
                  </TableCell>
                  {/* Registration Date */}
                  <TableCell className="px-6 py-4">
                    {
                      user.createdAt ?
                        new Date(user.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        : "No Data Available"
                    }
                  </TableCell>
                  {/* Subscription Status */}
                  <TableCell className="px-6 py-4">
                    {typeof user.subscriptionActive === "boolean" ?
                      <Badge size="sm" color={user.subscriptionActive ? "success" : "warning"}>
                        {user.subscriptionActive ? "Active" : "Inactive"}
                      </Badge>
                      : "No Data Available"}
                  </TableCell>
                  {/* Online Status */}
                  <TableCell
                    className={`px-6 py-4 text-center rounded-md ${
                      user.isOnline === true
                        ? "text-green-700 bg-green-50 dark:text-green-500"
                        : user.isOnline === false
                          ? "text-red-700 bg-red-50 dark:text-red-500"
                          : "text-gray-500"
                    }`}
                  >
                    {user.isOnline === true ? "Online" : user.isOnline === false ? "Offline" : "No Data Available"}
                  </TableCell>
                  {/* Last Active */}
                  <TableCell className="px-6 py-4">
                    {
                      user.lastActiveAt ?
                        new Date(user.lastActiveAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        : "No Data Available"
                    }
                  </TableCell>
                  {/* Actions */}
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* View */}
                      <button
                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="View"
                        onClick={() => handleView(user.userId)}
                        disabled={!user.userId}
                      >
                        <FaEye className="w-5 h-5 text-gray-500" />
                      </button>
                      {/* Block/Unblock */}
                      <button
                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                        title={user.isBlocked ? "Unblock" : "Block"}
                        onClick={() => blockMutation.mutate(user.userId)}
                        disabled={blockMutation.isLoading || !user.userId}
                      >
                        {user.isBlocked ? (
                          <div className="border border-green-600 px-3 py-0.5 rounded-2xl bg-green-100 text-green-700 text-xs font-medium">
                            Unblock
                          </div>
                        ) : (
                          <FaBan className="w-5 h-5 text-red-500" />
                        )}
                      </button>
                      {/* Delete */}
                      <button
                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Delete"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${user.userName}? This action cannot be undone.`)) {
                            deleteMutation.mutate(user.userId);
                          }
                        }}
                        disabled={deleteMutation.isLoading || !user.userId}
                      >
                        <FaTrash
                          className={`w-5 h-5 ${
                            deleteMutation.isLoading ? "text-gray-300" : "text-gray-500 hover:text-red-600"
                          }`}
                        />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
