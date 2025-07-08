import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import { Mountain, Sun, Globe, Landmark, Building, Camera, Waves, Castle, Shell, TreePalm, Trees, Amphora } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast'; // Import Toaster and toast from react-hot-toast

// Icon mapping object
const iconMap = {
  Mountain: Mountain,
  Sun: Sun,
  Globe: Globe,
  Landmark: Landmark,
  City: Building,
  Camera: Camera,
  Beach: TreePalm,
  Cultural: Amphora,
  Nature: Trees,
  Water: Waves,
  Historical: Castle,
  Island: Shell,
};

// Skeleton Loader Component for Place Cards
const PlaceCardSkeleton = () => (
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

      {/* Plans Section Placeholder */}
      <div className="h-5 bg-slate-700 rounded w-1/3 mb-3"></div>
      <ul className="space-y-2">
        {[...Array(2)].map((_, i) => (
          <li key={i} className="h-4 bg-slate-700 rounded w-full"></li>
        ))}
      </ul>

      {/* Reviews Section Placeholder */}
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

      {/* Button Placeholder */}
      <div className="flex justify-end items-center mt-6">
        <div className="h-10 bg-slate-700 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);


const Places = () => {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/getPlaces`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPlaces(data.data);
      } catch (error) {
        console.error('Error fetching places data:', error);
        setError('Failed to fetch places. Please try again later.');
        toast.error("Failed to fetch places. Please try again later."); // Toast for fetch error
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  // Function to get icon component
  const getIconComponent = (iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="w-8 h-8 text-blue-400" /> : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900">
      <Navbar />
      {/* Using react-hot-toast's Toaster component */}
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
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Render 3 skeleton cards while loading */}
            {[...Array(3)].map((_, i) => <PlaceCardSkeleton key={i} />)}
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
            {places.map((place, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-slate-200/20 bg-slate-900/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      {getIconComponent(place.icon)}
                    </div>
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
                      {place.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-white mt-4">{place.title}</CardTitle>
                  <CardDescription className="text-slate-400">{place.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <h2 className="text-lg text-white">Plans:</h2>
                  <ul className="space-y-2">
                    {place.plans.map((plan, i) => (
                      <li key={i} className="text-slate-300">
                        <span className="font-bold">{plan.title}</span>: {plan.description} - ₹{plan.price}
                      </li>
                    ))}
                  </ul>
                  <h2 className="text-lg text-white mt-4">Reviews:</h2>
                  <div className="space-y-2">
                    {place.reviews.map((review, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <img
                          src={review.photo}
                          alt={review.reviewer}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/12x12/slate/white?text=User"; }} // Fallback image
                        />
                        <div>
                          <p className="text-slate-300">{review.review}</p>
                          <span className="text-slate-400">- {review.reviewer}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    size="lg"
                  >
                    Show Plans
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Places;
