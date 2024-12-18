import Navbar from "../components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

const reviewsData = [
  {
    name: "Alice Johnson",
    review: "The Mountain Explorer trip was absolutely breathtaking! The guides were knowledgeable and the views were stunning.",
    rating: 5,
  },
  {
    name: "Mark Smith",
    review: "I had an amazing time in the Coastal Paradise package. The beaches were pristine and the snorkeling was unforgettable!",
    rating: 4,
  },
  {
    name: "Emily Davis",
    review: "The Cultural Odyssey was a fantastic experience. I learned so much about the local culture and history.",
    rating: 5,
  },
  {
    name: "John Doe",
    review: "Great service and well-organized trips. I would definitely recommend this travel planner to my friends!",
    rating: 4,
  },
];

const Reviews = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
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
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-slate-200/20 bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-white">{review.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-400">{review.review}</CardDescription>
                <div className="flex items-center mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-slate-400'}`} />
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