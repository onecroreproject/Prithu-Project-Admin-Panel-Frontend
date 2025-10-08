import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Trash } from "lucide-react";
import { fetchFeeds,deleteFeed} from "../../Services/FeedServices/feedServices";

export default function FeedManagement() {
  const queryClient = useQueryClient();

  // ✅ Fetch feeds
  const { data: feeds = [], isLoading, isError, error } = useQuery({
    queryKey: ["feeds"],
    queryFn: fetchFeeds,
  });

  console.log(feeds);

  // ✅ Delete feed mutation
  const mutation = useMutation({
    mutationFn: deleteFeed,
    onSuccess: () => {
      alert("Feed deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
    onError: (err) => alert(err.message || "Delete failed"),
  });

  const handleDelete = (feedId) => {
    if (confirm("Are you sure you want to delete this feed?")) {
      mutation.mutate(feedId);
    }
  };

  if (isLoading) return <p>Loading feeds...</p>;
  if (isError) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <h2 className="text-lg font-semibold mb-4 dark:text-white/90">
        Feed Management
      </h2>

      {feeds.length === 0 ? (
        <p>No feeds found.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="p-2">#</th>
              <th className="p-2">Type</th>
              <th className="p-2">Category</th>
              <th className="p-2">Creator</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feeds.map((feed, idx) => (
              <tr
                key={feed._id}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <td className="p-2">{idx + 1}</td>
                <td className="p-2">{feed.type}</td>
                <td className="p-2">{feed.categoryName || feed.category}</td>
                <td className="p-2">{feed.creator?.userName || "Unknown"}</td>
                <td className="p-2 flex gap-2">
                  <button className="btn-action" title="View">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="btn-action" title="Modify">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    className="btn-action text-red-500 hover:text-red-700"
                    title="Delete"
                    onClick={() => handleDelete(feed._id)}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
