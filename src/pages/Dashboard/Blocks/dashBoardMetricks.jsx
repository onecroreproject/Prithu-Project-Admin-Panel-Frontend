import { useQuery } from "@tanstack/react-query";
import { FaUsers, FaRegStar, FaUserTie } from "react-icons/fa";
import Badge from "../../../components/ui/badge/Badge";
import { fetchMetrics } from "../../../Services/DashboardServices/metricksServices";

export default function TodayMetrics() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["todayMetrics"],
    queryFn: fetchMetrics,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <p>Loading metrics...</p>;
  if (isError) return <p className="text-red-500">Failed to load metrics</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-2 justify-center items-stretch px-2">
      {/* Total Users */}
      <div
        className="rounded-xl border-[2.5px] border-[#f6d6ce] bg-white shadow-sm flex flex-col text-left justify-between items-start transition-all
          px-3 py-4 sm:px-5 sm:py-6
          w-full max-w-[280px] sm:max-w-none
          min-h-[130px]"
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="rounded-full flex items-center justify-center bg-[#f9b7a8] shadow"
            style={{ width: "42px", height: "42px" }}
          >
            <FaUsers className="text-white" style={{ fontSize: "1.15rem" }} />
          </div>
          <h3
            className="font-semibold text-gray-800 ml-3 text-sm sm:text-base"
          >
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

      {/* Total Subscriptions */}
      <div
        className="rounded-xl border-[2.5px] border-[#ffe3bb] bg-white shadow-sm flex flex-col text-left justify-between items-start transition-all
          px-3 py-4 sm:px-5 sm:py-6
          w-full max-w-[280px] sm:max-w-none
          min-h-[130px]"
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="rounded-full flex items-center justify-center bg-[#ffc940] shadow"
            style={{ width: "42px", height: "42px" }}
          >
            <FaRegStar className="text-white" style={{ fontSize: "1.15rem" }} />
          </div>
          <h3
            className="font-semibold text-gray-800 ml-3 text-sm sm:text-base"
          >
            Subscriptions Users
          </h3>
        </div>
        <span
          className="font-bold text-gray-900 text-3xl sm:text-4xl"
          style={{ lineHeight: "2.5rem" }}
        >
          {data.subscriptionCount || 0}
        </span>
      </div>

      {/* Total Creators */}
      <div
        className="rounded-xl border-[2.5px] border-[#bdd7ff] bg-white shadow-sm flex flex-col text-left justify-between items-start transition-all
          px-3 py-4 sm:px-5 sm:py-6
          w-full max-w-[280px] sm:max-w-none
          min-h-[130px]"
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="rounded-full flex items-center justify-center bg-[#3b74f6] shadow"
            style={{ width: "42px", height: "42px" }}
          >
            <FaUserTie className="text-white" style={{ fontSize: "1.15rem" }} />
          </div>
          <h3
            className="font-semibold text-gray-800 ml-3 text-sm sm:text-base"
          >
            Total Creators
          </h3>
        </div>
        <span
          className="font-bold text-gray-900 text-3xl sm:text-4xl"
          style={{ lineHeight: "2.5rem" }}
        >
          {data.accountCount || 0}
        </span>
      </div>
    </div>
  );
}
