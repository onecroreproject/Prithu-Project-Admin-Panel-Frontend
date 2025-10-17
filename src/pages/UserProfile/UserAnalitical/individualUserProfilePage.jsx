import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchUserById } from "../../../Services/UserServices/userServices";
import ProfileHeader from "./ComponentsForIndividualUserProfile/ProfileHeader";
import PersonalInfoCard from "./ComponentsForIndividualUserProfile/PersonalInfoCard";
import UserOverviewTabs from "./ComponentsForIndividualUserProfile/UserOverviewTabs";

const pageMotion = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.4, type: "spring", bounce: 0.15 },
};

const contentMotion = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4, ease: "easeOut" },
};

export default function IndividualUserProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(id),
    enabled: !!id,
  });
console.log(user)
  const [activeTab, setActiveTab] = useState("Profile");

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <motion.div {...pageMotion} className="text-gray-600 bg-white p-8 rounded-xl shadow-lg">
          Loading user details...
        </motion.div>
      </div>
    );

  if (isError || !user)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <motion.div {...pageMotion} className="text-red-500 bg-white p-8 rounded-xl shadow-lg">
          Failed to load user profile.
        </motion.div>
      </div>
    );

  return (
    <motion.div
      {...pageMotion}
      className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-50 overflow-x-hidden p-4 lg:p-6"
    >
      {/* ===== Left Side: Header + Personal Info ===== */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="w-full lg:w-1/3 flex flex-col gap-4"
      >
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Personal Info Card */}
        <PersonalInfoCard user={user} />
      </motion.div>

      {/* ===== Right Side: Content Cards / Tabs ===== */}
      <motion.div
        {...contentMotion}
        className="w-full lg:w-2/3 pl-0 lg:pl-6 mt-4 lg:mt-0"
      >
        <UserOverviewTabs
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </motion.div>
    </motion.div>
  );
}
