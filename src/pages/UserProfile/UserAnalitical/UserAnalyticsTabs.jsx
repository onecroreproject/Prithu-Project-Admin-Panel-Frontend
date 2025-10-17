export default function UserAnalyticsTabs({ activeTab, onTabChange }) {
  const tabs = [
    { key: "following", label: "Following" },
    { key: "interested", label: "Interested Categories" },
    { key: "nonInterested", label: "Non-Interested Categories" },
    { key: "hidden", label: "Hidden Feeds" },
    { key: "liked", label: "Liked Feeds" },
    { key: "disliked", label: "Disliked Feeds" },
    { key: "commented", label: "Commented Feeds" },
    { key: "shared", label: "Shared Feeds" },
    { key: "downloaded", label: "Downloaded Feeds" },
  ];

  return (
    <div className="bg-white rounded-xl shadow mb-6">
      <div className="flex border-b border-gray-200 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-4 py-2 -mb-px font-medium text-sm border-b-2 transition-colors duration-300 ${
              activeTab === tab.key ? "border-blue-500 text-blue-500" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
