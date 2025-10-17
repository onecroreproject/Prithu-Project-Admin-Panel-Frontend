import DashBoardMetricks from "./Blocks/dashBoardMetricks";
import MonthlySalesChart from "../../components/ecommerce/UserRegistrationRatio";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import SubscriptionRevenue from "../../components/ecommerce/SubsciptionRevenue";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import { useEffect } from "react";
import { useAdminAuth } from "../../context/adminAuthContext";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();
  const { admin } = useAdminAuth();


  useEffect(() => {
    if (!admin?.token) {
      navigate("/signin"); 
    }
  }, [admin?.token, navigate]);

  return (
    <>
      <PageMeta title="Prithu Dash Board" description="" />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <DashBoardMetricks />
          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <SubscriptionRevenue />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
