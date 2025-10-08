import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../Utils/axiosApi";

// Create Context
const AdminProfileContext = createContext();

// Custom hook for consuming
export const useAdminProfile = () => useContext(AdminProfileContext);

// Provider
export const AdminProfileProvider = ({ children}) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
const tokenData = localStorage.getItem("admin");
const { token } = tokenData ? JSON.parse(tokenData) : { token: null };


  // ✅ Fetch profile
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/get/admin/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setProfile(res.data?.profile || null);
    } catch (err) {
      console.error("Error fetching admin profile", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update profile
// ✅ Update profile
const updateProfile = async (formData, avatar) => {
  setUpdating(true);
  try {
    const fd = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== undefined && formData[key] !== "")
        fd.append(key, formData[key]);
    });

    // must match router.put('/admin/profile/detail/update', adminUpload.single("file"))
    if (avatar) fd.append("file", avatar);

    await api.put(`/admin/profile/detail/update`, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    await fetchProfile();
    return { success: true, message: "Profile updated successfully!" };
  } catch (err) {
    console.error("Error updating profile", err.response?.data || err);
    return {
      success: false,
      message: err.response?.data?.message || "Update failed",
    };
  } finally {
    setUpdating(false);
  }
};


  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AdminProfileContext.Provider
      value={{
        profile,
        setProfile,
        fetchProfile,
        updateProfile,
        loading,
        updating,
      }}
    >
      {children}
    </AdminProfileContext.Provider>
  );
};
