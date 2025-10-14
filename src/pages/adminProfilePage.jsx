import React, { useEffect, useState } from "react";
import { FaCopy, FaEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminProfile } from "../context/adminProfileContext";

export default function AdminProfileEdit({ isOpen = true, onClose }) {
  const { profile, updateProfile, updating } = useAdminProfile();
  console.log(profile);

  // Initialize formData with profile or fallback default "N/A" values if profile is null
  const getInitialFormData = () => ({
    displayName: profile?.displayName || "N/A",
    bio: profile?.bio || "N/A",
    phoneNumber: profile?.phoneNumber || "N/A",
    dateOfBirth: profile?.dateOfBirth || "N/A",
    maritalStatus: profile?.maritalStatus || "N/A",
    maritalDate: profile?.maritalDate || "N/A",
    theme: profile?.theme || "light",
    language: profile?.language || "en",
    timezone: profile?.timezone || "Asia/Kolkata",
    gender: profile?.gender || "N/A",
    userName: profile?.userName || "N/A",
    email: profile?.userEmail || "N/A",
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [originalData, setOriginalData] = useState(getInitialFormData());
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [show, setShow] = useState(false);

  const fadeLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", duration: 0.55, bounce: 0.17 } },
  };

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      const timeout = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // When profile changes, reset formData to updated profile or fallback "N/A"
  useEffect(() => {
    const initData = getInitialFormData();
    setFormData(initData);
    setOriginalData(initData);
    if (profile?.profileAvatar) {
      setPreview(profile.profileAvatar);
    } else {
      setPreview(null);
    }
  }, [profile, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build payload with only changed fields
    const changedData = {};
    Object.keys(formData).forEach((key) => {
      // Compare and include if different and not "N/A"
      if (formData[key] !== originalData[key] && formData[key] !== "N/A") {
        changedData[key] = formData[key];
      }
    });

    // If nothing changed and no new avatar, maybe skip update or alert
    if (Object.keys(changedData).length === 0 && !avatar) {
      alert("No changes to update.");
      return;
    }

    // Call updateProfile with changed data and avatar
    const res = await updateProfile(changedData, avatar);
    if (res?.success) {
      alert("Profile updated successfully!");
      setEditMode(false);
      onClose && onClose();
      // Update originalData to new formData after successful update
      setOriginalData(formData);
    } else {
      alert(res?.message || "Update failed");
    }
  };

  const handleCopy = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      alert("Copied!");
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    // revert to current profile or N/A values
    setFormData(originalData);
    setPreview(profile?.profileAvatar || null);
    setAvatar(null);
  };

  if (!show) return null;

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
          src={preview || "/default-avatar.png"}
          alt={formData.email || "avatar"}
          className="w-20 h-20 rounded-full object-cover mb-2"
        />
        <div className="text-center w-full">
          <div className="font-semibold text-lg text-gray-900 mb-1">
            {formData.email !== "N/A" ? formData.email : "No email"}
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

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    src={preview || "/default-avatar.png"}
                    alt="avatar"
                    className="w-20 h-20 rounded-full border object-cover"
                  />
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                </motion.div>
              )}

              {/* Name */}
              <div>
                <label className="block mb-1 text-sm text-gray-600">Name</label>
                {!editMode ? (
                  <div className="bg-gray-50 rounded px-3 py-2">{formData.userName || "-"}</div>
                ) : (
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName || ""}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="N/A"
                  />
                )}
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm text-gray-600">Email Address</label>
                <div className="flex items-center">
                  <div className="bg-gray-50 rounded px-3 py-2 flex-1">{formData.email || "-"}</div>
                  <span className="ml-2 px-2 py-1 rounded bg-green-50 text-green-600 text-xs font-medium">
                    Verified
                  </span>
                </div>
              </div>

              {/* Phone Number */}
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm text-gray-600">Phone Number</label>
                {!editMode ? (
                  <div className="bg-gray-50 rounded px-3 py-2">{formData.phoneNumber || "-"}</div>
                ) : (
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber || ""}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="N/A"
                  />
                )}
              </div>

              {/* Editable Fields */}
              {editMode && (
                <>
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm text-gray-600">Display Name</label>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName || ""}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                      placeholder="N/A"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm text-gray-600">Username</label>
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName || ""}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                      placeholder="N/A"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm text-gray-600">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio || ""}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded"
                      placeholder="N/A"
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
          <h2 className="text-base font-semibold mb-3">Social Media Account</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-1 text-sm text-gray-600">Facebook</label>
              <div className="bg-gray-50 rounded px-3 py-2">{profile?.facebook || "-"}</div>
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">Instagram</label>
              <div className="bg-gray-50 rounded px-3 py-2">{profile?.instagram || "-"}</div>
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
