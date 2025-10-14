import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaBan,
  FaTimes,
  FaUserShield,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  fetchChildAdminProfile,
  blockChildAdmin,
  deleteChildAdmin,
} from "../Services/childAdminServices/childAdminServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fadeModal = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", duration: 0.5, bounce: 0.2 } },
  exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", duration: 0.55, bounce: 0.17 } },
};

export default function ChildAdminProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [isActionProcessing, setIsActionProcessing] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["childAdminProfile", id],
    queryFn: () => fetchChildAdminProfile(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
console.log(data)
  useEffect(() => {
    if (data) {
      // Normalize profile fields for easier access
      setProfile({
        ...data,
        userName: data.profile?.userName || data.userName,
        profileAvatar: data.profile?.profileAvatar || "/default-avatar.png",
        grantedPermissions: data.grantedPermissions || [],
        ungrantedPermissions: data.ungrantedPermissions || [],
      });
    }
  }, [data]);

  const handleAction = (type) => {
    setActionType(type);
    setShowModal(true);
  };

  const handleEdit = () => {
    navigate(`/childadmin/permission/${profile._id}`);
  };

  const handleCloseModal = () => {
    if (!isActionProcessing) {
      setShowModal(false);
      setActionType(null);
    }
  };

const handleConfirmAction = async () => {
  if (isActionProcessing) return;
  setIsActionProcessing(true);
  try {
    if (actionType === "block" || actionType === "unblock") {
      await blockChildAdmin(profile._id); // toggle API
      toast.success(
        `Child Admin ${profile.isActive ? "blocked" : "unblocked"} successfully!`
      );
      refetch(); // <-- refresh the profile data
    } else if (actionType === "delete") {
      await deleteChildAdmin(profile._id);
      toast.success("Child Admin deleted successfully!");
      navigate("/child/admin/page"); // redirect after delete
    }
    setShowModal(false);
  } catch (err) {
    console.error(err);
    toast.error("Action failed. Please try again.");
  } finally {
    setIsActionProcessing(false);
  }
};




  if (isLoading)
    return (
      <div className="p-6 flex justify-center items-center text-gray-600">
        <ToastContainer position="top-right" autoClose={3000} />
        Loading...
      </div>
    );

  if (isError)
    return (
      <div className="p-6 text-red-600">
        <ToastContainer position="top-right" autoClose={3000} />
        Error: {error?.message}
      </div>
    );

  if (!profile)
    return (
      <div className="p-6 text-gray-600">
        <ToastContainer position="top-right" autoClose={3000} />
        Profile not found.
      </div>
    );

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col lg:flex-row gap-6 p-6 w-full bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
        {/* Profile Sidebar */}
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl border border-gray-200 p-6 w-full lg:max-w-xs flex flex-col items-center shadow-lg"
        >
          <img
            src={profile.profileAvatar}
            alt="Profile Avatar"
            className="w-24 h-24 rounded-full object-cover mb-3"
          />
          <h3 className="text-lg font-semibold mb-1">{profile.userName}</h3>
          <p className="text-sm text-gray-600 mb-2">{profile.email}</p>
          <p className="text-xs text-gray-500 mb-4">Role: Child Admin</p>
          <div className="flex justify-center space-x-3">
  <button
    onClick={() => handleAction(profile.isActive ? "block" : "unblock")}
    disabled={isActionProcessing}
    className={`px-3 py-1 rounded ${
      isActionProcessing
        ? "bg-yellow-300 cursor-not-allowed"
        : profile.isActive
        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
        : "bg-green-100 text-green-800 hover:bg-green-200"
    }`}
  >
    <FaBan className="inline-block mr-1" />
    {profile.isActive ? "Block" : "Unblock"}
  </button>
  <button
    onClick={() => handleAction("delete")}
    disabled={isActionProcessing}
    className={`px-3 py-1 rounded ${
      isActionProcessing
        ? "bg-red-300 cursor-not-allowed"
        : "bg-red-100 text-red-600 hover:bg-red-200"
    }`}
  >
    <FaTrash className="inline-block mr-1" /> Delete
  </button>
</div>

        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Basic Details */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg relative"
          >
            <motion.button
              onClick={() => navigate(-1)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
            >
              <FaTimes />
            </motion.button>
            <h2 className="text-xl font-semibold mb-4">Child Admin Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <Info label="Name" value={profile.userName} />
              <Info label="Email" value={profile.email} />
              <Info label="Active Status" value={profile.isActive ? "Active" : "Inactive"} />
              <Info
                label="Approval Status"
                value={profile.isApprovedByParent ? "Approved" : "Pending"}
              />
              <Info label="Created At" value={new Date(profile.createdAt).toLocaleString()} />
              <Info label="Updated At" value={new Date(profile.updatedAt).toLocaleString()} />
            </div>
          </motion.div>

          {/* Parent Admin Card */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-md"
          >
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FaUserShield className="text-indigo-500" /> Parent Admin
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
              <Info label="Name" value={profile.parentAdmin?.userName} />
              <Info label="Email" value={profile.parentAdmin?.email} />
              <Info label="Role" value={profile.parentAdmin?.role} />
            </div>
          </motion.div>

          {/* Permissions */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-md relative"
          >
            <button
              onClick={handleEdit}
              className="absolute top-4 right-4 flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <FaEdit /> Edit
            </button>
            <h3 className="text-lg font-semibold mb-3">Permissions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Granted */}
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Granted Permissions</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.grantedPermissions.length ? (
                    profile.grantedPermissions.map((perm) => (
                      <span
                        key={perm}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs flex items-center gap-1"
                      >
                        <FaCheckCircle className="w-3 h-3" /> {perm}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">None</span>
                  )}
                </div>
              </div>

              {/* Ungranted */}
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Ungranted Permissions</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.ungrantedPermissions.length ? (
                    profile.ungrantedPermissions.map((perm) => (
                      <span
                        key={perm}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs flex items-center gap-1"
                      >
                        <FaTimesCircle className="w-3 h-3" /> {perm}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">None</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Block/Delete Confirmation Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center"
              variants={fadeModal}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="absolute inset-0" onClick={handleCloseModal} />
              <motion.div
                className="relative bg-white p-6 rounded-xl shadow-xl max-w-sm mx-auto w-full border-t-4 border-red-400"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4 }}
              >
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
                  onClick={handleCloseModal}
                >
                  <FaTimes />
                </button>
                <h3 className="text-lg font-semibold mb-4 text-center">
                  Confirm to {actionType}
                </h3>
                <p className="mb-4 text-center text-gray-700">
                  Are you sure you want to {actionType} this child admin?
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAction}
                    disabled={isActionProcessing}
                    className={`px-4 py-2 text-white rounded ${
                      isActionProcessing
                        ? "bg-red-300 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// Reusable Info component
function Info({ label, value }) {
  return (
    <div>
      <label className="block text-sm mb-1 font-medium text-gray-600">{label}</label>
      <div className="bg-gray-50 px-3 py-2 rounded">{value || "-"}</div>
    </div>
  );
}
