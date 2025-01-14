import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [username, setUsername] = useState("");
  const [lname, setLname] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate();

  const validateForm = () => {
    // Reset error message
    setError("");

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    // Age validation
    if (age <= 0) {
      setError("Please enter a valid age.");
      return false;
    }

    // Check for empty fields
    if (!username || !fname || !lname || !gender) {
      setError("All fields are required.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Validate form before proceeding

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          fname,
          lname,
          age,
          gender,
        }),
      });

      if (response.ok) {
        setShowPopup(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-white text-center mb-6">Create a New Account</h1>
          {error && <p className="text-red-500 text-center">{error}</p>} {/* Display error message */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form Fields */}
            <div className="flex flex-col">
              <Label htmlFor="username" className="text-white">User  Name</Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 bg-transparent w-full text-white"
                placeholder="nick123"
                required
              />
            </div>
 <div className="flex flex-col">
              <Label htmlFor="fname" className="text-white">First Name</Label>
              <Input
                type="text"
                id="fname"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                className="mt-1 bg-transparent w-full text-white"
                placeholder="Nick"
                required
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="lname" className="text-white">Last Name</Label>
              <Input
                type="text"
                id="lname"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
                className="mt-1 bg-transparent w-full text-white"
                placeholder="Anderson"
                required
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-transparent w-full text-white"
                placeholder="abc@example.com"
                required
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="age" className="text-white">Age</Label>
              <Input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="mt-1 bg-transparent w-full text-white"
                placeholder="35"
                required
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="gender" className="text-white">Gender</Label>
              <Select 
                value={gender} 
                onValueChange={(value) => setGender(value)} 
                disabled={isLoading}
              >
                <SelectTrigger className="my-2 w-full sm:w-32 bg-transparent text-white">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 text-white border-t border-slate-600">
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-transparent w-full text-white"
                placeholder="********"
                required
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="cpassword" className="text-white">Confirm Password</Label>
              <Input
                type="password"
                id="cpassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 bg-transparent w-full text-white"
                placeholder="********"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-white hover:bg-slate-50 text-black">
              Register
            </Button>
          </form>
          <p className="text-slate-400 text-center mt-4">Don&apos;t have an account? <Link to="/login" className="text-blue-400 hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;