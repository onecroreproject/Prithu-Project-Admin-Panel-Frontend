import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import { AiOutlineCalendar } from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";
import "react-datepicker/dist/react-datepicker.css";
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
} from "../../Services/UserServices/userServices";

export default function UserAnalytics() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("feeds");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    startDate: new Date(),
    endDate: new Date(),
    type: "all",
  });

  const itemsPerPage = 10;

  const tabs = useMemo(
    () => [
      { key: "feeds", label: "Feeds" },
      { key: "following", label: "Following" },
      { key: "interested", label: "Interested Categories" },
      { key: "nonInterested", label: "Non-Interested Categories" },
      { key: "hidden", label: "Hidden Feeds" },
      { key: "liked", label: "Liked Feeds" },
      { key: "disliked", label: "Disliked Feeds" },
      { key: "commented", label: "Commented Feeds" },
      { key: "shared", label: "Shared Feeds" },
      { key: "downloaded", label: "Downloaded Feeds" },
    ],
    []
  );

  // Stable query params
  const stableParams = useMemo(() => {
    const params = {};
    if (filters.startDate)
      params.startDate = filters.startDate.toISOString().split("T")[0];
    if (filters.endDate)
      params.endDate = filters.endDate.toISOString().split("T")[0];
    if (
      filters.type &&
      filters.type !== "all" &&
      !["following", "interested", "nonInterested"].includes(activeTab)
    )
      params.type = filters.type;
    return params;
  }, [filters, activeTab]);

  // Fetch data per active tab
  const fetchTabData = useCallback(async () => {
    switch (activeTab) {
      case "feeds":
        return fetchUserFeeds(userId, stableParams);
      case "following":
        return fetchUserFollowing(userId, stableParams);
      case "interested":
        return fetchUserInterested(userId, stableParams);
      case "nonInterested":
        return fetchUserNonInterested(userId, stableParams);
      case "hidden":
        return fetchUserHidden(userId, stableParams);
      case "liked":
        return fetchUserLiked(userId, stableParams);
      case "disliked":
        return fetchUserDisliked(userId, stableParams);
      case "commented":
        return fetchUserCommented(userId, stableParams);
      case "shared":
        return fetchUserShared(userId, stableParams);
      case "downloaded":
        return fetchUserDownloaded(userId, stableParams);
      default:
        return [];
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
  const paginatedData = tabData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const tabVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  if (isLoading)
    return <p className="p-6 text-center">Loading {activeTab} data...</p>;
  if (error)
    return (
      <p className="p-6 text-center text-red-500">
        Error loading {activeTab} data
      </p>
    );

  // --- Table header ---
  const renderTableHead = () => {
    if (activeTab === "following") {
      return (
        <tr>
          <th className="px-4 py-2 border">#</th>
          <th className="px-4 py-2 border">Following User</th>
          <th className="px-4 py-2 border">Followed Date</th>
        </tr>
      );
    } else if (activeTab === "interested" || activeTab === "nonInterested") {
      return (
        <tr>
          <th className="px-4 py-2 border">#</th>
          <th className="px-4 py-2 border">Category Name</th>
          <th className="px-4 py-2 border">Action Date</th>
        </tr>
      );
    } else if (activeTab === "commented") {
      return (
        <tr>
          <th className="px-4 py-2 border">#</th>
          <th className="px-4 py-2 border">Content</th>
          <th className="px-4 py-2 border">Comment</th>
          <th className="px-4 py-2 border">Action Date</th>
        </tr>
      );
    } else if (
      ["liked", "disliked", "shared", "downloaded"].includes(activeTab)
    ) {
      return (
        <tr>
          <th className="px-4 py-2 border">#</th>
          <th className="px-4 py-2 border">Content</th>
          <th className="px-4 py-2 border">Action Date</th>
        </tr>
      );
    } else if (activeTab === "hidden") {
      return (
        <tr>
          <th className="px-4 py-2 border">#</th>
          <th className="px-4 py-2 border">Category</th>
          <th className="px-4 py-2 border">Type</th>
          <th className="px-4 py-2 border">Action</th>
        </tr>
      );
    } else {
      return (
        <tr>
          <th className="px-4 py-2 border">#</th>
          <th className="px-4 py-2 border">Feed</th>
          <th className="px-4 py-2 border">Date</th>
        </tr>
      );
    }
  };

  // --- Table rows ---
  const renderTableRows = () => {
    if (!paginatedData.length) {
      return (
        <tr>
          <td className="px-4 py-2 border text-center" colSpan={4}>
            No data available
          </td>
        </tr>
      );
    }

    return paginatedData.map((item, idx) => {
      const index = (currentPage - 1) * itemsPerPage + idx + 1;

      // Following Tab
      if (activeTab === "following") {
        const actionDate = item.followedAt;
        return (
          <tr key={item.userId || idx} className="border-b hover:bg-gray-100">
            <td className="px-4 py-2 border">{index}</td>
            <td className="px-4 py-2 border flex items-center gap-3">
              <img
                src={item.profileAvatar || "/default-avatar.png"}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">{item.userName || "Unknown"}</span>
            </td>
            <td className="px-4 py-2 border">
              {actionDate ? new Date(actionDate).toLocaleString() : "-"}
            </td>
          </tr>
        );
      }

      // Interested / NonInterested Categories
      if (activeTab === "interested" || activeTab === "nonInterested") {
        return (
          <tr key={item._id || idx} className="border-b hover:bg-gray-100">
            <td className="px-4 py-2 border">{index}</td>
            <td className="px-4 py-2 border">{item.name || "-"}</td>
            <td className="px-4 py-2 border">
              {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-"}
            </td>
          </tr>
        );
      }

      // Commented Tab
      if (activeTab === "commented") {
        return (
          <tr key={item._id || idx} className="border-b hover:bg-gray-100">
            <td className="px-4 py-2 border">{index}</td>
            <td className="px-4 py-2 border">
              {item.feed?.title ? (
                item.feed.title
              ) : item.feed?.contentUrl ? (
                <img
                  src={item.feed.contentUrl}
                  alt="feed content"
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                "-"
              )}
            </td>
            <td className="px-4 py-2 border">{item.commentText || "-"}</td>
            <td className="px-4 py-2 border">
              {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}
            </td>
          </tr>
        );
      }

      // Nested Feed Tabs (liked, disliked, shared, downloaded)
      if (["liked", "disliked", "shared", "downloaded"].includes(activeTab)) {
        const feed = item.feedId || {};
        const actionDate =
          item.likedAt ||
          item.dislikedAt ||
          item.sharedAt ||
          item.downloadedAt;
        return (
          <tr key={item._id || idx} className="border-b hover:bg-gray-100">
            <td className="px-4 py-2 border">{index}</td>
            <td className="px-4 py-2 border">
              {feed.title || (feed.contentUrl && (
                <img
                  className="w-20 h-20 object-cover rounded"
                  src={feed.contentUrl}
                  alt="content"
                />
              ))}
            </td>
            <td className="px-4 py-2 border">
              {actionDate ? new Date(actionDate).toLocaleString() : "-"}
            </td>
          </tr>
        );
      }

      // Hidden Tab
      if (activeTab === "hidden") {
        return (
          <tr key={item._id || idx} className="border-b hover:bg-gray-100">
            <td className="px-4 py-2 border">{index}</td>
            <td className="px-4 py-2 border">{item.category || "-"}</td>
            <td className="px-4 py-2 border">{item.type || "-"}</td>
            <td className="px-4 py-2 border">{item.action || "-"}</td>
          </tr>
        );
      }

      // Default feeds tab
      return (
        <tr key={item._id || idx} className="border-b hover:bg-gray-100">
          <td className="px-4 py-2 border">{index}</td>
          <td className="px-4 py-2 border">
            {item.contentUrl ? (
              <img
                src={item.contentUrl}
                alt="feed"
                className="w-20 h-20 object-cover rounded"
              />
            ) : (
              item.title || "-"
            )}
          </td>
          <td className="px-4 py-2 border">
            {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Filters */}
      <UserAnalyticsFilterInline
        initialFilters={filters}
        onFilterChange={(newFilters) =>
          setFilters((prev) => ({ ...prev, ...newFilters }))
        }
        activeTab={activeTab}
      />

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow mb-6">
        <div className="flex border-b border-gray-200 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 -mb-px font-medium text-sm border-b-2 transition-colors duration-300 ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + currentPage + JSON.stringify(stableParams)}
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="overflow-x-auto"
          >
            <table className="min-w-[600px] md:min-w-full text-left border-collapse border">
              <thead className="bg-gray-50">{renderTableHead()}</thead>
              <tbody>{renderTableRows()}</tbody>
            </table>
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        <div className="flex justify-end items-center p-4 space-x-2">
          <motion.button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
          >
            Prev
          </motion.button>
          <span>
            Page {currentPage} of {totalPages || 1}
          </span>
          <motion.button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
          >
            Next
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// Filter Component
function UserAnalyticsFilterInline({ onFilterChange, initialFilters, activeTab }) {
  const today = useMemo(() => new Date(), []);

  const [startDate, setStartDate] = useState(initialFilters.startDate || today);
  const [endDate, setEndDate] = useState(initialFilters.endDate || today);
  const [type, setType] = useState(initialFilters.type || "all");

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange?.({ startDate, endDate, type });
    }, 300);
    return () => clearTimeout(timer);
  }, [startDate, endDate, type]);

  const handleReset = () => {
    setStartDate(today);
    setEndDate(today);
    setType("all");
    onFilterChange?.({ startDate: today, endDate: today, type: "all" });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col md:flex-row items-center gap-4">
      {/* Start Date */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600">Start Date</label>
        <div className="mt-1 flex items-center border rounded-lg px-2 py-1 cursor-pointer">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            maxDate={endDate}
            dateFormat="yyyy-MM-dd"
            ref={startDateRef}
          />
          <AiOutlineCalendar
            className="ml-2 text-gray-500 cursor-pointer"
            onClick={() => startDateRef.current?.setOpen(true)}
          />
        </div>
      </div>

      {/* End Date */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600">End Date</label>
        <div className="mt-1 flex items-center border rounded-lg px-2 py-1 cursor-pointer">
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="yyyy-MM-dd"
            ref={endDateRef}
          />
          <AiOutlineCalendar
            className="ml-2 text-gray-500 cursor-pointer"
            onClick={() => endDateRef.current?.setOpen(true)}
          />
        </div>
      </div>

      {/* Type filter */}
      {activeTab !== "following" && activeTab !== "interested" && activeTab !== "nonInterested" && (
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 px-3 py-2 border rounded-lg"
          >
            <option value="all">All</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>
      )}

      {/* Reset Button */}
      <div className="flex items-end">
        <button
          onClick={handleReset}
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
