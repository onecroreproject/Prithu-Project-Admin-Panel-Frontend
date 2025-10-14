import BasicTable from "../Tables/BasicTables";
import UserMetricks from "./userProfileMetricks";
import { motion, AnimatePresence } from "framer-motion";

const dashboardFade = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, type: "spring", bounce: 0.15 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
};

export default function UserDashboard() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="user-dashboard"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={dashboardFade}
        className="min-h-screen p-6 space-y-8 bg-gradient-to-br from-blue-50 to-indigo-50"
      >
        {/* Dashboard Metrics Section */}
        <motion.div
          variants={dashboardFade}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="rounded-xl bg-white shadow-lg p-6"
        >
          <UserMetricks />
        </motion.div>

        {/* User Table Section */}
        <motion.div
          variants={dashboardFade}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="rounded-xl bg-white shadow p-6"
        >
          <BasicTable />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
