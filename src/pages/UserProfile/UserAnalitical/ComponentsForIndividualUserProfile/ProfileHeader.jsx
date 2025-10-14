// components/ProfileHeader.jsx
import { useNavigate } from "react-router";
import { FaTimes } from "react-icons/fa";
export default function ProfileHeader({ user }) {
    const navigate=useNavigate();
  return (
    <div className="relative min-h-[220px] w-full shadow rounded-b-2xl overflow-hidden">
    <div className="relative">
    <button
        className="absolute top-2 right-2 z-0 p-3 bg-black/70 hover:bg-black/90 text-white rounded-full shadow-lg transition"
        onClick={() => navigate("/user/profile/dashboard")}
      >
        <FaTimes size={18} />
      </button>
      <img
        src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80"
        alt="Header"
        className="w-full h-56 object-cover"
      />
    </div>
      <div className="absolute left-4 md:left-12 bottom-12 flex items-end gap-5 z-10">
        <img
          src={user.profile?.profileAvatar || "/fallback-avatar.png"}
          alt={user.userName}
          className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
        />
        <div>
          <div className="text-xl md:text-2xl font-semibold text-white drop-shadow-lg">
            {user.userName || "Unnamed"}
          </div>
          <div className="text-sm text-white/90">{user.profile?.location || "Unknown"}</div>
          <div className="flex items-center gap-2 text-white/80 text-xs mt-2">
            <span>Following: {user.following || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
