import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ChildAdminList from "../../components/tables/childAdminlist";
import PermissionEditor from "../../components/tables/chidAdminEditor";
import { getChildAdmins, getAdminPermissions } from "../../Services/childAdminServices/childAdminServices";

export default function ChildAdminPermissionPage() {
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Fetch all child admins
  const { data: admins = [], isLoading: loadingAdmins, isError: errorAdmins } = useQuery({
    queryKey: ["childAdmins"],
    queryFn: getChildAdmins,
  });

  // Fetch permissions for selected admin
  const { data: adminPermissions, isLoading: loadingPermissions, isError: errorPermissions } = useQuery({
    queryKey: ["adminPermissions", selectedAdmin?._id],
    queryFn: () => getAdminPermissions(selectedAdmin?._id),
    enabled: !!selectedAdmin,
  });

  const handleSelectAdmin = (admin) => setSelectedAdmin(admin);

  if (loadingAdmins) return <p className="p-6">Loading child admins...</p>;
  if (errorAdmins) return <p className="p-6 text-red-500">Failed to load child admins.</p>;

  return (
    <div className="flex w-full h-screen bg-gray-50">
      {/* Left: Child Admin List */}
      <div className="w-1/3 border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Child Admins</h2>
        <ChildAdminList admins={admins} onSelect={handleSelectAdmin} />
      </div>

      {/* Right: Permission Editor */}
      <div className="w-2/3 p-4 overflow-y-auto">
        {selectedAdmin ? (
          loadingPermissions ? (
            <p className="text-gray-500 mt-10 text-center">Loading permissions...</p>
          ) : errorPermissions ? (
            <p className="text-red-500 mt-10 text-center">Failed to load permissions.</p>
          ) : (
            <PermissionEditor admin={selectedAdmin} permissions={adminPermissions} />
          )
        ) : (
          <p className="text-gray-500 mt-10 text-center">
            Select a child admin to edit permissions
          </p>
        )}
      </div>
    </div>
  );
}
