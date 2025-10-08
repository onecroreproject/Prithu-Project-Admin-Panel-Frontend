import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  GroupIcon,
} from "../../../icons";
import Badge from "../../../components/ui/badge/Badge";
import { fetchMetrics } from "../../../Services/DashboardServices/metricksServices";

export default function TodayMetrics() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["todayMetrics"],
    queryFn: fetchMetrics,
    staleTime: 1000 * 60 * 5, // 5 mins caching
  });

  if (isLoading) return <p>Loading metrics...</p>;
  if (isError) return <p className="text-red-500">Failed to load metrics</p>;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
      {/* Total Users */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Registered Users
            </span>
            <h4 className="mt-10 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data.totalUsers}
            </h4>
          </div>
          {/* <Badge
            variant="light"
            color={data.userGrowth >= 0 ? "success" : "error"}
            size="sm"
            startIcon={data.userGrowth >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
          >
            {Math.abs(data.userGrowth)}%
          </Badge> */}
        </div>
      </div>

      {/* Total Subscriptions */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Subscriptions Users
            </span>
            <h4 className="mt-10 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data.subscriptionCount}
            </h4>
          </div>
          {/* <Badge
            variant="light"
            color={data.subscriptionGrowth >= 0 ? "success" : "error"}
            size="sm"
            startIcon={data.subscriptionGrowth >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
          >
            {Math.abs(data.subscriptionGrowth)}%
          </Badge> */}
        </div>
      </div>

      {/* Total Creators */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400 ">
              Total Creators
            </span>
            <h4 className="mt-14 font-bold text-gray-800 text-title-sm dark:text-white/90 ">
              {data.accountCount}
            </h4>
          </div>
          {/* <Badge
            variant="light"
            color={data.creatorGrowth >= 0 ? "success" : "error"}
            size="sm"
            startIcon={data.creatorGrowth >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
          >
            {Math.abs(data.creatorGrowth)}%
          </Badge> */}
        </div>
      </div>
    </div>
  );
}
