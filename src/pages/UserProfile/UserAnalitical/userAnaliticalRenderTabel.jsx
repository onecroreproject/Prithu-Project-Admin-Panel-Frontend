import React, { useState } from "react";
import VideoPopup from "../../../hooks/videoPopUp"; // import your VideoPopup component

export default function UserAnalyticsTable({ activeTab, data, currentPage, itemsPerPage }) {
  const [videoUrl, setVideoUrl] = useState(null);

  if (!data.length)
    return <p className="p-4 text-center">No data available</p>;

  const renderTableHead = () => {
    switch (activeTab) {
      case "following":
        return (
          <tr>
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Following User</th>
            <th className="px-4 py-2 border">Followed Date</th>
          </tr>
        );
      case "interested":
      case "nonInterested":
        return (
          <tr>
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Category Name</th>
            <th className="px-4 py-2 border">Action Date</th>
          </tr>
        );
      case "commented":
        return (
          <tr>
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Content</th>
            <th className="px-4 py-2 border">Comment</th>
            <th className="px-4 py-2 border">Action Date</th>
          </tr>
        );
      case "liked":
      case "disliked":
      case "shared":
      case "downloaded":
      case "hidden":
        return (
          <tr>
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Content</th>
            <th className="px-4 py-2 border">Action Date</th>
          </tr>
        );
      default:
        return (
          <tr>
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Feed</th>
            <th className="px-4 py-2 border">Date</th>
          </tr>
        );
    }
  };

  const renderTableRows = () => {
    return data.map((item, idx) => {
      const index = (currentPage - 1) * itemsPerPage + idx + 1;

      // Following Tab
      if (activeTab === "following") {
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
              {item.followedAt ? new Date(item.followedAt).toLocaleString() : "-"}
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
              {item.feed?.title || (item.feed?.contentUrl ? (
                <img
                  src={item.feed.contentUrl}
                  alt="feed content"
                  className="w-20 h-20 object-cover rounded cursor-pointer"
                  onClick={() => setVideoUrl(item.feed.contentUrl)}
                />
              ) : "-")}
            </td>
            <td className="px-4 py-2 border">{item.commentText || "-"}</td>
            <td className="px-4 py-2 border">
              {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}
            </td>
          </tr>
        );
      }

      // Hidden / Liked / Disliked / Shared Tabs
    if (["liked", "disliked", "shared", "hidden"].includes(activeTab)) {
  const feed = item.feedId || {};
  const contentUrl = feed.contentUrl || item.contentUrl;
  const contentType = item.type || (feed.type || "image");
  const actionDate =
    item.likedAt ||
    item.dislikedAt ||
    item.sharedAt ||
    item.downloadedAt ||
    item.updatedAt;

  return (
    <tr key={item._id || idx} className="border-b hover:bg-gray-100">
      <td className="px-4 py-2 border">{index}</td>
      <td className="px-4 py-2 border">
        {contentUrl ? (
          contentType === "video" ? (
            <div
              className="relative w-20 h-20 rounded-md overflow-hidden cursor-pointer"
              onClick={() => setVideoUrl(contentUrl)}
            >
              <video src={contentUrl} className="w-full h-full object-cover" muted />
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center text-white font-bold">
                ▶
              </div>
            </div>
          ) : (
            <img
              src={contentUrl}
              alt="content"
              className="w-20 h-20 object-cover rounded-md"
            />
          )
        ) : (
          feed.title || "-"
        )}
      </td>
      <td className="px-4 py-2 border">
        {actionDate ? new Date(actionDate).toLocaleString() : "-"}
      </td>
    </tr>
  );
}


      // Default Feeds Tab
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
            ) : item.title || "-"}
          </td>
          <td className="px-4 py-2 border">
            {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[600px] md:min-w-full text-left border-collapse border">
        <thead className="bg-gray-50">{renderTableHead()}</thead>
        <tbody>{renderTableRows()}</tbody>
      </table>

      {/* Video Popup */}
      {videoUrl && <VideoPopup videoUrl={videoUrl} onClose={() => setVideoUrl(null)} />}
    </div>
  );
}
