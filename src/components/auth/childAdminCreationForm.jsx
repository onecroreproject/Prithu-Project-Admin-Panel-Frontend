import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { useAdminAuth } from "../../context/adminAuthContext";

export default function ChildAdminForm({ onSuccess }) { // receive onSuccess
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [popup, setPopup] = useState(null);

  const { createChildAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!username.trim()) {
        throw new Error("User Name is required");
      }

      const res = await createChildAdmin({
        username: username.trim(),
        email,
        password,
        adminType: "Child_Admin",
      });

      if (res?.admin) {
        const { email, childAdminId, username, adminType } = res.admin;

        // Call onSuccess to update parent state instantly
        if (onSuccess) onSuccess({ email, childAdminId, username, adminType });

        setPopup({
          type: "success",
          message: null,
          content: (
            <div className="space-y-2">
              <p className="font-semibold text-green-600">Child Admin created successfully!</p>
              <div className="text-gray-700">
                <p><span className="font-semibold">Email:</span> {email}</p>
                <p><span className="font-semibold">Password:</span> {password}</p>
                <p><span className="font-semibold">ChildAdmin ID:</span> {childAdminId}</p>
              </div>
            </div>
          ),
        });

        // Clear form
        setUsername("");
        setEmail("");
        setPassword("");
        setIsChecked(false);
      } else {
        const errMsg = res?.error || res?.message || "Failed to create Child Admin";
        setPopup({ type: "error", message: errMsg });
        setError(errMsg);
      }
    } catch (err) {
      const errMsg = err.message || "Something went wrong";
      setPopup({ type: "error", message: errMsg });
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-full no-scrollbar relative">
      {/* Response Modal */}
      {popup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-sm animate-fadeIn">
            <h2 className={`text-lg font-semibold mb-2 ${popup.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {popup.type === "success" ? "Success" : "Error"}
            </h2>
            <div className="text-gray-700">
              {popup.content ? popup.content : <p>{popup.message}</p>}
            </div>
            <button
              onClick={() => setPopup(null)}
              className="mt-4 px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link to="/" className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700">
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md">
            Create Child Admin
          </h1>
          <p className="text-sm text-gray-500">Fill in the details to create a new child admin account.</p>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>User Name<span className="text-error-500">*</span></Label>
            <Input
              type="text"
              placeholder="Enter user name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Email<span className="text-error-500">*</span></Label>
            <Input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Password<span className="text-error-500">*</span></Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? <EyeIcon className="fill-gray-500 size-5" /> : <EyeCloseIcon className="fill-gray-500 size-5" />}
              </span>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Child Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
