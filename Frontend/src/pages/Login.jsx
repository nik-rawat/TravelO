import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setUid } from "@/redux/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, LogIn } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { auth, provider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Show loading toast manually
      const loadingToast = toast.loading('Logging in...');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      // Parse response once
      const data = await response.json();
      
      if (response.ok) {
        const uid = data.data;
        console.log("Login successful. UID:", uid);
        
        // Store the UID in localStorage for persistence
        localStorage.setItem('uid', uid);
        
        // Update Redux state
        dispatch(setUid(uid));
        
        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success("Login successful!");
        
        // Add a small delay before navigating
        setTimeout(() => {
          navigate("/plans");
        }, 300);
      } else {
        // Show error message
        toast.dismiss(loadingToast);
        toast.error(data.message || "Login failed");
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred. Please try again.");
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!forgotEmail) {
      toast.error("Please enter your email address");
      return;
    }
    
    try {
      const resetPromise = fetch(`${import.meta.env.VITE_API_BASE_URL}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotEmail }),
      });
      
      toast.promise(resetPromise, {
        loading: 'Sending reset link...',
        success: async (response) => {
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Password reset failed");
          }
          
          setIsModalOpen(false);
          return "Password reset email sent!";
        },
        error: (err) => {
          return err.message || "Failed to send reset link";
        },
      });
    } catch (error) {
      console.error("Error during forgot password:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsGoogleLoading(true);
    
    try {
      const loadingToast = toast.loading('Signing in with Google...');
      
      // Use Firebase client SDK directly
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log("Google sign in successful:", user);
      
      // Now notify your backend about the sign-in to create/update user in your database
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
      }
      
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsGoogleLoading(false);
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
        }}
      />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900/70 backdrop-blur-sm rounded-lg shadow-xl p-8 max-w-md w-full border border-slate-800/50"
        >
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-blue-500/10 p-3">
              <LogIn className="h-10 w-10 text-blue-400" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white text-center mb-6">Welcome Back</h1>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4 text-center"
            >
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                Email
              </Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800/70 w-full text-white border-slate-600 focus:border-blue-500"
                placeholder="youremail@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-white flex items-center gap-2">
                  <Lock className="h-4 w-4 text-slate-400" />
                  Password
                </Label>
                <button
                  type="button"
                  className="text-blue-400 text-sm hover:underline focus:outline-none"
                  onClick={() => setIsModalOpen(true)}
                >
                  Forgot password?
                </button>
              </div>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800/70 w-full text-white border-slate-600 focus:border-blue-500"
                placeholder="********"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 rounded-lg mt-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900/70 text-slate-400">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                type="button" 
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 py-2 rounded-lg transition-colors"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="Google" className="w-5 h-5" />
                    Google
                  </>
                )}
              </button>
            </div>
          </div>
          
          <p className="text-slate-400 text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", bounce: 0.2 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-bl from-slate-800 to-slate-950 text-white p-8 rounded-lg shadow-xl max-w-md w-full border border-slate-700"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-400" /> Reset Password
              </h2>
              <p className="text-slate-300 text-sm mb-6">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
              
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="forgot-email" className="text-white">Email</Label>
                  <Input
                    type="email"
                    id="forgot-email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="mt-1 bg-slate-800/50 text-white border-slate-600 focus:border-blue-500"
                    placeholder="youremail@example.com"
                    required
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    Send Reset Link
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;