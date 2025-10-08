import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReports, updateReportAction } from "../../../Services/ReportServices/reportService";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import { FaPlay } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function UserFeedReportTable() {
  const [selectedStatus, setSelectedStatus] = useState({});
  const [mediaToView, setMediaToView] = useState(null);
  const [statusChanged, setStatusChanged] = useState({});
  const [showRejected, setShowRejected] = useState(false);

  const queryClient = useQueryClient();

  // Fetch reports
  const { data: reports = [], isLoading, isError } = useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
  });

  // Initialize selectedStatus for each report when data loads
  useEffect(() => {
    if (!reports.length) return;

    const initialStatus = {};
    reports.forEach((report) => {
      initialStatus[report._id] = report.status;
    });

    setSelectedStatus((prev) => {
      const hasChanged = Object.keys(initialStatus).some(
        (key) => prev[key] !== initialStatus[key]
      );
      return hasChanged ? initialStatus : prev;
    });
  }, [reports]);

  // Mutation to update report status
  const mutation = useMutation({
    mutationFn: ({ reportId, status }) => updateReportAction(reportId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["reports"]);
      alert("Report status updated successfully!");
    },
    onError: (err) => {
      console.error("Update failed:", err);
      alert("Failed to update report.");
    },
  });

  const handleStatusChange = (reportId, value) => {
    setSelectedStatus((prev) => ({ ...prev, [reportId]: value }));
    setStatusChanged((prev) => ({ ...prev, [reportId]: true }));
  };

  const handleProceed = (reportId) => {
    const status = selectedStatus[reportId];
    if (!status) return alert("Please select a status first.");
    mutation.mutate({ reportId, status });
    setStatusChanged((prev) => ({ ...prev, [reportId]: false }));
  };

  if (isLoading) return <p className="p-4">Loading reports...</p>;
  if (isError) return <p className="p-4 text-red-500">Failed to fetch reports.</p>;

  // Filter reports based on rejected toggle
  const visibleReports = reports.filter(report =>
    showRejected ? report.status === "Rejected" : report.status !== "Rejected"
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
      {/* Toggle button for rejected reports */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowRejected((prev) => !prev)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showRejected ? "Hide Rejected Reports" : "Show Rejected Reports"}
        </button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table className="min-w-[900px] table-fixed">
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="w-24 text-center">Feed</TableCell>
              <TableCell isHeader className="w-32">Created By</TableCell>
              <TableCell isHeader className="w-32">Reported User</TableCell>
              <TableCell isHeader className="w-24">Report Type</TableCell>
              <TableCell isHeader className="w-64">Description</TableCell>
              <TableCell isHeader className="w-24">Status</TableCell>
              <TableCell isHeader className="w-28">Actions</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            <AnimatePresence>
              {visibleReports.map((report) => (
                <motion.tr
                  key={report._id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Feed */}
                  <TableCell className="text-center">
                    {report.target?.contentUrl ? (() => {
                      const url = report.target.contentUrl;
                      const ext = url.split(".").pop().toLowerCase();
                      const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
                      const isVideo = ["mp4", "mov", "webm", "ogg"].includes(ext);

                      if (isImage) return (
                        <img
                          src={url}
                          alt="Feed"
                          className="w-16 h-16 object-cover rounded mx-auto cursor-pointer"
                          onClick={() => setMediaToView({ url, type: "image" })}
                        />
                      );
                      if (isVideo) return (
                        <FaPlay
                          className="text-blue-500 cursor-pointer hover:text-blue-600 mx-auto"
                          size={18}
                          onClick={() => setMediaToView({ url, type: "video" })}
                        />
                      );
                      return <span className="text-gray-400">Unsupported</span>;
                    })() : <span className="text-gray-400">No Feed</span>}
                  </TableCell>

                  {/* Created By */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 overflow-hidden rounded-full">
                        <img src={report.target?.createdBy?.avatar || "/default-avatar.png"} alt={report.target?.createdBy?.username || "Unknown"} />
                      </div>
                      <span>{report.target?.createdBy?.username || "Unknown"}</span>
                    </div>
                  </TableCell>

                  {/* Reported By */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 overflow-hidden rounded-full">
                        <img src={report.reportedBy?.avatar || "/default-avatar.png"} alt={report.reportedBy?.username || "Unknown"} />
                      </div>
                      <span>{report.reportedBy?.username || "Unknown"}</span>
                    </div>
                  </TableCell>

                  {/* Report Type */}
                  <TableCell>{report.type || ""}</TableCell>

                  {/* Description */}
                  <TableCell>
                    {Array.isArray(report.answers) ? report.answers.map((a, i) => (
                      <div key={i}>
                        <strong>{a.questionText}:</strong> {a.selectedOption}
                      </div>
                    )) : "Not Available"}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <select
                      value={selectedStatus[report._id] ?? report.status ?? ""}
                      onChange={(e) => handleStatusChange(report._id, e.target.value)}
                      className="border rounded px-2 py-1 w-full text-sm"
                    >
                      <option value="" disabled>Select Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Action Taken">Action Taken</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <button
                      disabled={!statusChanged[report._id] || mutation.isLoading}
                      onClick={() => handleProceed(report._id)}
                      className={`px-4 py-2 rounded text-white shadow-sm transition-all ${
                        statusChanged[report._id] ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {mutation.isLoading ? "Updating..." : "Proceed"}
                    </button>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Media Modal */}
      {mediaToView && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded p-4 relative max-w-3xl w-96">
            <button
              onClick={() => setMediaToView(null)}
              className="absolute top-2 right-2 text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600"
            >
              X
            </button>
            {mediaToView.type === "image" ? (
              <img src={mediaToView.url} alt="Feed" className="w-96 max-h-96 rounded" />
            ) : (
              <video src={mediaToView.url} controls autoPlay className="w-full max-h-[48] rounded" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
