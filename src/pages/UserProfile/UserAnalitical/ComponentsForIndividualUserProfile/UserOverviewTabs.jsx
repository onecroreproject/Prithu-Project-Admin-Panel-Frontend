import { AnimatePresence } from "framer-motion";
import TabContent from "./TabContent";

export default function UserOverviewTabs({ user, activeTab, setActiveTab }) {
  const tabs = [
    "Profile",
    "Account",
    "Subscription",
    "Device",
    "Referrals",
    "Education",
    "Employment",
  ];

  return (
    <div className="bg-white rounded-2xl shadow p-7 flex flex-col h-max">
      <div className="font-semibold text-lg mb-4">User Overview</div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`min-w-[110px] whitespace-nowrap px-2 py-2 text-base font-medium transition-all border-b-2 ${
              activeTab === tab
                ? "border-blue-600 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Fixed Height Content Area */}
      <div
        className="overflow-y-auto"
        style={{
          minHeight: "600px",  // 👈 standard height
          maxHeight: "600px",
        }}
      >
        <AnimatePresence mode="wait">
          <TabContent user={user} activeTab={activeTab} />
        </AnimatePresence>
      </div>
    </div>
  );
}
