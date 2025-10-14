import React, { useEffect, useState } from "react";
import { FaCopy, FaEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminProfile } from "../context/adminProfileContext";

export default function AdminProfileEdit({ isOpen = true, onClose }) {
  const { profile, updateProfile, updating } = useAdminProfile();


  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    phoneNumber: "",
    dateOfBirth: "",
    maritalStatus: "",
    maritalDate: "",
    theme: "light",
    language: "en",
    timezone: "Asia/Kolkata",
    gender: "",
    userName: "",
    email: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [show, setShow] = useState(false);

  // ✅ Fade animation logic
  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      const timeout = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // ✅ Pre-fill form when modal opens
  useEffect(() => {
    if (isOpen && profile) {
      setFormData((prev) => ({ ...prev, ...profile }));
      if (profile?.profileAvatar) setPreview(profile.profileAvatar);
    }
  }, [isOpen, profile]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle avatar upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // ✅ Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await updateProfile(formData, avatar);
    if (res?.success) {
      alert("Profile updated successfully!");
      setEditMode(false);
      onClose && onClose();
    } else {
      alert(res?.message || "Update failed");
    }
  };

  // ✅ Copy userId
  const handleCopy = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      alert("Copied!");
    }
  };

  // ✅ Edit/Cancel
  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    if (profile) {
      setFormData((prev) => ({ ...prev, ...profile }));
      setPreview(profile?.profileAvatar || null);
      setAvatar(null);
    }
  };

  // Animation variants
  const fadeLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", duration: 0.55, bounce: 0.17 },
    },
  };

  if (!show) return null;
  if (!profile)
    return (
      <div className="w-full p-6 flex justify-center items-center text-gray-600">
        Loading profile...
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 w-full">
      {/* Sidebar/Profile Card */}
      <motion.div
        variants={fadeLeft}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl border border-gray-200 p-6 w-full md:max-w-xs flex flex-col items-center shadow"
      >
        <img
          src={preview || profile?.profileAvatar || "/default-avatar.png"}
          alt={profile?.email || "avatar"}
          className="w-20 h-20 rounded-full object-cover mb-2"
        />
        <div className="text-center w-full">
          <div className="font-semibold text-lg text-gray-900 mb-1">
            {profile?.userEmail || "No email"}
          </div>
          <div className="text-xs text-gray-500 mb-2">
            {profile?.lastLogin || "Last login not available"}
          </div>
          <div className="flex items-center justify-center space-x-2 mb-5">
            <span className="bg-gray-100 rounded px-2 py-1 text-xs font-mono text-gray-600">
              User ID: {profile?.id || "N/A"}
            </span>
            <button
              onClick={() => handleCopy(profile?.userId)}
              className="bg-gray-200 px-2 py-1 rounded text-xs flex items-center gap-1 hover:bg-gray-300"
            >
              <FaCopy className="w-3 h-3" /> Copy
            </button>
          </div>
        </div>

        <ul className="w-full text-sm mt-2">
          <li className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50 transition">
            <span className="text-gray-700">Change Password</span>
          </li>
        </ul>
      </motion.div>

      {/* Main form/content */}
      <div className="flex-1 flex flex-col gap-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={editMode ? "edit-mode" : "view-mode"}
            variants={fadeLeft}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-white rounded-xl border border-gray-200 p-6 relative shadow"
          >
            <h2 className="text-base font-semibold mb-3 flex items-center justify-between">
              Personal Information
              {!editMode && (
                <button
                  onClick={handleEdit}
                  className="ml-2 px-2 py-1 rounded hover:bg-gray-100 flex items-center gap-2 text-blue-600"
                >
                  <FaEdit className="w-4 h-4" /> Edit
                </button>
              )}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {/* Avatar Upload */}
              {editMode && (
                <motion.div
                  layout
                  className="md:col-span-2 flex items-center gap-4 mb-3"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <img
                    src={preview || profile?.profileAvatar || "/default-avatar.png"}
                    alt="avatar"
                    className="w-20 h-20 rounded-full border object-cover"
                  />
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                </motion.div>
              )}

              {/* First Name */}
              <div>
                <label className="block mb-1 text-sm text-gray-600">
                   Name
                </label>
                {!editMode ? (
                  <div className="bg-gray-50 rounded px-3 py-2">
                    {profile?.userName || "-"}
                  </div>
                ) : (
                  <input
                    type="text"
                    name="firstName"
                    value={formData.userName || ""}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                  />
                )}
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm text-gray-600">
                  Email Address
                </label>
                <div className="flex items-center">
                  <div className="bg-gray-50 rounded px-3 py-2 flex-1">
                    {profile?.userEmail || "-"}
                  </div>
                  <span className="ml-2 px-2 py-1 rounded bg-green-50 text-green-600 text-xs font-medium">
                    Verified
                  </span>
                </div>
              </div>

              {/* Phone Number */}
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm text-gray-600">
                  Phone Number
                </label>
                {!editMode ? (
                  <div className="bg-gray-50 rounded px-3 py-2">
                    {profile?.phoneNumber || "-"}
                  </div>
                ) : (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phoneNumber || ""}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                  />
                )}
              </div>

              {/* Editable Fields */}
              {editMode && (
                <>
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm text-gray-600">
                      Display Name
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName || ""}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm text-gray-600">
                      Username
                    </label>
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName || ""}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm text-gray-600">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio || ""}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-2 justify-end mt-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      {updating ? "Updating..." : "Update Profile"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </motion.div>
        </AnimatePresence>

        {/* Social Media Account Card */}
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl border border-gray-200 p-6 mt-2 shadow"
        >
          <h2 className="text-base font-semibold mb-3">
            Social Media Account
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-1 text-sm text-gray-600">
                Facebook
              </label>
              <div className="bg-gray-50 rounded px-3 py-2">
                {profile?.facebook || "-"}
              </div>
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">
                Instagram
              </label>
              <div className="bg-gray-50 rounded px-3 py-2">
                {profile?.instagram || "-"}
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-start">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg">
              + Add Social Media
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
