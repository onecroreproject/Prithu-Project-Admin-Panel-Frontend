import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateChildAdminPermissions } from "../../Services/childAdminServices/childAdminServices";

export default function PermissionEditor({ admin, permissions, onPermissionsUpdated }) {
  const [granted, setGranted] = useState([]);
  const [ungranted, setUngranted] = useState([]);
  const [selectedGranted, setSelectedGranted] = useState([]);
  const [selectedUngranted, setSelectedUngranted] = useState([]);
  const prevAdminId = useRef(null);

  useEffect(() => {
    if (!permissions) return;

    if (admin?.childAdminId !== prevAdminId.current) {
      setGranted(permissions.grantedPermissions || []);
      setUngranted(permissions.ungrantedPermissions || []);
      setSelectedGranted([]);
      setSelectedUngranted([]);
      prevAdminId.current = admin?.childAdminId;
    }
  }, [admin?.childAdminId, permissions]);

  const mutation = useMutation({
    mutationFn: (updated) => updateChildAdminPermissions(admin.childAdminId, updated),
    onSuccess: () => {
      alert("Permissions updated successfully!");
      onPermissionsUpdated && onPermissionsUpdated();
    },
    onError: (err) => {
      console.error(err);
      alert("Failed to update permissions");
    },
  });

  const toggleSelect = (permission, type) => {
    if (type === "granted") {
      setSelectedGranted(prev =>
        prev.includes(permission) ? prev.filter(p => p !== permission) : [...prev, permission]
      );
    } else {
      setSelectedUngranted(prev =>
        prev.includes(permission) ? prev.filter(p => p !== permission) : [...prev, permission]
      );
    }
  };

  const moveToUngranted = () => {
    setGranted(prev => prev.filter(p => !selectedGranted.includes(p)));
    setUngranted(prev => [...prev, ...selectedGranted]);
    setSelectedGranted([]);
  };

  const moveToGranted = () => {
    setUngranted(prev => prev.filter(p => !selectedUngranted.includes(p)));
    setGranted(prev => [...prev, ...selectedUngranted]);
    setSelectedUngranted([]);
  };

  const handleSave = () => {
    mutation.mutate({ grantedPermissions: granted, menuPermissions: permissions.menuPermissions, customPermissions: permissions.customPermissions });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center mb-4">
        <img
          src={admin.avatarUrl || "/default-avatar.png"}
          alt={admin.userName}
          className="w-12 h-12 rounded-full mr-3"
        />
        <h2 className="text-xl font-semibold">{admin.userName}</h2>
      </div>

      {/* Permission Lists */}
      <div className="flex flex-1 overflow-y-auto">
        {/* Granted */}
        <div className="flex-1 border border-gray-300 p-4 rounded mr-2">
          <h3 className="font-semibold mb-2">Granted</h3>
          <ul className="space-y-1">
            {granted.map((p) => (
              <li key={p}>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedGranted.includes(p)}
                    onChange={() => toggleSelect(p, "granted")}
                  />
                  <span className="capitalize">{p}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col justify-center items-center space-y-4">
          <button
            onClick={moveToUngranted}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Remove &gt;&gt;
          </button>
          <button
            onClick={moveToGranted}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            &lt;&lt; Add
          </button>
        </div>

        {/* Ungranted */}
        <div className="flex-1 border border-gray-300 p-4 rounded ml-2">
          <h3 className="font-semibold mb-2">Ungranted</h3>
          <ul className="space-y-1">
            {ungranted.map((p) => (
              <li key={p}>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedUngranted.includes(p)}
                    onChange={() => toggleSelect(p, "ungranted")}
                  />
                  <span className="capitalize">{p}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-4 text-right">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Saving..." : "Save Permissions"}
        </button>
      </div>
    </div>
  );
}
