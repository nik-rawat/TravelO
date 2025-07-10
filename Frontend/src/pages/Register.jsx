import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, User, Mail, Lock, UserCircle, CheckCircle2 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { Progress } from "@/components/ui/progress";
import { auth, provider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUid } from '@/redux/authSlice';

const RegisterPage = () => {
  // Form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [username, setUsername] = useState("");
  const [lname, setLname] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(25);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const totalSteps = 4;

  // Update progress whenever step changes
  useEffect(() => {
    setProgress((currentStep / totalSteps) * 100);
  }, [currentStep]);

  const validateStep = (step) => {

    switch (step) {
      case 1: // Email validation
        {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(email)) {
            const errorMsg = "Please enter a valid email address.";
            toast.error(errorMsg);
            return false;
          }
          return true;
        }

      case 2: // Password validation
        if (password.length < 6) {
          const errorMsg = "Password must be at least 6 characters long.";
          toast.error(errorMsg);
          return false;
        }
        if (password !== confirmPassword) {
          const errorMsg = "Passwords do not match.";
          toast.error(errorMsg);
          return false;
        }
        return true;

      case 3: // Name validation
        if (!fname || !lname || !username) {
          const errorMsg = "All fields are required.";
          toast.error(errorMsg);
          return false;
        }
        return true;

      case 4: // Details validation
        if (!age || age <= 0) {
          const errorMsg = "Please enter a valid age.";
          toast.error(errorMsg);
          return false;
        }
        if (!gender) {
          const errorMsg = "Please select a gender.";
          toast.error(errorMsg);
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
        // Removed step completion toast
      } else {
        handleSubmit();
      }
    }
    // Error toasts are now handled in validateStep
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Show loading toast
      const loadingToast = toast.loading("Creating your account...");

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

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success("Registration successful! Please verify your email.");

        // Show success message and redirect after delay
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    
    try {
      const loadingToast = toast.loading('Signing in with Google...');
      
      // Use Firebase client SDK directly
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log("Google sign in successful:", user);
      
      // Notify backend about the sign-in to create/update user
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/verify-google-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store the UID in localStorage for persistence
        localStorage.setItem('uid', user.uid);
        
        // Update Redux state
        dispatch(setUid(user.uid));
        
        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success("Google login successful!");
        
        // Navigate to plans page
        setTimeout(() => {
          navigate("/plans");
        }, 300);
      } else {
        throw new Error(data.message || "Failed to verify Google user");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      let errorMessage = "An error occurred. Please try again.";
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in was canceled.";
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = "An account already exists with the same email address but different sign-in credentials.";
      } else if (error.code === 'auth/auth-domain-config-required') {
        errorMessage = "Firebase authentication domain is not properly configured.";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex justify-center mb-6">
              <Mail className="h-16 w-16 text-blue-400" />
            </div>
            <h2 className="text-xl text-center font-semibold text-white mb-4">Let&apos;s start with your email</h2>
            <div className="flex flex-col">
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-slate-800/70 w-full text-white border-slate-600 focus:border-blue-500"
                placeholder="youremail@example.com"
                autoFocus
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex justify-center mb-6">
              <Lock className="h-16 w-16 text-blue-400" />
            </div>
            <h2 className="text-xl text-center font-semibold text-white mb-4">Create a secure password</h2>
            <div className="flex flex-col">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-slate-800/70 w-full text-white border-slate-600 focus:border-blue-500"
                placeholder="********"
                autoFocus
              />
              <p className="text-xs text-slate-400 mt-1">
                Must be at least 6 characters long
              </p>
            </div>

            <div className="flex flex-col">
              <Label htmlFor="cpassword" className="text-white">Confirm Password</Label>
              <Input
                type="password"
                id="cpassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 bg-slate-800/70 w-full text-white border-slate-600 focus:border-blue-500"
                placeholder="********"
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex justify-center mb-6">
              <User className="h-16 w-16 text-blue-400" />
            </div>
            <h2 className="text-xl text-center font-semibold text-white mb-4">Tell us about yourself</h2>

            <div className="flex flex-col">
              <Label htmlFor="username" className="text-white">Username</Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 bg-slate-800/70 w-full text-white border-slate-600 focus:border-blue-500"
                placeholder="traveler123"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label htmlFor="fname" className="text-white">First Name</Label>
                <Input
                  type="text"
                  id="fname"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  className="mt-1 bg-slate-800/70 w-full text-white border-slate-600 focus:border-blue-500"
                  placeholder="John"
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="lname" className="text-white">Last Name</Label>
                <Input
                  type="text"
                  id="lname"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  className="mt-1 bg-slate-800/70 w-full text-white border-slate-600 focus:border-blue-500"
                  placeholder="Doe"
                />
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex justify-center mb-6">
              <UserCircle className="h-16 w-16 text-blue-400" />
            </div>
            <h2 className="text-xl text-center font-semibold text-white mb-4">Final details</h2>

            <div className="flex flex-col">
              <Label htmlFor="age" className="text-white">Age</Label>
              <Input
                type="number"
                id="age"
                min="13"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="mt-1 bg-slate-800/70 w-full text-white border-slate-600 focus:border-blue-500"
                placeholder="25"
                autoFocus
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="gender" className="text-white">Gender</Label>
              <Select
                value={gender}
                onValueChange={(value) => setGender(value)}
                disabled={isLoading}
              >
                <SelectTrigger className="mt-1 w-full bg-slate-800/70 text-white border-slate-600">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 text-white border border-slate-700">
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900">
      <Navbar />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#fff',
          },
          success: {
            icon: '🎉',
          },
          error: {
            icon: '⚠️',
          }
        }}
      />

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="bg-slate-900/70 backdrop-blur-sm rounded-lg shadow-xl p-8 max-w-md w-full border border-slate-800/50">

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress
              value={progress}
              className="h-2 bg-slate-700"
              indicatorColor="#3b82f6"  // Use a simple color instead of gradient string
            />
          </div>

          {/* Step content */}
          <div className="min-h-[320px] flex flex-col">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={goToPrevStep}
              disabled={currentStep === 1 || isLoading}
              className="border-slate-700 bg-slate-700 text-white hover:bg-slate-800 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <Button
              type="button"
              onClick={goToNextStep}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : currentStep === totalSteps ? (
                <>
                  Complete <CheckCircle2 className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {/* Sign in link */}
          <p className="text-slate-400 text-center mt-6">
            Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Sign In</Link>
          </p>

          {/* Google Sign-In button */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900/70 text-slate-400">Or sign up with</span>
              </div>
            </div>
            
            <div className="mt-4">
              <button 
                type="button" 
                onClick={handleGoogleSignIn}
                disabled={isLoading || isGoogleLoading}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 py-2 rounded-lg transition-colors disabled:opacity-70"
              >
                {isGoogleLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing up...</span>
                  </>
                ) : (
                  <>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="Google" className="w-5 h-5" />
                    Sign up with Google
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;