import { useEffect, useState } from "react";
import axios from "axios"; // Import Axios
import Navbar from "../components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

const Reviews = () => {
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch reviews data from the API using Axios
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/getReviews`);
        console.log("API Response:", response.data.data); // Debugging: Log the API response

        // Ensure the response data is an array
        if (Array.isArray(response.data.data)) {
          setReviewsData(response.data.data);
        } else {
          throw new Error("API response is not an array");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  // Ensure reviewsData is an array before mapping
  if (!Array.isArray(reviewsData)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 flex items-center justify-center text-red-500">
        Error: Invalid data format received from the API
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900">
      <Navbar />
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">What Our Travelers Say</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Read reviews from our satisfied travelers and discover why they love our travel experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviewsData.map((review, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-slate-200/20 bg-slate-900/50 backdrop-blur-sm"
            >
              <CardHeader>
                <CardTitle className="text-xl text-white">{review.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-400">{review.review}</CardDescription>
                <div className="flex items-center mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-slate-400"}`}
                    />
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <span className="text-slate-400">Rating: {review.rating} / 5</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;