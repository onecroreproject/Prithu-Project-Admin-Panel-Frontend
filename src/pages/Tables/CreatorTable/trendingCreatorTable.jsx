import { useState, useEffect, useMemo } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";
import { ChevronDown } from "lucide-react";
import usePagination from "../../../hooks/pagePagination";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTrendingCreators } from "../../../Services/creatorServices/creatorServices";

// Time ago helper
const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
  }
  return "Just now";
};

export default function TrendingCreatorsTable() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortDirection, setSortDirection] = useState("desc"); // Only trendingScore sort

  // Pagination
  const { page, totalPages, currentItems, nextPage, prevPage, resetPage } = usePagination(creators, 10);

  // Fetch creators
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchTrendingCreators(); // res.data.creators
        setCreators(data);
      } catch (err) {
        setError("Failed to fetch trending creators");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sort only by trendingScore
  const sortedCreators = useMemo(() => {
    if (!creators?.length) return [];
    const sorted = [...creators];
    sorted.sort((a, b) => {
      const scoreA = parseFloat(a.trendingScore) || 0;
      const scoreB = parseFloat(b.trendingScore) || 0;
      return sortDirection === "asc" ? scoreA - scoreB : scoreB - scoreA;
    });
    return sorted;
  }, [creators, sortDirection]);

  const toggleSort = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    resetPage();
  };

  const renderSortArrow = () => (
    <ChevronDown
      className={`ml-1 inline-block transition-transform duration-200 ${
        sortDirection === "desc" ? "rotate-180 text-blue-500" : "text-gray-400"
      }`}
      size={16}
    />
  );

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <AnimatePresence>
      <motion.div
        className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
        exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }}
      >
        <div className="max-w-full overflow-x-auto">
          <Table className="min-w-full text-sm text-gray-700">
            <TableHeader className="border-b border-gray-200 dark:border-white/[0.05] bg-gray-50 dark:bg-gray-900">
              <TableRow>
                <TableCell isHeader className="px-6 py-4 font-semibold text-left">Creator</TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-4 font-semibold text-left cursor-pointer select-none"
                  onClick={toggleSort}
                >
                  <div className="flex items-center">
                    Trending Score {renderSortArrow()}
                  </div>
                </TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-left">Video Views</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-left">Image Views</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-left">Likes</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-left">Shares</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-left">Followers</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-left">Last Updated</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {sortedCreators.length > 0 ? (
                currentItems.map((creator, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <img width={40} height={40} src={creator.profileAvatar} alt={creator.userName} />
                        </div>
                        <div>
                          <span className="block font-medium">{creator.userName}</span>
                          <span className="block text-gray-500">Creator</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <Badge size="sm" color="info">{creator.trendingScore}</Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">{creator.totalVideoViews}</TableCell>
                    <TableCell className="px-6 py-4">{creator.totalImageViews}</TableCell>
                    <TableCell className="px-6 py-4">{creator.totalLikes}</TableCell>
                    <TableCell className="px-6 py-4">{creator.totalShares}</TableCell>
                    <TableCell className="px-6 py-4">{creator.followerCount}</TableCell>
                    <TableCell className="px-6 py-4">{timeAgo(creator.lastUpdated)}</TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="px-6 py-10 text-center text-gray-500">
                    No Trending Creators Yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-white/[0.05]">
          <button
            className="px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-50 dark:bg-gray-800 dark:text-white"
            onClick={prevPage}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300">Page {page} of {totalPages}</span>
          <button
            className="px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-50 dark:bg-gray-800 dark:text-white"
            onClick={nextPage}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
