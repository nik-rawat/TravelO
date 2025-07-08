/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios"; // Import Axios
import Navbar from "../components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Heart } from "lucide-react"; // Import Heart and MessageSquare icons
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast'; // Import Toaster and toast

// Utility to truncate text
const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
};

// Skeleton Loader Component for Review Cards
const ReviewCardSkeleton = () => (
  <div className="group hover:shadow-xl transition-all duration-300 border-slate-200/20 bg-slate-900/50 backdrop-blur-sm rounded-lg p-6">
    <div className="animate-pulse">
      {/* Title Placeholder */}
      <div className="h-6 bg-slate-700 rounded w-3/4 mb-4"></div>
      {/* Description Placeholder */}
      <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-slate-700 rounded w-5/6 mb-4"></div>
      {/* Stars Placeholder */}
      <div className="flex items-center mt-2 space-x-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-slate-700 rounded-full"></div>
        ))}
      </div>
      {/* Footer Placeholder (Rating, Likes) */}
      <div className="flex justify-between items-center mt-4">
        <div className="h-4 bg-slate-700 rounded w-1/4"></div>
        <div className="h-6 bg-slate-700 rounded-full w-8"></div>
      </div>
    </div>
  </div>
);

// Modal Component for Full Review
const FullReviewModal = ({ review, onClose }) => {
  if (!review) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-900/90 border border-slate-200/20 rounded-lg p-6 max-w-2xl w-full mx-auto relative shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-slate-300 text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-white mb-2">{review.name}</h2>
        <p className="text-slate-300 mb-4">{review.review}</p>
        <div className="flex items-center mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${i < review.rating ? "text-yellow-400" : "text-slate-500"}`}
              fill={i < review.rating ? "currentColor" : "none"}
            />
          ))}
          <span className="ml-2 text-slate-400 text-sm">({review.rating} / 5)</span>
        </div>
        <div className="flex items-center mt-4 space-x-4 text-slate-400">
          <div className="flex items-center">
            <Heart className="w-5 h-5 mr-1" />
            <span>{review.likes || 0} Likes</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


const Reviews = () => {
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState({}); // State to manage likes for each review
  const [selectedReview, setSelectedReview] = useState(null); // State for modal review
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const REVIEW_MAX_LENGTH = 150; // Max length before truncating

  useEffect(() => {
    // Initialize likes from fetched data or default to 0
    const initializeLikes = (data) => {
      const initialLikes = {};
      data.forEach((review, index) => {
        initialLikes[index] = review.initialLikes || 0; // Use a dummy initialLikes if available
      });
      setLikes(initialLikes);
    };

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/getReviews`);
        
        if (Array.isArray(response.data.data)) {
          setReviewsData(response.data.data);
          initializeLikes(response.data.data); // Initialize likes after fetching
        } else {
          throw new Error("API response is not an array or is empty.");
        }
      } catch (error) {
        console.error("Error fetching reviews data:", error);
        setError("Failed to load reviews. Please try again later.");
        toast.error("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleLike = (index) => {
    // In a real app, you'd send this to your backend
    setLikes(prevLikes => {
      const newLikes = { ...prevLikes };
      // Simulate toggling like
      if (newLikes[index] === undefined || newLikes[index] === 0) {
        newLikes[index] = 1; // User liked
        toast.success("Review liked!");
      } else {
        newLikes[index] = 0; // User unliked
        toast.success("Review unliked!");
      }
      return newLikes;
    });
  };

  const handleShowMore = (review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedReview(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} toastOptions={{
        className: 'bg-slate-800 text-white',
      }} />

      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">What Our Travelers Say</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Read reviews from our satisfied travelers and discover why they love our travel experiences.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Render 3 skeleton cards while loading */}
            {[...Array(3)].map((_, i) => <ReviewCardSkeleton key={i} />)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviewsData.map((review, index) => {
              const isTruncated = review.review.length > REVIEW_MAX_LENGTH;
              const displayReview = isTruncated
                ? truncateText(review.review, REVIEW_MAX_LENGTH)
                : review.review;

              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 border-slate-200/20 bg-slate-900/50 backdrop-blur-sm"
                >
                  <CardHeader>
                    <CardTitle className="text-xl text-white">{review.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-400">
                      {displayReview}
                      {isTruncated && (
                        <button
                          onClick={() => handleShowMore(review)}
                          className="text-blue-400 hover:underline ml-1"
                        >
                          Show More
                        </button>
                      )}
                    </CardDescription>
                    <div className="flex items-center mt-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-slate-400"}`}
                          fill={i < review.rating ? "currentColor" : "none"} // Fill star if rated
                        />
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <span className="text-slate-400">Rating: {review.rating} / 5</span>
                    <button
                      onClick={() => handleLike(index)}
                      className="flex items-center text-slate-400 hover:text-red-500 transition-colors duration-200"
                      title={likes[index] === 1 ? "Unlike" : "Like"}
                    >
                      <Heart
                        className={`w-5 h-5 mr-1 ${likes[index] === 1 ? "text-red-500 fill-red-500" : ""}`}
                      />
                      <span>{likes[index] || 0}</span> {/* Display like count */}
                    </button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Review Modal */}
      {showModal && <FullReviewModal review={selectedReview} onClose={handleCloseModal} />}
    </div>
  );
};

export default Reviews;
