import api from "../../Utils/axiosApi";
import { API_ENDPOINTS } from "../../API-Constanse/apiConstance";

// ✅ Fetch all creators
export const fetchCreators = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.ADMIN_GET_ALL_CREATOR);
    console.log(response.data)
    return response.data.creators;
  } catch (error) {
    console.error("Error fetching creators:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch creators");
  }
};

// ✅ Block a creator
export const blockCreator = async (creatorId) => {
  try {
    const response = await axios.patch(API_ENDPOINTS);
    // Return updated creator info if needed
    return response.data;
  } catch (error) {
    console.error("Error blocking creator:", error);
    throw new Error(error.response?.data?.message || "Failed to block creator");
  }
};