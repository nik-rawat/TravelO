import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import { Camera } from "lucide-react"; // Import Loader for skeleton
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast'; // Import Toaster and toast

// Skeleton Loader Component for Gallery Cards
const GalleryCardSkeleton = () => (
  <div className="group hover:shadow-xl transition-all duration-300 border-slate-200/20 bg-slate-900/50 backdrop-blur-sm rounded-lg p-6">
    <div className="animate-pulse">
      {/* Icon and Badge Placeholder */}
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-700 rounded-lg h-12 w-12"></div>
        <div className="h-6 bg-slate-700 rounded w-20"></div>
      </div>

      {/* Title Placeholder */}
      <div className="h-6 bg-slate-700 rounded w-3/4 mb-4"></div>

      {/* Image Placeholder */}
      <div className="w-full h-48 bg-slate-700 rounded-lg"></div>
    </div>
  </div>
);

const images = [
  { src: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0', alt: 'Beautiful Beach', badge: 'Relaxation' },
  { src: 'https://images.unsplash.com/photo-1566679056462-2075774c8c07', alt: 'Mountain View', badge: 'Adventure' },
  { src: 'https://images.unsplash.com/photo-1734375243068-7f4e161e2ef2', alt: 'City Skyline', badge: 'Urban' },
  { src: 'https://images.unsplash.com/photo-1440581572325-0bea30075d9d', alt: 'Forest Trail', badge: 'Nature' },
  { src: 'https://images.unsplash.com/photo-1596602932647-36c88650de9e', alt: 'Desert Dunes', badge: 'Exotic' },
  { src: 'https://images.unsplash.com/photo-1674805023990-892e2a3fc385', alt: 'Waterfall', badge: 'Scenic' },
  { src: 'https://images.unsplash.com/photo-1660559028457-c350f9b14504', alt: 'Tropical Paradise', badge: 'Tropical' },
  { src: 'https://images.unsplash.com/photo-1580333056384-f499aad2fe8b', alt: 'Historic Ruins', badge: 'Historical' },
  { src: 'https://plus.unsplash.com/premium_photo-1672115680958-54438df0ab82', alt: 'Snowy Mountains', badge: 'Winter' },
  { src: 'https://images.unsplash.com/photo-1734375326077-4c79b0997f13', alt: 'Vibrant City', badge: 'Cultural' },
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    // Simulate fetching data with a delay
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // In a real application, you would fetch images from an API here.
        // For this example, we're just using the static 'images' array.
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        // If there was an actual fetch, you'd handle response.ok and errors here.
        // For demonstration, let's simulate an error sometimes
        // if (Math.random() > 0.8) {
        //   throw new Error("Failed to load gallery images.");
        // }
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading gallery:", err);
        setError("Failed to load gallery images. Please try again.");
        toast.error("Failed to load gallery images. Please try again."); // Toast for fetch error
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleImageClick = (src) => {
    setSelectedImage(src);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} toastOptions={{
        className: 'bg-slate-800 text-white',
      }} />
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Travel Gallery</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Explore stunning destinations and capture unforgettable moments.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Render 8 skeleton cards while loading */}
            {[...Array(8)].map((_, i) => <GalleryCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <motion.div
            className="error-message text-red-400 text-center py-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p>{error}</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {images.map((image, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-slate-200/20 bg-slate-900/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <Camera className="w-8 h-8 text-blue-400" />
                    </div>
                    <Badge className="bg-blue-600 text-white rounded-full px-3 py-1 text-sm font-semibold hover:bg-blue-700 transition duration-200">
                      {image.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-white mt-4">{image.alt}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform transform group-hover:scale-105"
                    onClick={() => handleImageClick(image.src)}
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/slate/white?text=Image+Error"; }} // Fallback for image loading error
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={closeModal}>
            <img src={selectedImage} alt="Selected" className="max-w-full max-h-full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
