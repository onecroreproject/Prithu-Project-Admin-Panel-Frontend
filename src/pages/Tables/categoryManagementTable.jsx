import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Trash, Check } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { fetchCategories, deleteCategory, updateCategory } from "../../Services/FeedServices/feedServices";

export default function CategoryManagement() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // ✅ Fetch categories
  const { data: categories = [], isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // ✅ Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => toast.error(err.message || "Delete failed"),
  });

  // ✅ Update category mutation
  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      toast.success("Category updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingId(null);
      setEditingName("");
    },
    onError: (err) => toast.error(err.message || "Update failed"),
  });

  const handleDelete = (categoryId) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(categoryId);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.categoryId);
    setEditingName(cat.categoriesName);
  };

  const handleUpdate = (categoryId) => {
    if (editingName.trim() === "") return toast.error("Category name cannot be empty");
    updateMutation.mutate({ id: categoryId, name: editingName.trim() });
  };

  if (isLoading) return <p>Loading categories...</p>;
  if (isError) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      <h2 className="text-lg font-semibold mb-4 dark:text-white/90">Category Management</h2>

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="p-2">#</th>
              <th className="p-2">Name</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, idx) => (
              <tr key={cat.categoryId} className="border-b border-gray-200 dark:border-gray-700">
                <td className="p-2">{idx + 1}</td>

                {/* Inline editable name */}
                <td className="p-2">
                  {editingId === cat.categoryId ? (
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                  ) : (
                    cat.categoriesName
                  )}
                </td>

                {/* Actions */}
                <td className="p-2 flex gap-2">
                  {editingId === cat.categoryId ? (
                    <button
                      className="btn-action text-green-600 hover:text-green-800"
                      title="Update"
                      onClick={() => handleUpdate(cat.categoryId)}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      className="btn-action"
                      title="Modify"
                      onClick={() => startEdit(cat)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    className="btn-action text-red-500 hover:text-red-700"
                    title="Delete"
                    onClick={() => handleDelete(cat.categoryId)}
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
