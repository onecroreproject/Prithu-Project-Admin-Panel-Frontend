import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createPlan } from "../../Services/Subscription/subscriptionService";

const SubscriptionForm = () => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    durationDays: "",
    description: "",
    planType: "basic",
    downloadLimit: "",
    adFree: false,
    deviceLimit: "",
    isActive: true,
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      toast.success("Subscription plan created successfully");
      setFormData({
        name: "",
        price: "",
        durationDays: "",
        description: "",
        planType: "basic",
        downloadLimit: "",
        adFree: false,
        deviceLimit: "",
        isActive: true,
      });
      queryClient.invalidateQueries(["plans"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Error creating subscription");
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-xl mx-auto bg-indigo-50 p-8 rounded-2xl shadow-md"
    >
      <h3 className="text-xl font-semibold text-indigo-700 text-center mb-4 tracking-wide">
        Create Subscription Plan
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <input
          type="text"
          name="name"
          placeholder="Plan Name"
          value={formData.name}
          onChange={handleChange}
          className="rounded-lg border border-indigo-300 focus:ring-2 focus:ring-indigo-400 px-4 py-3 transition placeholder:text-indigo-400"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="rounded-lg border border-indigo-300 focus:ring-2 focus:ring-indigo-400 px-4 py-3 transition placeholder:text-indigo-400"
          required
        />
        <input
          type="number"
          name="durationDays"
          placeholder="Duration (days)"
          value={formData.durationDays}
          onChange={handleChange}
          className="rounded-lg border border-indigo-300 focus:ring-2 focus:ring-indigo-400 px-4 py-3 transition placeholder:text-indigo-400"
          required
        />
        <input
          type="number"
          name="downloadLimit"
          placeholder="Download Limit"
          value={formData.downloadLimit}
          onChange={handleChange}
          className="rounded-lg border border-indigo-300 focus:ring-2 focus:ring-indigo-400 px-4 py-3 transition placeholder:text-indigo-400"
        />
        <input
          type="number"
          name="deviceLimit"
          placeholder="Device Limit"
          value={formData.deviceLimit}
          onChange={handleChange}
          className="rounded-lg border border-indigo-300 focus:ring-2 focus:ring-indigo-400 px-4 py-3 transition placeholder:text-indigo-400"
        />
        <select
          name="planType"
          value={formData.planType}
          onChange={handleChange}
          className="rounded-lg border border-indigo-300 focus:ring-2 focus:ring-indigo-400 px-4 py-3 transition"
        >
          <option value="trial">Trial</option>
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full rounded-lg border border-indigo-300 focus:ring-2 focus:ring-indigo-400 px-4 py-3 transition resize-none min-h-[100px] placeholder:text-indigo-400"
      />

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-indigo-700">
          <input
            type="checkbox"
            name="adFree"
            checked={formData.adFree}
            onChange={handleChange}
            className="h-5 w-5 rounded border-indigo-400 text-indigo-600 focus:ring-2 focus:ring-indigo-400"
          />
          Ad-Free
        </label>
        <label className="flex items-center gap-2 text-indigo-700">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-5 w-5 rounded border-indigo-400 text-indigo-600 focus:ring-2 focus:ring-indigo-400"
          />
          Active
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
      >
        {isLoading ? "Creating..." : "Create Plan"}
      </button>
    </form>
  );
};

export default SubscriptionForm;
