import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useAdminAuth } from "../../context/adminAuthContext";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { login, error, loading, role ,admin} = useAdminAuth();
  const navigate = useNavigate();

console.log(admin)
  
  
  //  useEffect(() => {
  //   if (admin?.token && (role === "Admin" || role === "Child_Admin")) {
  //     navigate("/"); // Dashboard
  //   }
  // }, [admin, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);

    if (role === "Admin" || role === "Child_Admin") navigate("/");
  };

  const pageVariants = {
    initial: { opacity: 0, x: "-100%" },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "100%" },
  };
  const pageTransition = { duration: 0.5 };

  return (
    <motion.div
      className="flex flex-col flex-1"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/reset-password"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeftIcon className="size-5" />
          Forgot password?
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm">Sign In</h1>
          <p className="text-sm text-gray-500">Enter your email and password to sign in!</p>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label>Email *</Label>
              <Input placeholder="info@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>Password *</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <span onClick={() => setShowPassword(!showPassword)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                  {showPassword ? <EyeIcon className="size-5" /> : <EyeCloseIcon className="size-5" />}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span>Keep me logged in</span>
              </div>
              <Link to="/reset-password" className="text-sm text-brand-500">Forgot password?</Link>
            </div>
            <div>
              <Button className="w-full" size="sm" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
