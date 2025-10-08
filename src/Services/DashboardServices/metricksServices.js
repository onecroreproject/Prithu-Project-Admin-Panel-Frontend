import Api from "../../Utils/axiosApi.js";
import { API_ENDPOINTS } from "../../API-Constanse/apiConstance.js";

export const fetchMetrics = async () => {
  const { data } = await Api.get(API_ENDPOINTS.DASHBOARD_METRICKS);
  return data; 
};
