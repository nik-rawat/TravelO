import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import { Loader, Mountain, Sun, Globe, Landmark, Building, Camera, Waves, Castle, Shell, TreePalm, Trees, Amphora, Hourglass } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';


// Icon mapping object
const iconMap = {
  Mountain: Mountain,
  Sun: Sun,
  Globe: Globe,
  Landmark: Landmark,
  City: Building,
  Camera: Camera,
  Beach: TreePalm,
  Cultural:Amphora,
  Nature:Trees,
  Water:Waves,
  Historical:Castle ,
  Island:Shell,
 
};

const Places = () => {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('https://travel-o-backend.vercel.app/api/getPlaces');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPlaces(data.data);
      } catch (error) {
        console.error('Error fetching places data:', error);
        setError('Failed to fetch places');
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
      <div className="container mx-auto py-20 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Explore Amazing Places</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Discover unique travel experiences and plan your next adventure.
          </p>
        </div>
        {isLoading && (
          <motion.div
            className="loader-container flex flex-col items-center justify-center p-8 rounded-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              <Loader className="w-12 h-12 text-white" />
            </motion.div>
            <motion.p
              className="text-white text-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Loading...
            </motion.p>
          </motion.div>
        )}
        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-red-400 text-center py-8">{error}</p>
          </motion.div>
        )}

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
                      <span className="font-bold">{plan.title}</span>: {plan.description} - {plan.price}
                    </li>
                  ))}
                </ul>
                <h2 className="text-lg text-white mt-4">Reviews:</h2>
                <div className="space-y-2">
                  {place.reviews.map((review, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <img src={review.photo} alt={review.reviewer} className="w-12 h-12 rounded-full" />
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
      </div>
    </div>
  );
};

export default Places;