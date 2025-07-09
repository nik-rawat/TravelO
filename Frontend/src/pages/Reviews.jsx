/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, User, Clock, MapPin } from "lucide-react";
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { useSelector } from "react-redux";
import { format } from "date-fns";

// Skeleton Loader Component for Review Cards
const ReviewCardSkeleton = () => (
  <div className="group hover:shadow-xl transition-all duration-300 border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 backdrop-blur-sm rounded-lg overflow-hidden">
    <div className="animate-pulse">
      {/* Image Placeholder */}
      <div className="w-full h-48 bg-slate-700"></div>
      
      {/* Content Placeholder */}
      <div className="p-5">
        {/* Header Placeholder */}
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-slate-700 rounded w-1/3"></div>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-slate-700 rounded-full"></div>
            ))}
          </div>
        </div>
        
        {/* Review Text Placeholder */}
        <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6 mb-4"></div>
        
        {/* Footer Placeholder */}
        <div className="flex justify-between items-center mt-4">
          <div className="h-4 bg-slate-700 rounded w-1/4"></div>
          <div className="h-6 bg-slate-700 rounded-full w-8"></div>
        </div>
      </div>
    </div>
  </div>
);

const Reviews = () => {
  const [reviewsData, setReviewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState({});
  const [likedReviews, setLikedReviews] = useState(new Set()); // Track which reviews are liked by user
  const uid = useSelector((state) => state.auth.uid);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/getReviews`);
        const responseData = response.data;
        console.log("Response data:", responseData);
        
        if (responseData.status === 200) {
          const reviewsArray = Array.isArray(responseData.data) 
            ? responseData.data 
            : responseData.data?.reviews || [];
          
          console.log("Reviews array:", reviewsArray);
          setReviewsData(reviewsArray);
          
          // Initialize likes state with total like counts
          const initialLikes = {};
          const likedByUser = new Set();
          
          reviewsArray.forEach(review => {
            // Set the actual like count (length of likes array)
            initialLikes[review.reviewId] = review.likes ? review.likes.length : 0;
            
            // Check if current user has liked this review (check if uid is in likes array)
            if (uid && review.likes && review.likes.includes(uid)) {
              likedByUser.add(review.reviewId);
            }
          });
          
          setLikes(initialLikes);
          setLikedReviews(likedByUser);
        } else {
          throw new Error("Failed to fetch reviews");
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        if (err.response) {
          console.error("Response data:", err.response.data);
          console.error("Response status:", err.response.status);
        }
        setError(err.message || "Failed to load reviews. Please try again.");
        toast.error("Failed to load reviews. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [uid]);

  const handleLike = async (reviewId) => {
    if (!uid) {
      toast.error("Please log in to like a review");
      return;
    }

    try {
      const wasLiked = likedReviews.has(reviewId);
      
      // Optimistic UI update
      setLikes(prev => ({
        ...prev,
        [reviewId]: wasLiked ? prev[reviewId] - 1 : prev[reviewId] + 1
      }));

      // Update liked reviews set
      setLikedReviews(prev => {
        const newSet = new Set(prev);
        if (wasLiked) {
          newSet.delete(reviewId);
        } else {
          newSet.add(reviewId);
        }
        return newSet;
      });

      // Make API request to appropriate endpoint
      const apiEndpoint = wasLiked ? '/api/unlike' : '/api/like';
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}${apiEndpoint}`, {
        uid,
        reviewId
      });

      if (response.status === 200) {
        // Show success toast notification
        if (wasLiked) {
          toast.success("Review unliked!", {
            duration: 2000,
            style: {
              background: '#1f2937',
              color: '#f3f4f6',
              border: '1px solid #374151'
            }
          });
        } else {
          toast.success("Review liked!", {
            duration: 2000,
            style: {
              background: '#1f2937',
              color: '#f3f4f6',
              border: '1px solid #374151'
            }
          });
        }
      } else {
        // If the request fails, revert the optimistic update
        setLikes(prev => ({
          ...prev,
          [reviewId]: wasLiked ? prev[reviewId] + 1 : prev[reviewId] - 1
        }));
        
        setLikedReviews(prev => {
          const newSet = new Set(prev);
          if (wasLiked) {
            newSet.add(reviewId);
          } else {
            newSet.delete(reviewId);
          }
          return newSet;
        });
        
        toast.error("Failed to update like status");
      }
    } catch (err) {
      console.error("Error updating like status:", err);
      
      // Revert optimistic update on error
      const wasLiked = likedReviews.has(reviewId);
      setLikes(prev => ({
        ...prev,
        [reviewId]: wasLiked ? prev[reviewId] + 1 : prev[reviewId] - 1
      }));
      
      setLikedReviews(prev => {
        const newSet = new Set(prev);
        if (wasLiked) {
          newSet.add(reviewId);
        } else {
          newSet.delete(reviewId);
        }
        return newSet;
      });
      
      toast.error(err.response?.data?.message || "Failed to update like status");
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900">
      <Navbar />
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          className: 'bg-slate-800 text-white',
          duration: 3000,
        }} 
      />
      
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Traveler Experiences</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Read authentic reviews and see photos from fellow travelers who experienced our curated plans
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <ReviewCardSkeleton key={i} />)}
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
        ) : reviewsData.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-slate-400">
              <Heart className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
              <p>Be the first to share your travel experience!</p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviewsData.map((review, index) => {
              const isLiked = likedReviews.has(review.reviewId);
              const likeCount = likes[review.reviewId] || 0;
              
              return (
                <motion.div
                  key={review.reviewId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 backdrop-blur-sm overflow-hidden h-full flex flex-col">
                    {/* Review Image */}
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={review.image || "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80"}
                        alt={`Travel experience by ${review.name}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <div className="flex text-yellow-400 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? "text-yellow-400" : "text-slate-600"}>★</span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Liked indicator on image */}
                      {isLiked && (
                        <div className="absolute top-3 right-3">
                          <div className="bg-red-500/80 backdrop-blur-sm rounded-full p-1.5">
                            <Heart className="w-4 h-4 text-white fill-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <CardHeader className="p-5 pb-0">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-400" />
                          {review.name}
                        </CardTitle>
                        
                        {/* Liked badge */}
                        {isLiked && (
                          <div className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full border border-red-500/30">
                            Liked
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-5 pt-3 pb-0 flex-grow">
                      <p className="text-slate-300 mb-4">{review.review}</p>
                      <div className="flex items-center text-xs text-slate-400 gap-4 mt-auto">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(review.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Plan #{review.planId.replace('plan', '')}
                        </span>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between items-center pt-3 border-t border-slate-800 p-5 mt-auto">
                      <span className="text-slate-400 text-sm">Rating: {review.rating}/5</span>
                      <button
                        onClick={() => handleLike(review.reviewId)}
                        className={`flex items-center gap-1.5 transition-all duration-200 hover:scale-105 ${
                          isLiked 
                            ? "text-red-500 bg-red-500/10 border border-red-500/30" 
                            : "text-slate-400 hover:text-red-500 hover:bg-red-500/5"
                        } px-3 py-1.5 rounded-full`}
                        title={isLiked ? "Unlike this review" : "Like this review"}
                        disabled={isLoading}
                      >
                        <Heart
                          className={`w-5 h-5 transition-all duration-200 ${
                            isLiked 
                              ? "text-red-500 fill-red-500 scale-110" 
                              : "hover:scale-105"
                          }`}
                        />
                        <span className="text-sm font-medium">
                          {likeCount}
                        </span>
                      </button>
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

export default Reviews;
