// TrendingCreatorsPage.jsx
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import TrendingCreatorsTable from "../pages/Tables/CreatorTable/trendingCreatorTable";

// Example: replace with real API call later
async function fetchTrendingCreators() {
  try {
    // If you have an API endpoint, replace the below line with fetch/axios call
    // const res = await fetch("/api/trending-creators");
    // const data = await res.json();

    // Mock data example
    const data = [
      {
        accountId: "1",
        userName: "Creator One",
        profileAvatar: "https://i.pravatar.cc/150?img=1",
        trendingScore: 95,
        totalVideoViews: 1200,
        totalImageViews: 340,
        totalLikes: 500,
        totalShares: 75,
        followerCount: 1500,
        lastUpdated: new Date(),
      },
      {
        accountId: "2",
        userName: "Creator Two",
        profileAvatar: "https://i.pravatar.cc/150?img=2",
        trendingScore: 80,
        totalVideoViews: 900,
        totalImageViews: 200,
        totalLikes: 320,
        totalShares: 50,
        followerCount: 1100,
        lastUpdated: new Date(),
      },
    ];

    return data;
  } catch (err) {
    toast.error("Failed to fetch trending creators");
    return [];
  }
}

export default function TrendingCreatorsPage() {
  const { data: creators = [], isLoading, isError } = useQuery({
    queryKey: ["trendingCreators"],
    queryFn: fetchTrendingCreators,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <p className="text-center py-10">Loading trending creators...</p>;
  if (isError) return <p className="text-center text-red-500 py-10">Failed to load creators</p>;

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Trending Creators</h1>
      <Toaster position="top-right" reverseOrder={false} />

      {/* Table Component */}
      <TrendingCreatorsTable creators={creators} />
    </div>
  );
}
