import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useAdminAuth } from "../../context/adminAuthContext";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: reset password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const { sendOtp, verifyOtp, resetPassword, loading, error } = useAdminAuth();
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await sendOtp(email);
      setStep(2);
    } catch (err) {
      console.error(err);
    }
  };

  // Step 2: Verify OTP
// Step 2: Verify OTP
const handleVerifyOtp = async (e) => {
  e.preventDefault();
  try {
    const msg = await verifyOtp(otp);  // Call context function
    if (msg) {
      setSuccessMsg(msg);              // Show success message
      setTimeout(() => {
        setSuccessMsg("");             // Clear message
        setStep(3);                    // Move to reset password step
      }, 1500);                        // wait 1.5s before moving
    }
  } catch (err) {
    console.error(err);
  }
};


  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match!");
    }

    try {
      const msg = await resetPassword(email, newPassword);
      if (msg) {
        setSuccessMsg(msg);
        setTimeout(() => navigate("/signin"), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: "100%" },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "-100%" },
  };
  const pageTransition = { duration: 0.5 };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="flex flex-col flex-1"
    >
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link to="/signin" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeftIcon className="size-5" />
          Back to Sign In
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md">Forgot Password</h1>
          <p className="text-sm text-gray-500">
            {step === 1 ? "Enter your email to receive an OTP." :
             step === 2 ? "Enter the OTP sent to your email." :
             "Set your new password."}
          </p>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <form onSubmit={step === 1 ? handleSendOtp : step === 2 ? handleVerifyOtp : handleResetPassword}>
          <div className="space-y-6">
            {step === 1 && (
              <div>
                <Label>Email *</Label>
                <Input placeholder="info@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            )}

            {step === 2 && (
              <div>
                <Label>OTP *</Label>
                <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
              </div>
            )}

            {step === 3 && (
              <>
                <div>
                  <Label>New Password *</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? <EyeIcon className="size-5" /> : <EyeCloseIcon className="size-5" />}
                    </span>
                  </div>
                </div>
                <div>
                  <Label>Confirm Password *</Label>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </>
            )}

            <Button className="w-full" size="sm" type="submit" disabled={loading}>
              {loading ? "Processing..." : step === 1 ? "Send OTP" : step === 2 ? "Verify OTP" : "Reset Password"}
            </Button>

            {successMsg && <p className="text-green-500 text-center mt-2">{successMsg}</p>}
          </div>
        </form>
      </div>
    </motion.div>
  );
}
