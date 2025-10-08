import { useQuery } from "@tanstack/react-query";
import { FaUsers, FaUserCheck, FaUserTimes, FaBan } from "react-icons/fa";
 
import { fetchUserMetricks } from "../../Services/UserServices/userServices";

export default function UserMetrics() {

  const { data = {}, isLoading, isError } = useQuery({
    queryKey: ["userMetrics"],
    queryFn: async () => {
      try {
        const res = await fetchUserMetricks();
        // Ensure data is always an object
        return res || {
          totalUsers: 0,
          onlineUsers: 0,
          offlineUsers: 0,
          blockedUserCount: 0,
        };
      } catch (err) {
        console.error("Error fetching user metrics:", err);
        // Return fallback in case of error
        return {
          totalUsers: 0,
          onlineUsers: 0,
          offlineUsers: 0,
          blockedUserCount: 0,
        };
      }
    },
    staleTime: 1000 * 60 * 5, // 5 mins caching
  });
  console.log(data)

  if (isLoading) return <p>Loading metrics...</p>;
  if (isError) return <p className="text-red-500">Failed to load metrics</p>;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
      {/* Total Users */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <FaUsers className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Users
            </span>
            <h4 className="mt-10 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data.totalUsers}
            </h4>
          </div>
        </div>
      </div>

      {/* Online Users */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <FaUserCheck className="text-green-700 size-6 dark:text-green-500" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Online Users
            </span>
            <h4 className="mt-10 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data.onlineUsers}
            </h4>
          </div>
        </div>
      </div>

      {/* Offline Users */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <FaUserTimes className="text-red-700 size-6 dark:text-red-500" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Offline Users
            </span>
            <h4 className="mt-10 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data.offlineUsers}
            </h4>
          </div>
        </div>
      </div>

      {/* Blocked Users */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <FaBan className="text-yellow-700 size-6 dark:text-yellow-500" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Blocked Users
            </span>
            <h4 className="mt-10 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data.blockedUserCount}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
