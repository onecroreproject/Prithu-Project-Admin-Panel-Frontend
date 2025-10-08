import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import SubscriptionCard from "../components/cards/subcriptionCard";
import { fetchPlans, deletePlan, updatePlan } from "../Services/Subscription/subscriptionService";

const SubscriptionList = () => {
  const queryClient = useQueryClient();

  // Fetch plans
  const { data: plans = [], isLoading, isError } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      toast.success("Subscription deleted");
      queryClient.invalidateQueries(["plans"]);
    },
    onError: () => {
      toast.error("Error deleting subscription");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updatePlan,
    onSuccess: () => {
      toast.success("Subscription updated");
      queryClient.invalidateQueries(["plans"]);
    },
    onError: () => {
      toast.error("Error updating subscription");
    },
  });

  const handleDelete = (id) => deleteMutation.mutate(id);
  const handleUpdate = (id, updates) => updateMutation.mutate({ id, updates });

  if (isLoading)
    return <p className="text-center text-gray-500">Loading plans...</p>;
  if (isError)
    return <p className="text-center text-red-500">Error fetching plans</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {plans.length === 0 ? (
        <p className="col-span-full text-center text-gray-500">
          No Plans Available
        </p>
      ) : (
        plans.map((plan, index) => (
          <motion.div
            key={plan._id}
            initial={{ opacity: 0, x: -50 }} // fade in from left
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
          >
            <SubscriptionCard
              plan={plan}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </motion.div>
        ))
      )}
    </div>
  );
};

export default SubscriptionList;
