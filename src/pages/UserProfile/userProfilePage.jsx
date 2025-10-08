
import BasicTable from "../Tables/BasicTables"; // Adjust import path
import UserMetricks from "./userProfileMetricks"; // Adjust import path

export default function UserDashboard() {
  return (
    <div className="p-6 space-y-8">
      {/* ✅ Dashboard Metrics */}
      <UserMetricks />

      {/* ✅ User Table */}
      <BasicTable />
    </div>
  );
}
