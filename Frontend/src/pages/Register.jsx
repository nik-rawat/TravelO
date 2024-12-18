import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "../components/Navbar";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]"> {/* Adjust min-height based on Navbar height */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-white text-center mb-6">Login to Your Account</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 bg-transparent"
              placeholder="abc"
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
              className="mt-1 bg-transparent"
              placeholder="********"
              required
            />
          </div>
          <div>
            <Label htmlFor="cpassword" className="text-white">Confirm Password</Label>
            <Input
              type="password"
              id="cpassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 bg-transparent"
              placeholder="********"
              required
            />
          </div>
          <Button type="submit" className="w-auto bg-white hover:bg-slate-50 text-black">
            Login
          </Button>
        </form>
        <p className="text-slate-400 text-center mt-4">
          Don't have an account? <a href="/login" className="text-blue-400 hover:underline">Sign In</a>
        </p>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;