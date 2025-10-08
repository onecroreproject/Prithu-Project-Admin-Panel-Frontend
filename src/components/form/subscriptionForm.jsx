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
      queryClient.invalidateQueries(["subscriptionPlans"]);
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
      className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg space-y-6 max-w-3xl mx-auto"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center">
        Create Subscription Plan
      </h2>

      {/* Grid layout for inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Plan Name"
          value={formData.name}
          onChange={handleChange}
          className="input-box w-full"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="input-box w-full"
          required
        />
        <input
          type="number"
          name="durationDays"
          placeholder="Duration (days)"
          value={formData.durationDays}
          onChange={handleChange}
          className="input-box w-full"
          required
        />
        <input
          type="number"
          name="downloadLimit"
          placeholder="Download Limit"
          value={formData.downloadLimit}
          onChange={handleChange}
          className="input-box w-full"
        />
        <input
          type="number"
          name="deviceLimit"
          placeholder="Device Limit"
          value={formData.deviceLimit}
          onChange={handleChange}
          className="input-box w-full"
        />
        <select
          name="planType"
          value={formData.planType}
          onChange={handleChange}
          className="input-box w-full"
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
        className="input-box w-full min-h-[100px]"
      />

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            name="adFree"
            checked={formData.adFree}
            onChange={handleChange}
            className="h-4 w-4"
          />
          Ad-Free
        </label>
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4"
          />
          Active
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 transition-colors"
      >
        {isLoading ? "Creating..." : "Create Plan"}
      </button>
    </form>
  );
};

export default SubscriptionForm;
