import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  fetchUserFeeds,
  fetchUserFollowing,
  fetchUserInterested,
  fetchUserNonInterested,
  fetchUserHidden,
  fetchUserLiked,
  fetchUserDisliked,
  fetchUserCommented,
  fetchUserShared,
  fetchUserDownloaded,
} from "../../../Services/UserServices/userServices";
import UserAnalyticsFilter from "./userAnalyticsFilter";
import UserAnalyticsTabs from "./UserAnalyticsTabs";
import UserAnalyticsTable from "./userAnaliticalRenderTabel";

export default function UserAnalytics() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("feeds");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    startDate: new Date(),
    endDate: new Date(),
    type: "all",
  });

  const itemsPerPage = 10;

  const stableParams = useMemo(() => {
    const params = {};
    if (filters.startDate) params.startDate = filters.startDate.toISOString().split("T")[0];
    if (filters.endDate) params.endDate = filters.endDate.toISOString().split("T")[0];
    if (filters.type && filters.type !== "all") params.type = filters.type;
    return params;
  }, [filters, activeTab]);

  const fetchTabData = useCallback(async () => {
    switch (activeTab) {
      case "feeds": return fetchUserFeeds(userId, stableParams);
      case "following": return fetchUserFollowing(userId, stableParams);
      case "interested": return fetchUserInterested(userId, stableParams);
      case "nonInterested": return fetchUserNonInterested(userId, stableParams);
      case "hidden": return fetchUserHidden(userId, stableParams);
      case "liked": return fetchUserLiked(userId, stableParams);
      case "disliked": return fetchUserDisliked(userId, stableParams);
      case "commented": return fetchUserCommented(userId, stableParams);
      case "shared": return fetchUserShared(userId, stableParams);
      case "downloaded": return fetchUserDownloaded(userId, stableParams);
      default: return [];
    }
  }, [activeTab, userId, stableParams]);

  const { data: tabData = [], isLoading, error } = useQuery({
    queryKey: ["userAnalyticsTab", userId, activeTab, stableParams],
    queryFn: fetchTabData,
    keepPreviousData: true,
    staleTime: 1000 * 60,
  });

  useEffect(() => setCurrentPage(1), [activeTab, filters]);

  const totalPages = Math.ceil(tabData.length / itemsPerPage);
  const paginatedData = tabData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (isLoading) return <p className="p-6 text-center">Loading {activeTab} data...</p>;
  if (error) return <p className="p-6 text-center text-red-500">Error loading {activeTab} data</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <UserAnalyticsFilter
        initialFilters={filters}
        activeTab={activeTab}
        onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
      />

      <UserAnalyticsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <AnimatePresence mode="wait">
        <motion.div key={activeTab + currentPage + JSON.stringify(stableParams)} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
          <UserAnalyticsTable
            activeTab={activeTab}
            data={paginatedData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end items-center p-4 space-x-2">
        <motion.button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50" whileHover={{ scale: 1.05 }}>Prev</motion.button>
        <span>Page {currentPage} of {totalPages || 1}</span>
        <motion.button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50" whileHover={{ scale: 1.05 }}>Next</motion.button>
      </div>
    </div>
  );
}
