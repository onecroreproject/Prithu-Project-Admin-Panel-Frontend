import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../Utils/axiosApi";
import { API_ENDPOINTS } from "../API-Constanse/apiConstance";

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    const storedRole = localStorage.getItem("role");
    if (storedAdmin) setAdmin(JSON.parse(storedAdmin));
    if (storedRole) setRole(storedRole);
  }, []);

  const login = async (identifier, password) => {
  try {
    setLoading(true);
    const res = await api.post(API_ENDPOINTS.ADMIN_LOGIN, { identifier, password });
    
    const token = res.data.token;
    const adminData = res.data.admin;
    const grantedPermissions = res.data.grantedPermissions || [];

    // Save everything in localStorage
    localStorage.setItem(
      "admin",
      JSON.stringify({ ...adminData, token, grantedPermissions,role })
    );

    // Update state
    setAdmin({ ...adminData, token, grantedPermissions });
    setRole(adminData.role);
    setError(null);
  } catch (err) {
    setError(err.response?.data?.error || "Login failed");
  } finally {
    setLoading(false);
  }
};


  const logout = () => {
    setAdmin(null);
    setRole(null);
    localStorage.removeItem("admin");
    localStorage.removeItem("role");
  };

  const sendOtp = async (email) => {
    try {
      setLoading(true);
      await api.post(API_ENDPOINTS.ADMIN_SENT_OTP, { email });
      setOtpSent(true);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otp) => {
    try {
      setLoading(true);
      const res = await api.post(API_ENDPOINTS.ADMIN_VERFY_EXISTING_OTP, { otp });
      setOtpSent(false);
      setError(null);
      return res.data.message || "OTP verified successfully";
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, newPassword) => {
    try {
      setLoading(true);
      const res = await api.post(API_ENDPOINTS.ADMIN_RESET_PASSWORD, { email, newPassword });
      setError(null);
      return res.data.message || "Password reset successfully";
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createChildAdmin = async (childData) => {
    try {
      setLoading(true);

      if (childData.adminType !== "Child_Admin") {
        throw new Error("Only main admin can create child admins");
      }

      if (childData.firstName && childData.lastName) {
        childData.username = `${childData.firstName.trim()} ${childData.lastName.trim()}`;
        delete childData.firstName;
        delete childData.lastName;
      }

      const payload = {
        username: childData.username,
        email: childData.email,
        password: childData.password,
        adminType: childData.adminType,
      };

      const res = await api.post(API_ENDPOINTS.CHILD_ADMIN_REGISTER, payload, {
        headers: { Authorization: `Bearer ${admin.token}` },
      });

      setError(null);
      return res.data;
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || "Something went wrong";
      setError(errMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        role,
        loading,
        error,
        otpSent,
        login,
        logout,
        sendOtp,
        verifyOtp,
        resetPassword,
        createChildAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
