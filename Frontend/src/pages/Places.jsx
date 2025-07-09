import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from 'react-redux';
import { Input } from "@/components/ui/input";

import {
  Mountain, 
  Globe, 
  Landmark, 
  Waves, 
  Castle, 
  Shell, 
  TreePalm,
  Trees, 
  Building2,
  TrainTrack,
  Fence,
  Church,
  Train,
  Sailboat,
  Coffee,
  PawPrint,
  MapPin,
  LandPlot,
  CloudRain,
  Building, 
  Tent,
  Rabbit,
  Snowflake,
  Library,
  User,
  Search,
  X
} from "lucide-react";
import {
  Card, CardDescription, CardFooter, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';

// Icon mapping
const iconMap = {
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
  Hills: Trees,
  Ghat: MapPin,
  Tea: Coffee,
  Desert: LandPlot,
  Clouds: CloudRain,
  French: Building, 
  Trek: Tent,
  Shore: Waves,
  Bridge: TrainTrack,
  Rhino: Rabbit,
  Snow: Snowflake,
  Caves: Library,
  Monastery: Fence,
};

// Skeleton loader for cards
const PlaceCardSkeleton = () => (
  <div className="group hover:shadow-xl transition-all duration-300 border-slate-200/20 bg-slate-900/50 backdrop-blur-sm rounded-lg p-6">
    <div className="animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-700 rounded-lg h-12 w-12"></div>
        <div className="h-6 bg-slate-700 rounded w-20"></div>
      </div>
      <div className="h-6 bg-slate-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-700 rounded w-full mb-4"></div>
      <div className="h-4 bg-slate-700 rounded w-5/6 mb-6"></div>
      <div className="h-5 bg-slate-700 rounded w-1/3 mb-3"></div>
      <ul className="space-y-2">
        {[...Array(2)].map((_, i) => (
          <li key={i} className="h-4 bg-slate-700 rounded w-full"></li>
        ))}
      </ul>
      <div className="h-5 bg-slate-700 rounded w-1/3 mt-4 mb-3"></div>
      <div className="space-y-2">
        {[...Array(1)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
            <div className="flex-1 space-y-1">
              <div className="h-4 bg-slate-700 rounded w-4/5"></div>
              <div className="h-3 bg-slate-700 rounded w-2/5"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end items-center mt-6">
        <div className="h-10 bg-slate-700 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

const Places = () => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [placeStats, setPlaceStats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [availableFilters, setAvailableFilters] = useState([]);

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placePlans, setPlacePlans] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [planReviews, setPlanReviews] = useState({});
  const [modalLoading, setModalLoading] = useState(false);
  const [addingPlans, setAddingPlans] = useState({});

  const uid = useSelector((state) => state.auth.uid);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaces = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/getPlaces`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const placesData = data.data;
        
        setPlaces(placesData);
        setFilteredPlaces(placesData);
        
        // Extract unique badges for filters
        const uniqueBadges = [...new Set(placesData.map(place => place.badge))];
        setAvailableFilters(["All", ...uniqueBadges]);
        
        // Fetch plan counts and review counts for each place
        await fetchPlaceStats(placesData);
      } catch (error) {
        console.error('Error fetching places data:', error);
        setError('Failed to fetch places. Please try again later.');
        toast.error("Failed to fetch places. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = places;

    // Apply badge filter
    if (selectedFilter !== "All") {
      filtered = filtered.filter(place => place.badge === selectedFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(place => 
        place.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPlaces(filtered);
  }, [searchTerm, selectedFilter, places]);

  const fetchPlaceStats = async (placesData) => {
    const stats = {};
    
    try {
      await Promise.all(
        placesData.map(async (place) => {
          try {
            // Fetch plans for this place
            const plansResponse = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/api/getPlansFromPlace/${place.placeId}`
            );
            const plansData = await plansResponse.json();
            const plans = plansData.data || [];
            
            // Count total reviews across all plans for this place
            let totalReviews = 0;
            const featuredPlans = [];
            
            await Promise.all(
              plans.map(async (plan) => {
                try {
                  const reviewsResponse = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/getPlanReviews/${plan.planId}`
                  );
                  const reviewsData = await reviewsResponse.json();
                  const reviews = reviewsData.data || [];
                  totalReviews += reviews.length;
                  
                  // Add plan to featured plans with review count
                  featuredPlans.push({
                    ...plan,
                    reviewCount: reviews.length
                  });
                } catch (reviewError) {
                  console.error(`Error fetching reviews for plan ${plan.planId}:`, reviewError);
                }
              })
            );
            
            stats[place.placeId] = {
              planCount: plans.length,
              reviewCount: totalReviews,
              featuredPlans: featuredPlans.slice(0, 2) // Show top 2 plans
            };
          } catch (placeError) {
            console.error(`Error fetching stats for place ${place.placeId}:`, placeError);
            stats[place.placeId] = {
              planCount: 0,
              reviewCount: 0,
              featuredPlans: []
            };
          }
        })
      );
      
      setPlaceStats(stats);
    } catch (error) {
      console.error('Error fetching place stats:', error);
    }
  };

  const getIconComponent = (iconName) => {
    const IconComponent = iconMap[iconName] || Globe;
    return <IconComponent className="w-8 h-8 text-green-400" />;
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
      "Desert": "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "Urban": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
      "Tropical": "bg-teal-500/20 text-teal-400 border-teal-500/30"
    };
    return colors[badge] || "bg-green-500/20 text-green-400 border-green-500/30";
  };

  const openPlansModal = async (place) => {
    setSelectedPlace(place);
    setModalVisible(true);
    setModalLoading(true);
    setPlacePlans([]);
    setPlanReviews({});
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/getPlansFromPlace/${place.placeId}`);
      const data = await res.json();
      setPlacePlans(data.data || []);

      const reviewsMap = {};
      await Promise.all(
        (data.data || []).map(async (plan) => {
          try {
            const r = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/getPlanReviews/${plan.planId}`);
            const reviewData = await r.json();
            reviewsMap[plan.planId] = reviewData.data || [];
          } catch (reviewError) {
            console.error(`Error fetching reviews for plan ${plan.planId}:`, reviewError);
            reviewsMap[plan.planId] = [];
          }
        })
      );
      setPlanReviews(reviewsMap);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch plans or reviews.");
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPlace(null);
    setPlacePlans([]);
    setPlanReviews({});
  };

  const handleAddItinerary = async (planId) => {
    if (!uid) {
      toast.error("Please login first to add plan to itinerary");
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }

    setAddingPlans(prev => ({ ...prev, [planId]: true }));
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/add-itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          planId,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success("Plan added to your itinerary!");
      } else {
        throw new Error(data.error || "Failed to add plan to itinerary");
      }
    } catch (error) {
      console.error("Error adding plan to itinerary:", error);
      toast.error(error.message || "Error adding plan to itinerary");
    } finally {
      setAddingPlans(prev => ({ ...prev, [planId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} toastOptions={{
        className: 'bg-slate-800 text-white',
      }} />
      <div className="container mx-auto py-20 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Explore Amazing Places</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Discover unique travel experiences and plan your next adventure.
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
              placeholder="Search places..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:ring-green-500 focus:border-green-500"
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
                      ? "bg-green-500/20 text-green-400 border-green-500/30 shadow-lg shadow-green-500/20"
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
            {filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'} found
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <PlaceCardSkeleton key={i} />)}
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
        ) : filteredPlaces.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-slate-400">
              <Search className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <h3 className="text-xl font-semibold mb-2">No places found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlaces.map((place, index) => {
              const stats = placeStats[place.placeId] || { planCount: 0, reviewCount: 0, featuredPlans: [] };
              
              return (
                <motion.div
                  key={place.placeId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 backdrop-blur-sm h-full overflow-hidden">
                    <CardHeader className="p-6 pb-2">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-green-500/20 rounded-lg">
                          {getIconComponent(place.icon)}
                        </div>
                        <Badge variant="secondary" className={`font-medium border ${getBadgeColor(place.badge)}`}>
                          {place.badge}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="px-6 pb-0">
                      <CardTitle className="text-xl font-bold text-white mb-3 group-hover:text-green-300 transition-colors">
                        {place.title}
                      </CardTitle>
                      <CardDescription className="text-slate-400 mb-5 line-clamp-3">
                        {place.description}
                      </CardDescription>
                      
                      {/* Featured Plans Section */}
                      <div className="mb-4 bg-slate-800/30 rounded-lg p-4 border border-slate-800/50">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium text-green-300">Featured Plans</span>
                          <div className="text-xs text-slate-300 border border-slate-700 bg-slate-800/50 px-2 py-0.5 rounded-full">
                            {stats.planCount} {stats.planCount === 1 ? 'plan' : 'plans'}
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          {stats.featuredPlans.length > 0 ? (
                            stats.featuredPlans.map((plan, i) => (
                              <div key={i} className="flex justify-between items-center p-1.5 hover:bg-slate-800/50 rounded-md transition-colors">
                                <span className="text-slate-300 truncate max-w-[70%]">{plan.title}</span>
                                <div className="bg-blue-500/10 text-blue-300 text-xs px-2 py-0.5 rounded">
                                  ₹{plan.price || 'N/A'}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-slate-400 italic text-center py-2">
                              {stats.planCount === 0 ? 'No plans available' : 'Click to view plans'}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between items-center pt-3 border-t border-slate-800 p-6 mt-auto">
                      <div className="flex items-center">
                        <div className="flex -space-x-2">
                          {[...Array(Math.min(3, stats.reviewCount))].map((_, i) => (
                            <div key={i} className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                              <User className="w-4 h-4 text-green-400" />
                            </div>
                          ))}
                          {stats.reviewCount > 3 && (
                            <div className="w-7 h-7 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                              <span className="text-xs text-green-300">+{stats.reviewCount - 3}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 ml-2">
                          {stats.reviewCount} {stats.reviewCount === 1 ? 'review' : 'reviews'}
                        </span>
                      </div>
                      
                      <Button
                        className="bg-green-500 hover:bg-green-600 text-white transition-colors"
                        size="sm"
                        onClick={() => openPlansModal(place)}
                        disabled={stats.planCount === 0}
                      >
                        {stats.planCount === 0 ? 'No Plans' : 'View Plans'}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal - keeping your existing modal code */}
      {modalVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center px-4 py-10"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-gradient-to-b from-slate-900 to-slate-950 max-w-3xl w-full rounded-xl shadow-2xl overflow-hidden relative"
          >
            {/* Header with place info */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  {selectedPlace && getIconComponent(selectedPlace.icon)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedPlace?.title}</h2>
                  <p className="text-slate-400">{selectedPlace?.badge}</p>
                </div>
              </div>
              <button
                className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-full h-8 w-8 flex items-center justify-center transition-colors"
                onClick={closeModal}
              >
                ×
              </button>
            </div>
            
            {/* Modal content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mb-4"></div>
                  <p className="text-slate-300">Loading plans and reviews...</p>
                </div>
              ) : placePlans.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="p-4 rounded-full bg-slate-800 mb-4">
                    <Globe className="w-10 h-10 text-slate-500" />
                  </div>
                  <p className="text-slate-400">No plans available for this destination yet.</p>
                  <p className="text-sm text-slate-500 mt-2">Check back later for exciting new offers!</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {placePlans.map((plan) => (
                    <div 
                      key={plan.planId} 
                      className="border border-slate-800 rounded-xl p-5 bg-slate-800/30 hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex flex-wrap gap-4 justify-between items-start mb-4">
                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold text-white group-hover:text-green-300 transition-colors">{plan.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30">
                              {plan.duration || '3 Days'}
                            </Badge>
                            <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
                              ₹{plan.price || 'N/A'}
                            </Badge>
                          </div>
                        </div>
                        
                        <Button
                          className={`${
                            addingPlans[plan.planId] 
                              ? "bg-slate-700 text-slate-300" 
                              : "bg-green-500 hover:bg-green-600 text-white"
                          } transition-all`}
                          size="sm"
                          onClick={() => handleAddItinerary(plan.planId)}
                          disabled={addingPlans[plan.planId]}
                        >
                          {addingPlans[plan.planId] ? (
                            <span className="flex items-center">
                              <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent border-slate-300 rounded-full"></span>
                              Adding...
                            </span>
                          ) : (
                            "Add to Itinerary"
                          )}
                        </Button>
                      </div>
                      
                      <p className="text-slate-300 mb-4">{plan.description}</p>
                      
                      {/* Review section with accurate counts */}
                      <div className="mt-5 pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-white font-medium">Reviews</h4>
                          <span className="text-xs text-slate-400">
                            {(planReviews[plan.planId] || []).length} {(planReviews[plan.planId] || []).length === 1 ? 'review' : 'reviews'}
                          </span>
                        </div>
                        
                        {(planReviews[plan.planId] || []).length > 0 ? (
                          <div className="space-y-3">
                            {(planReviews[plan.planId] || []).map((review, idx) => (
                              <div key={idx} className="flex items-start space-x-3 p-3 bg-slate-800/30 rounded-lg">
                                {review.image ? (
                                  <img
                                    src={review.image}
                                    alt={review.name}
                                    className="w-10 h-10 rounded-full object-cover bg-slate-700"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div 
                                  className="w-10 h-10 rounded-full bg-slate-700 text-green-300 flex items-center justify-center"
                                  style={{ display: review.image ? 'none' : 'flex' }}
                                >
                                  <User className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <p className="font-medium text-slate-200">{review.name}</p>
                                    <div className="flex text-yellow-400 text-xs">
                                      {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < (review.rating || 4) ? "text-yellow-400" : "text-slate-600"}>★</span>
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-slate-300 mt-1">{review.review}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 bg-slate-800/20 rounded-lg">
                            <p className="text-slate-500">No reviews yet for this plan</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer with action buttons */}
            <div className="p-4 border-t border-slate-800 bg-slate-900">
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  className="border-slate-700 bg-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white" 
                  onClick={closeModal}
                >
                  Close
                </Button>
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  Compare Plans
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
    </div>
  );
};

export default Places;
