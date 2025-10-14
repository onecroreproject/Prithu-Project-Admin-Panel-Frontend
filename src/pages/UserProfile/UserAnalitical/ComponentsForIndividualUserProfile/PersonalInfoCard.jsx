// components/PersonalInfoCard.jsx
import { motion } from "framer-motion";
import { FaLink, FaFacebook } from "react-icons/fa";

export default function PersonalInfoCard({ user }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-2xl p-7 h-full flex flex-col gap-2"
    >
      <div className="font-semibold text-lg mb-4">Personal Information</div>
      <dl className="space-y-4 text-[15px]">
        <div>
          <dt className="text-gray-500 mb-1">Email:</dt>
          <dd className="text-gray-900">{user.email}</dd>
        </div>
        <div>
          <dt className="text-gray-500 mb-1">Phone:</dt>
          <dd className="text-gray-900">{user.profile?.phoneNumber || "-"}</dd>
        </div>
        <div>
          <dt className="text-gray-500 mb-1">Website:</dt>
          <dd className="flex items-center gap-2 text-blue-700">
            <FaLink />
            <a
              href={`https://${user.website || "#"}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {user.website || "N/A"}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-gray-500 mb-1">Facebook:</dt>
          <dd className="flex items-center gap-2 text-blue-700">
            <FaFacebook />
            <a
              href={`https://${user.facebook || "#"}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {user.facebook || "N/A"}
            </a>
          </dd>
        </div>
      </dl>
    </motion.div>
  );
}
