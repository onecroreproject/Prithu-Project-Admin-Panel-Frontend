// App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AdminAuthProvider } from "./context/adminAuthContext";
import { AdminProfileProvider } from "./context/adminProfileContext";

// Pages & Layout
import SignIn from "./pages/AuthPages/SignIn";
import ForgotPassword from "./components/auth/forgotPasswordForm";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Dashboard/Home";
import UploadPage from "./pages/uploadPage";
import ReferralTreePage from "./pages/userTree";
import UserAnalytics from "./pages/UserProfile/UserAnalitical/userAnaliticalPage";
import UserProfiles from "./pages/UserProfile/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import {ScrollToTop} from "./components/common/ScrollToTop";
import UserFeedReportTable from "./components/tables/UserTabel/userReportTable";
import ChildAdminPage from "./pages/ChildAdminRegister/childAdminPage";
import CreatorTable from "./components/tables/UserTabel/creatorTable";
import SubscriptionPage from "./pages/subscriptionPage";
import UserDashboard from "./pages/UserProfile/userProfilePage";
import ChildAdminPermissionPage from "./pages/ChildAdminRegister/childAdminPermissionPage";

// Error Boundary
import { ErrorBoundary } from "react-error-boundary";
import TrendingCreatorsPage from "./pages/trendingCreator";
import AdminProfilePage from "./pages/adminProfilePage";
import ChildAdminProfile from "./pages/ChildAdminProfilePage/childAdminProfilePage";
import IndividualUserProfilePage from "./pages/UserProfile/UserAnalitical/individualUserProfilePage";
import SalesDashboard from "./pages/SalesDashboard/salesdashBoardPage";

function RouteErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold text-red-600">Something went wrong!</h2>
      <p className="mt-2 text-gray-700">{error.message}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={resetErrorBoundary}
      >
        Try Again
      </button>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth Pages */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/reset-password" element={<ForgotPassword />} />

        {/* Dashboard Layout */}
        <Route element={<AppLayout />}>
          <Route index path="/" element={<Home />} />
          <Route path="/admin/upload/page" element={<UploadPage />} />
          <Route path="/tree" element={<ReferralTreePage />} />
          <Route path="/user/analitical/page/:userId" element={<UserAnalytics />} />
          <Route path="/referal/tree/page/:userId" element={<ReferralTreePage />} />
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />
          <Route path="/form-elements" element={<FormElements />} />
          <Route path="/basic-tables" element={<BasicTables />} />
          <Route path="/creator/trending/table" element={<CreatorTable />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
          <Route path="/user-reportinfo" element={<UserFeedReportTable />} />
          <Route path="/child/admin/page" element={<ChildAdminPage />} />
          <Route path="/subscription/page" element={<SubscriptionPage />} />
          <Route path="/user/profile/dashboard" element={<UserDashboard />} />
          <Route path="/childadmin/permission/:id" element={<ChildAdminPermissionPage />} />
          <Route path="/trending/creator" element={<TrendingCreatorsPage/>}/>
          <Route path="/admin/profile/page" element={<AdminProfilePage/>}/>
          <Route path="/child/admin/profile/:id" element={<ChildAdminProfile/>}/>
          <Route path="/individual/user/profile/:id" element={<IndividualUserProfilePage/>}/>
          <Route path="/sales/dashboard" element={<SalesDashboard/>}/>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <AdminProfileProvider>
        <Router>
          <ScrollToTop />
          <ErrorBoundary FallbackComponent={RouteErrorFallback}>
            <AnimatedRoutes />
          </ErrorBoundary>
        </Router>
      </AdminProfileProvider>
    </AdminAuthProvider>
  );
}
