// components/UserOverviewTabs.jsx
import { AnimatePresence } from "framer-motion";
import TabContent from "./TabContent";

export default function UserOverviewTabs({ user, activeTab, setActiveTab }) {
  const tabs = [
    "Profile",
    "Account",
    "Subscription",
    "Device",
    "Activity",
    "Education",
    "Employment",
  ];

  return (
    <div className="bg-white rounded-2xl shadow p-7 flex flex-col">
      <div className="font-semibold text-lg mb-4">User Overview</div>

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

      <div className="overflow-y-auto max-h-[290px]">
        <AnimatePresence mode="wait">
          <TabContent user={user} activeTab={activeTab} />
        </AnimatePresence>
      </div>
    </div>
  );
}
