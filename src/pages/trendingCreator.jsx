import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import TrendingCreatorsTable from "../pages/Tables/CreatorTable/trendingCreatorTable";
import { fetchTrendingCreators } from "../Services/creatorServices/creatorServices";

export default function TrendingCreatorsPage() {
  const { data: creators = [], isLoading, isError } = useQuery({
    queryKey: ["trendingCreators"],
    queryFn: fetchTrendingCreators,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading)
    return <p className="text-center py-10">Loading trending creators...</p>;
  if (isError)
    return <p className="text-center text-red-500 py-10">Failed to load creators</p>;

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Trending Creators
      </h1>
      <Toaster position="top-right" reverseOrder={false} />

      <TrendingCreatorsTable creators={creators} />
    </div>
  );
}
