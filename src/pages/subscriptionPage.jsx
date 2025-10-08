import { motion } from "framer-motion";
import SubscriptionForm from "../components/form/subscriptionForm";
import SubscriptionList from "../layout/subscriptionList";

const SubscriptionPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row gap-6 p-4 md:p-6"
    >
      {/* Left side - Subscription Form */}
      <div className="w-full md:w-1/3 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 md:p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Create Subscription
        </h2>
        <SubscriptionForm />
      </div>

      {/* Right side - Subscription List */}
      <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 md:p-6 overflow-auto max-h-[80vh]">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          All Subscriptions
        </h2>
        <SubscriptionList />
      </div>
    </motion.div>
  );
};

export default SubscriptionPage;
