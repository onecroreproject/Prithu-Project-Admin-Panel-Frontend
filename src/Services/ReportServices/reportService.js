import api from "../../Utils/axiosApi"
import { API_ENDPOINTS } from "../../API-Constanse/apiConstance";

// Fetch all reports
export const getReports = async () => {
  const response = await api.get(API_ENDPOINTS.GET_USER_REPORTS);
  return response.data.reports; // because backend returns { reports: [...] }
};


export const updateReportAction = async (reportId, data) => {
 const tokenData = localStorage.getItem("admin");
    if (!tokenData) throw new Error("Admin token not found");

    const  {token}  = JSON.parse(tokenData);
  const res = await api.put(`${API_ENDPOINTS.UPDATE_REPORT_ACTION}/${reportId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};