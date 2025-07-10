import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-500 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <h2 className="text-xl font-medium text-blue-400">Loading your travel plans...</h2>
          <p className="text-slate-400 mt-2">Please wait while we prepare your experience</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;