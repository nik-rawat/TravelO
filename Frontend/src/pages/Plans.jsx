import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Add this import
import Navbar from "../components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Add Input import
import { 
  Calendar, 
  MapPin, 
  Users, 
  Plane, 
  Waves, 
  Mountain,
  Church,
  TreePalm,
  Building2,
  Train,
  Sailboat,
  Trees,
  Shell,
  Castle,
  Landmark,
  Coffee,
  PawPrint,
  MapPin as Ghat, // Reusing MapPin for Ghat
  LandPlot,
  CloudRain,
  Building,
  Tent,
  Rabbit,
  Snowflake,
  Library,
  TrainTrack as Bridge,
  Fence,
  Search, // Add Search icon
  X // Add X icon for clearing filters
} from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Toaster, toast } from 'react-hot-toast'; // Using react-hot-toast for consistency and simpler usage

// Comprehensive icon mapping object for all plan icons
const iconMap = {
  // Basic icons from previous mapping
  Calendar: Calendar,
  MapPin: MapPin,
  Users: Users,
  Plane: Plane,

  // New icons from plans data
  Rafting: Waves,
  Temple: Church,
  Beach: TreePalm,
  Palace: Building2,
  Mountains: Mountain,
  Train: Train,
  Lake: Sailboat,
  Forest: Trees,
  Island: Shell,
  Fort: Castle,
  Ruins: Landmark,
  Coffee: Coffee,
  Tiger: PawPrint,
  Hills: Mountain, // Using Mountain for Hills
  Ghat: Ghat,
  Tea: Coffee, // Reusing Coffee icon for Tea
  Desert: LandPlot,
  Clouds: CloudRain,
  French: Building, 
  Trek: Tent,
  Shore: Waves, // Reusing Waves for Shore
  Bridge: Bridge,
  Rhino: Rabbit, // Using Rabbit for Rhino
  Snow: Snowflake,
  Caves: Library,
  Monastery: Fence
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
  const navigate = useNavigate(); // Add navigation hook
  const [plansData, setPlansData] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [availableFilters, setAvailableFilters] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/getPlans`);
        const plans = response.data.data;
        setPlansData(plans);
        setFilteredPlans(plans);
        
        // Extract unique badges for filters
        const uniqueBadges = [...new Set(plans.map(plan => plan.badge))];
        setAvailableFilters(["All", ...uniqueBadges]);
      } catch (error) {
        setError(error.message);
        toast.error("Failed to fetch plans. Please try again later."); // Toast for fetch error
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = plansData;

    // Apply badge filter
    if (selectedFilter !== "All") {
      filtered = filtered.filter(plan => plan.badge === selectedFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(plan => 
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPlans(filtered);
  }, [searchTerm, selectedFilter, plansData]);

  const getIconComponent = (iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="w-8 h-8 text-blue-400" /> : <Mountain className="w-8 h-8 text-blue-400" />;
  };

  const handleAddItinerary = async (planId) => {
    // Check if user is logged in
    if (!uid) {
      toast.error("Please login first to add itinerary");
      setTimeout(() => {
        navigate('/login');
      }, 1500); // Navigate to login after 1.5 seconds
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/add-itinerary`, {
        // use uid from Redux state
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

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedFilter("All");
  };

  const getBadgeColor = (badge) => {
    const colors = {
      "Adventure": "bg-red-500/20 text-red-400 border-red-500/30",
      "Spiritual": "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "Nature": "bg-green-500/20 text-green-400 border-green-500/30",
      "Cultural": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "Historical": "bg-amber-500/20 text-amber-400 border-amber-500/30",
      "Relaxation": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "Wildlife": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      "Beach": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      "Mountain": "bg-slate-500/20 text-slate-400 border-slate-500/30",
      "Desert": "bg-orange-500/20 text-orange-400 border-orange-500/30"
    };
    return colors[badge] || "bg-blue-500/20 text-blue-400 border-blue-500/30";
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

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <Input
              type="text"
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter Badges */}
          <div className="flex flex-wrap justify-center gap-2">
            {availableFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  selectedFilter === filter
                    ? filter === "All" 
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-lg shadow-blue-500/20"
                      : `${getBadgeColor(filter)} shadow-lg`
                    : "bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-700/50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || selectedFilter !== "All") && (
            <div className="flex justify-center">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            </div>
          )}

          {/* Results Counter */}
          <div className="text-center text-slate-400 text-sm">
            {filteredPlans.length} {filteredPlans.length === 1 ? 'plan' : 'plans'} found
          </div>
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
        ) : filteredPlans.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-slate-400">
              <Search className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <h3 className="text-xl font-semibold mb-2">No plans found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlans.map((plan, index) => {
              return (
                <motion.div
                  key={plan.planId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 backdrop-blur-sm h-full overflow-hidden">
                    <CardHeader className="p-6 pb-2">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                          {getIconComponent(plan.icon)}
                        </div>
                        <div className={`font-medium text-sm px-3 py-1 rounded-full border ${getBadgeColor(plan.badge)}`}>
                          {plan.badge}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="px-6 pb-0">
                      <CardTitle className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                        {plan.title}
                      </CardTitle>
                      <CardDescription className="text-slate-400 mb-5 line-clamp-3">
                        {plan.description}
                      </CardDescription>
                      
                      {/* Details Section */}
                      <div className="mb-4 bg-slate-800/30 rounded-lg p-4 border border-slate-800/50">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium text-blue-300">Details</span>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-slate-300 gap-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <span>{plan.duration}</span>
                            <MapPin className="w-4 h-4 text-blue-400 ml-2" />
                            <span>{plan.location}</span>
                          </div>
                          
                          {plan.features?.slice(0, 2).map((feature, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                              <span className="text-slate-300 truncate">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between items-center pt-3 border-t border-slate-800 p-6 mt-auto">
                      <div className="text-white">
                        <span className="text-2xl font-bold">₹{plan.price}</span>
                        <span className="text-slate-400 text-sm ml-1">/ person</span>
                      </div>
                      
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                        size="sm"
                        onClick={() => handleAddItinerary(plan.planId)}
                      >
                        Add Now
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Plans;
