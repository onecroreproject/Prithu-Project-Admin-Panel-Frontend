import {
  ArrowUpIcon,
  ArrowDownIcon,
  GroupIcon,
  UserIcon,
} from "../../../icons";
import Badge from "../../../components/ui/badge/Badge";

const metricsData = [
  {
    title: "Total Users Registered",
    value: "1,245",
    icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
    badge: { value: "12.4%", color: "success", icon: <ArrowUpIcon /> },
  },
  {
    title: "Today Users Registered",
    value: "123",
    icon: <UserIcon className="text-gray-800 size-6 dark:text-white/90" />,
    badge: { value: "5.6%", color: "success", icon: <ArrowUpIcon /> },
  },
  {
    title: "Today User Subscriptions",
    value: "78",
    icon: <UserIcon className="text-gray-800 size-6 dark:text-white/90" />,
    badge: { value: "2.1%", color: "error", icon: <ArrowDownIcon /> },
  },
];

export default function UserMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
      {metricsData.map((metric, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            {metric.icon}
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {metric.title}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {metric.value}
              </h4>
            </div>
            <Badge
              variant="light"
              color={metric.badge.color}
              size="sm"
              startIcon={metric.badge.icon}
            >
              {metric.badge.value}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
