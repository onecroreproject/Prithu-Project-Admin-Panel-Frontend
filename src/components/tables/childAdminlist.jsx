export default function ChildAdminList({ admins, onSelect }) {
  console.log(admins)
  return (
    <ul className="space-y-3">
      {admins.map((admin) => (
        <li key={admin.childAdminId} className="flex items-center justify-between p-3 bg-white rounded shadow">
          <div className="flex items-center space-x-3">
            <img
              src={admin.avatarUrl || "/default-avatar.png"}
              alt={admin.userName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{admin.userName}</p>
              <p className="text-sm text-gray-500">{admin.email}</p>
            </div>
          </div>
          <button
            onClick={() => onSelect(admin)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Permissions
          </button>
        </li>
      ))}
    </ul>
  );
}
