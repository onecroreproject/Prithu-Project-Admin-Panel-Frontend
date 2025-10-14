import { useQuery } from "@tanstack/react-query";
import { FaUsers, FaUserCheck, FaUserTimes, FaBan } from "react-icons/fa";

import { fetchUserMetricks } from "../../Services/UserServices/userServices";

export default function UserMetrics() {
  const { data = {}, isLoading, isError } = useQuery({
    queryKey: ["userMetrics"],
    queryFn: async () => {
      try {
        const res = await fetchUserMetricks();
        return res || {
          totalUsers: 0,
          onlineUsers: 0,
          offlineUsers: 0,
          blockedUserCount: 0,
        };
      } catch (err) {
        console.error("Error fetching user metrics:", err);
        return {
          totalUsers: 0,
          onlineUsers: 0,
          offlineUsers: 0,
          blockedUserCount: 0,
        };
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <p>Loading metrics...</p>;
  if (isError) return <p className="text-red-500">Failed to load metrics</p>;

  // Card styling variables
  const cardBaseClasses =
    "rounded-xl border-[2.5px] bg-white shadow-sm flex flex-col text-left justify-between items-start transition-all px-3 py-4 sm:px-5 sm:py-6 w-full max-w-[280px] sm:max-w-none min-h-[130px]";

  const iconSize = { width: 42, height: 42, fontSize: "1.15rem" };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6 justify-center items-stretch px-2">
      {/* Total Users */}
      <div className={`${cardBaseClasses} border-[#f6d6ce]`}>
        <div className="flex items-center gap-2 mb-2">
          <div
            className="rounded-full flex items-center justify-center bg-[#f9b7a8] shadow"
            style={{ width: iconSize.width, height: iconSize.height }}
          >
            <FaUsers className="text-white" style={{ fontSize: iconSize.fontSize }} />
          </div>
          <h3 className="font-semibold text-gray-800 ml-3 text-sm sm:text-base">
            Total Users
          </h3>
        </div>
        <span
          className="font-bold text-gray-900 text-3xl sm:text-4xl"
          style={{ lineHeight: "2.5rem" }}
        >
          {data.totalUsers}
        </span>
      </div>

      {/* Online Users */}
      <div className={`${cardBaseClasses} border-[#ddf0ea]`}>
        <div className="flex items-center gap-2 mb-2">
          <div
            className="rounded-full flex items-center justify-center bg-[#27ae60] shadow"
            style={{ width: iconSize.width, height: iconSize.height }}
          >
            <FaUserCheck className="text-white" style={{ fontSize: iconSize.fontSize }} />
          </div>
          <h3 className="font-semibold text-gray-800 ml-3 text-sm sm:text-base">
            Online Users
          </h3>
        </div>
        <span
          className="font-bold text-gray-900 text-3xl sm:text-4xl"
          style={{ lineHeight: "2.5rem" }}
        >
          {data.onlineUsers}
        </span>
      </div>

      {/* Offline Users */}
      <div className={`${cardBaseClasses} border-[#fdecea]`}>
        <div className="flex items-center gap-2 mb-2">
          <div
            className="rounded-full flex items-center justify-center bg-[#e03e2f] shadow"
            style={{ width: iconSize.width, height: iconSize.height }}
          >
            <FaUserTimes className="text-white" style={{ fontSize: iconSize.fontSize }} />
          </div>
          <h3 className="font-semibold text-gray-800 ml-3 text-sm sm:text-base">
            Offline Users
          </h3>
        </div>
        <span
          className="font-bold text-gray-900 text-3xl sm:text-4xl"
          style={{ lineHeight: "2.5rem" }}
        >
          {data.offlineUsers}
        </span>
      </div>

      {/* Blocked Users */}
      <div className={`${cardBaseClasses} border-[#fff7d7]`}>
        <div className="flex items-center gap-2 mb-2">
          <div
            className="rounded-full flex items-center justify-center bg-[#f3c13a] shadow"
            style={{ width: iconSize.width, height: iconSize.height }}
          >
            <FaBan className="text-white" style={{ fontSize: iconSize.fontSize }} />
          </div>
          <h3 className="font-semibold text-gray-800 ml-3 text-sm sm:text-base">
            Blocked Users
          </h3>
        </div>
        <span
          className="font-bold text-gray-900 text-3xl sm:text-4xl"
          style={{ lineHeight: "2.5rem" }}
        >
          {data.blockedUserCount}
        </span>
      </div>
    </div>
  );
}
