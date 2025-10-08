import api from "../../Utils/axiosApi"; 
import { API_ENDPOINTS } from "../../API-Constanse/apiConstance";

// ✅ Helper: get token safely from localStorage
const getToken = () => {
  try {
    const tokenData = localStorage.getItem("admin");
    if (!tokenData) return null;
    const { token } = JSON.parse(tokenData);
    return token;
  } catch (err) {
    console.error("Error reading admin token:", err);
    return null;
  }
};

// ✅ Fetch all child admins (under current parent admin)
export const getChildAdmins = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error("Admin token not found");

    const { data } = await api.get(API_ENDPOINTS.GET_CHILD_ADMIN_LIST, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data?.admins || [];
  } catch (err) {
    console.error("Failed to fetch child admins:", err);

    // 🔁 Handle expired JWT or unauthorized
    if (err.response?.status === 401) {
      alert("Your session expired. Please login again.");
      localStorage.removeItem("admin");
      window.location.href = "/admin-login"; // redirect to admin login
    }

    throw err;
  }
};

// ✅ Fetch specific child admin’s permissions
export const getAdminPermissions = async (childAdminId) => {
  try {
    const token = getToken();
    if (!token) throw new Error("Admin token not found");

    const { data } = await api.get(
      `${API_ENDPOINTS.GET_CHILD_ADMIN_PERMISSONS}/${childAdminId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return data?.childAdmin || {};
  } catch (err) {
    console.error("Failed to fetch admin permissions:", err);

    if (err.response?.status === 401) {
      alert("Your session expired. Please login again.");
      localStorage.removeItem("admin");
      window.location.href = "/admin-login";
    }

    throw err;
  }
};

// ✅ Update child admin’s permissions
export const updateChildAdminPermissions = async (childAdminId, body) => {
  try {
    const token = getToken();
    if (!token) throw new Error("Admin token not found");

    const { data } = await api.put(
      `${API_ENDPOINTS.UPDATE_CHILD_ADMIN_PERMISSIONS}/${childAdminId}`,
      body,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return data;
  } catch (err) {
    console.error("Failed to update child admin permissions:", err);

    if (err.response?.status === 401) {
      alert("Your session expired. Please login again.");
      localStorage.removeItem("admin");
      window.location.href = "/admin-login";
    }

    throw err;
  }
};
