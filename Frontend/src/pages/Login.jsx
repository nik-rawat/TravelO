import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setUid } from "@/redux/authSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const [forgotEmail, setForgotEmail] = useState(""); // State for forgot email
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const uid = data.data;
        console.log("Login successful. UID:", uid);
        dispatch(setUid(uid));
        navigate("/plans");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotEmail }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        alert("Password reset email sent. Please check your inbox.");
      } else {
        alert("Failed to send password reset email. Please try again.");
      }
    } catch (error) {
      console.error("Error during forgot password:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-white text-center mb-6">Login to Your Account</h1>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-transparent text-white"
                placeholder="abc@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-transparent text-white"
                placeholder="********"
                required
              />
            </div>
            <div className="flex justify-between">
              <a
                className="text-blue-400 hover:underline cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                Forgot password?
              </a>
              <Button type="submit" className="w-auto bg-white hover:bg-slate-50 text-black">
                Login
              </Button>
            </div>
          </form>
          <p className="text-slate-400 text-center mt-4">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:underline">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gradient-to-bl from-gray-900 to-gray-950 text-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="forgot-email">Email</Label>
                <Input
                  type="email"
                  id="forgot-email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="mt-1 bg-transparent text-white"
                  placeholder="example@example.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-lg">
                Reset Password
              </Button>
            </form>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 text-red-500 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;