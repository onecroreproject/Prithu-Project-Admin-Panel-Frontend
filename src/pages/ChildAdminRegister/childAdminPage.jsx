import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ChildAdminForm from "../../components/auth/childAdminCreationForm";
import { getChildAdmins } from "../../Services/childAdminServices/childAdminServices";

export default function AdminChildPage() {
  const queryClient = useQueryClient();

  // Fetch child admins using React Query
  const { data: childAdmins = [], refetch, isLoading, isError } = useQuery({
    queryKey: ["childAdmins"],
    queryFn: getChildAdmins,
  });

  // This function will be called from ChildAdminForm after successful creation
  const handleAddChildAdmin = (newAdmin) => {
    // Optimistically update the list in React Query cache
    queryClient.setQueryData(["childAdmins"], (old = []) => [newAdmin, ...old]);
  };

  if (isLoading) return <p className="p-6">Loading child admins...</p>;
  if (isError) return <p className="p-6 text-red-500">Failed to load child admins.</p>;

  return (
    <div className="flex w-full h-screen bg-gray-50">
      {/* Left: Child Admin Form */}
      <div className="flex-1 border-r border-gray-200 p-6 overflow-y-auto">
        <ChildAdminForm onSuccess={handleAddChildAdmin} />
      </div>

      {/* Right: Child Admin List */}
      <div className="flex-1 p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Child Admin List</h2>

        {/* Scrollable container */}
        <div className="flex-1 overflow-y-auto">
          <table className="min-w-full table-fixed border border-gray-200 bg-white rounded-lg">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="w-1/2 py-2 px-3 text-left">Admin ID</th>
                <th className="w-1/2 py-2 px-3 text-left">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {childAdmins.map((admin) => (
                  <motion.tr
                    key={admin.childAdminId}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="py-2 px-3">{admin.childAdminId}</td>
                    <td className="py-2 px-3">{admin.email}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {childAdmins.length === 0 && (
            <p className="mt-4 text-gray-500">No child admins yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
