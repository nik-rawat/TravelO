import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import {
  Mountain, 
  Globe, 
  Landmark, 
  Waves, 
  Castle, 
  Shell, 
  TreePalm, 
  Trees, 
  LandmarkTower,
  Bridge,
  Mosque,
  Church,
  Train,
  Sailboat,
  Coffee,
  PawPrint,
  TreeDeciduous,
  MapPin,
  LandPlot,
  CloudRain,
  LandmarkIcon,
  TentTree,
  Rabbit,
  Snowflake,
  Library
} from "lucide-react";
import {
  Card, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';

// Icon mapping
const iconMap = {
  Rafting: Waves,
  Temple: Church,
  Beach: TreePalm,
  Palace: LandmarkTower,
  Mountains: Mountain,
  Train: Train,
  Lake: Sailboat,
  Forest: Trees,
  Island: Shell,
  Fort: Castle,
  Ruins: Landmark,
  Coffee: Coffee,
  Tiger: PawPrint,
  Hills: TreeDeciduous,
  Ghat: MapPin,
  Tea: Coffee,
  Desert: LandPlot,
  Clouds: CloudRain,
  French: LandmarkIcon,
  Trek: TentTree,
  Shore: Waves,
  Bridge: Bridge,
  Rhino: Rabbit,
  Snow: Snowflake,
  Caves: Library,
  Monastery: Mosque,
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placePlans, setPlacePlans] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [planReviews, setPlanReviews] = useState({});
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchPlaces = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/getPlaces`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setPlaces(data.data);
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

  const getIconComponent = (iconName) => {
    const IconComponent = iconMap[iconName] || Globe;
    return <IconComponent className="w-8 h-8 text-blue-400" />;
  };

  const openPlansModal = async (place) => {
    setSelectedPlace(place);
    setModalVisible(true);
    setModalLoading(true);
    setPlacePlans([]);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/getPlansFromPlace/${place.placeId}`);
      const data = await res.json();
      setPlacePlans(data.data);

      const reviewsMap = {};
      await Promise.all(data.data.map(async (plan) => {
        const r = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/getPlanReviews/${plan.planId}`);
        const reviewData = await r.json();
        reviewsMap[plan.planId] = reviewData.data;
      }));
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
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <CardFooter className="flex justify-between items-center">
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    size="lg"
                    onClick={() => openPlansModal(place)}
                  >
                    Show Plans
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {modalVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center px-4 py-10"
        >
          <div className="bg-slate-900 max-w-3xl w-full rounded-xl shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl"
              onClick={closeModal}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-white mb-4">{selectedPlace?.title} — Plans</h2>
            {modalLoading ? (
              <p className="text-slate-300">Loading...</p>
            ) : placePlans.length === 0 ? (
              <p className="text-slate-400">No plans available.</p>
            ) : (
              <div className="space-y-6">
                {placePlans.map((plan) => (
                  <div key={plan.planId} className="border border-slate-700 rounded-lg p-4 bg-slate-800/40">
                    <h3 className="text-xl font-semibold text-white">{plan.title}</h3>
                    <p className="text-slate-300">{plan.description}</p>
                    <p className="text-slate-400 mt-2">Price: ₹{plan.price}</p>
                    <div className="mt-4">
                      <h4 className="text-white font-medium mb-2">Reviews:</h4>
                      {planReviews[plan.planId]?.length > 0 ? (
                        <div className="space-y-2">
                          {planReviews[plan.planId].map((review, idx) => (
                            <div key={idx} className="flex items-start space-x-3">
                              <img
                                src={review.photo}
                                alt={review.reviewer}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/12x12/slate/white?text=User"; }}
                              />
                              <div>
                                <p className="text-slate-300">{review.review}</p>
                                <span className="text-slate-400 text-sm">- {review.reviewer}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500">No reviews yet.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Places;
