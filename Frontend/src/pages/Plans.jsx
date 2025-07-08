import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Plane, Waves, Mountain } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Toaster, toast } from 'react-hot-toast'; // Using react-hot-toast for consistency and simpler usage

// Icon mapping object
const iconMap = {
  Mountain: Mountain,
  Calendar: Calendar,
  MapPin: MapPin,
  Users: Users,
  Plane: Plane,
  Waves: Waves,
};

// Skeleton Loader Component for Plan Cards
const PlanCardSkeleton = () => (
  <div className="group hover:shadow-xl transition-all duration-300 border-slate-200/20 bg-slate-900/50 backdrop-blur-sm rounded-lg p-6">
    <div className="animate-pulse">
      {/* Icon and Badge Placeholder */}
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-700 rounded-lg h-12 w-12"></div>
        <div className="h-6 bg-slate-700 rounded w-20"></div>
      </div>

      {/* Title Placeholder */}
      <div className="h-6 bg-slate-700 rounded w-3/4 mb-2"></div>
      {/* Description Placeholder */}
      <div className="h-4 bg-slate-700 rounded w-full mb-4"></div>
      <div className="h-4 bg-slate-700 rounded w-5/6 mb-6"></div>

      {/* Details (Duration, Location, Max Group) Placeholder */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="h-4 bg-slate-700 rounded w-1/4"></div>
          <div className="h-4 bg-slate-700 rounded w-1/4"></div>
          <div className="h-4 bg-slate-700 rounded w-1/4"></div>
        </div>
        {/* Features Placeholder */}
        <ul className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <li key={i} className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-slate-700 rounded-full"></div>
              <div className="h-4 bg-slate-700 rounded w-3/5"></div>
            </li>
          ))}
        </ul>
      </div>

      {/* Price and Button Placeholder */}
      <div className="flex justify-between items-center mt-6">
        <div className="h-8 bg-slate-700 rounded w-1/3"></div>
        <div className="h-10 bg-slate-700 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);


const Plans = () => {
  const uid = useSelector((state) => state.auth.uid);
  const [plansData, setPlansData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/getPlans`);
        setPlansData(response.data.data);
      } catch (error) {
        setError(error.message);
        toast.error("Failed to fetch plans. Please try again later."); // Toast for fetch error
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const getIconComponent = (iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="w-8 h-8 text-blue-400" /> : null;
  };

  const handleAddItinerary = async (uid, planId) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/add-itinerary`, {
        uid: uid,
        planId: planId,
      });

      if (response.status === 200) {
        toast.success("Itinerary added successfully!");
      } else {
        // Handle cases where status is not 200 but not an error thrown by axios
        toast.error(response.data.message || "Failed to add itinerary. Please try again.");
      }
    } catch (err) {
      console.error("Error adding itinerary:", err);
      // More specific error message based on common axios error structures
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Error adding itinerary. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900">
      <Navbar />
      {/* Using react-hot-toast's Toaster component */}
      <Toaster position="top-center" reverseOrder={false} toastOptions={{
        className: 'bg-slate-800 text-white',
      }} />
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Discover Your Perfect Journey</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Choose from our carefully curated travel experiences, each designed to create unforgettable memories
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Render 3 skeleton cards while loading */}
            {[...Array(3)].map((_, i) => <PlanCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-red-400 text-center py-8">{error}</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plansData.map((plan, index) => {
              const IconComponent = getIconComponent(plan.icon); // Get the actual component
              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 border-slate-200/20 bg-slate-900/50 backdrop-blur-sm"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-slate-800 rounded-lg">
                        {IconComponent} {/* Render the icon component */}
                      </div>
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
                        {plan.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-white mt-4">{plan.title}</CardTitle>
                    <CardDescription className="text-slate-400">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center text-slate-300 space-x-4">
                        <Calendar className="w-4 h-4" />
                        <span>{plan.duration}</span>
                        <MapPin className="w-4 h-4" />
                        <span>{plan.location}</span>
                        <Users className="w-4 h-4" />
                        <span>Max {plan.maxGroup}</span>
                      </div>
                      <ul className="space-y-2">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="text-slate-300 flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div className="text-white">
                      <span className="text-3xl font-bold">₹{plan.price}</span>
                      <span className="text-slate-400 ml-2">/ person</span>
                    </div>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white" size="lg"
                      onClick={() => handleAddItinerary(uid, plan.planId)}>
                      Add Now
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Plans;
