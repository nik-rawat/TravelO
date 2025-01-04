import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setUid } from "@/redux/authSlice"; // Import the setUid action

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Get the dispatch function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    try {
      const response = await fetch("https://travel-o-backend.vercel.app/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const uid = data.data; // Assuming the response contains uid
        console.log("Login successful. UID:", uid); // Debug
        dispatch(setUid(uid)); // Dispatch the uid to the Redux store
        navigate("/plans"); // Redirect to plans page
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-white text-center mb-6">Login to Your Account</h1>
          {error && <p className="text-red-500 text-center">{error}</p>} {/* Display error message */}
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
            <Button type="submit" className="w-auto bg-white hover:bg-slate-50 text-black">
              Login
            </Button>
          </form>
          <p className="text-slate-400 text-center mt-4">Don&apos;t have an account? <Link to="/register" className="text-blue-400 hover:underline">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;