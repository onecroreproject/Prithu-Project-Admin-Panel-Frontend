// components/TabContent.jsx
import { motion } from "framer-motion";
import TableDisplay from "./TableDisplay";

export default function TabContent({ user, activeTab }) {
  const render = (rows) => <TableDisplay rows={rows} />;

  switch (activeTab) {
    case "Profile":
      return (
        <motion.div key="Profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {render([
            { label: "Gender", value: user.profile?.gender },
            { label: "DOB", value: user.profile?.dateOfBirth ? new Date(user.profile.dateOfBirth).toLocaleDateString() : "-" },
            { label: "Marital Status", value: user.profile?.maritalStatus === "true" ? "Married" : "Single" },
            { label: "Timezone", value: user.profile?.timezone },
            { label: "Bio", value: user.profile?.bio },
          ])}
        </motion.div>
      );

    case "Account":
      return (
        <motion.div key="Account" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {render([
            { label: "Referral Code", value: user.referralCode },
            { label: "Referred By", value: user.referredByUserId },
            { label: "Level", value: user.currentLevel },
            { label: "Tier", value: user.currentTier },
            { label: "Total Earnings", value: `$${user.totalEarnings || 0}` },
            { label: "Withdrawable", value: `$${user.withdrawableEarnings || 0}` },
          ])}
        </motion.div>
      );

    // other cases follow similar pattern (Subscription, Device, Activity, etc.)
    default:
      return <div className="text-gray-400 px-2">No data available.</div>;
  }
}
