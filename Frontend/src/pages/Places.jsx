import Navbar from "../components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mountain, Sun, Globe, Landmark, Building, Camera, TreePalm, History } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";

const placesData = [
  {
    title: "Swiss Alps",
    description: "Experience breathtaking views and thrilling adventures in the Swiss Alps.",
    icon: Mountain,
    badge: "Adventure",
    plans: [
      {
        title: "Mountain Explorer",
        description: "Summit majestic peaks and discover hidden valleys.",
        price: "₹24,999",
        duration: "3 days",
        location: "Swiss Alps",
        maxGroup: 8,
        features: ["Guided Hiking", "Mountain Lodge Stay", "Equipment Rental"],
        badge: "Most Popular",
        image: "https://example.com/swiss-alps.jpg" // Replace with a valid image URL
      },
    ],
    reviews: [
      {
        photo: "https://randomuser.me/api/portraits/men/1.jpg",
        review: "An unforgettable experience! The views were stunning.",
        reviewer: "John Doe"
      },
    ]
  },
  {
    title: "Maldives",
    description: "Relax on pristine beaches and explore vibrant marine life.",
    icon: Sun,
    badge: "Luxury",
    plans: [
      {
        title: "Coastal Paradise",
        description: "Experience pristine beaches and crystal-clear waters.",
        price: "₹49,999",
        duration: "5 days",
        location: "Maldives",
        maxGroup: 6,
        features: ["Snorkeling", "Beach Villa", "Sunset Cruise"],
        badge: "Luxury",
        image: "https://example.com/maldives.jpg" // Replace with a valid image URL
      },
    ],
    reviews: [
      {
        photo: "https://randomuser.me/api/portraits/women/1.jpg",
        review: "A slice of paradise! The sunsets were magical.",
        reviewer: "Jane Smith"
      },
    ]
  },
  {
    title: "Tokyo, Japan",
    description: "Immerse yourself in the vibrant culture and technology of Tokyo.",
    icon: Globe,
    badge: "Cultural",
    plans: [
      {
        title: "Cultural Explorer",
        description: "Visit historic temples and modern skyscrapers.",
        price: "₹64,999",
        duration: "7 days",
        location: "Tokyo",
        maxGroup: 10,
        features: ["Guided City Tours", "Culinary Experiences", "Cultural Workshops"],
        badge: "Cultural",
        image: "https://example.com/tokyo.jpg" // Replace with a valid image URL
      },
    ],
    reviews: [
      {
        photo: "https://randomuser.me/api/portraits/men/2.jpg",
        review: "An amazing blend of tradition and modernity!",
        reviewer: "Akira Tanaka"
      },
    ]
  },
  {
    title: "Santorini, Greece",
    description: "Discover the stunning sunsets and beautiful beaches of Santorini.",
    icon: Landmark,
    badge: "Romantic",
    plans: [
      {
        title: "Island Getaway",
        description: "Relax on beautiful beaches and explore charming villages.",
        price: "₹49,999",
        duration: "4 days",
        location: "Santorini",
        maxGroup: 5,
        features: ["Wine Tasting", "Boat Tours", "Beach Access"],
        badge: "Romantic",
        image: "https://example.com/santorini.jpg" // Replace with a valid image URL
      },
    ],
    reviews: [
      {
        photo: "https://randomuser.me/api/portraits/women/2.jpg",
        review: "The sunsets here are truly magical!",
        reviewer: "Maria Papadopoulos"
      },
    ]
  },
  {
    title: "New York City, USA",
    description: "Experience the hustle and bustle of the Big Apple.",
    icon: Building,
    badge: "Iconic",
    plans: [
      {
        title: "City Adventure",
        description: "Explore iconic landmarks and hidden gems.",
        price: "₹34,999",
        duration: "3 days",
        location: "New York City",
        maxGroup: 12,
        features: ["Broadway Show", "City Tours", "Food Tasting"],
        badge: "Iconic",
        image: "https://example.com/new-york.jpg" // Replace with a valid image URL
      },
    ],
    reviews: [
      {
        photo: "https://randomuser.me/api/portraits/women/3.jpg",
        review: "A city that never sleeps! So much to see and do.",
        reviewer: "Emily Johnson"
      },
    ]
  },
  {
    title: "Cape Town, South Africa",
    description: "Explore the stunning landscapes and rich culture of Cape Town.",
    icon: Camera,
    badge: "Adventure",
    plans: [
      {
        title: "Adventure Awaits",
        description: "Hike Table Mountain and visit the Cape of Good Hope.",
        price: "₹29,999",
        duration: "5 days",
        location: "Cape Town",
        maxGroup: 8,
        features: ["Hiking", "Wine Tours", "Cultural Experiences"],
        badge: "Adventure",
        image: "https://example.com/cape-town.jpg" // Replace with a valid image URL
      },
    ],
    reviews: [
      {
        photo: "https://randomuser.me/api/portraits/women/4.jpg",
        review: "The views from Table Mountain are breathtaking!",
        reviewer: "Thandiwe Nkosi"
      },
    ]
  },
  {
    title: "Bali, Indonesia",
    description: "Experience the tropical paradise of Bali with its beautiful beaches and rich culture.",
    icon: TreePalm,
    badge: "Relaxation",
    plans: [
      {
        title: "Tropical Escape",
        description: "Relax on the beach and explore lush rice terraces.",
        price: "₹54,999",
        duration: "6 days",
        location: "Bali",
        maxGroup: 6,
        features: ["Surfing Lessons", "Cultural Tours", "Spa Treatments"],
        badge: "Relaxation",
        image: "https://example.com/bali.jpg" // Replace with a valid image URL
      },
    ],
    reviews: [
      {
        photo: "https://randomuser.me/api/portraits/women/5.jpg",
        review: "Bali is a dream come true! The culture and scenery are incredible.",
        reviewer: "Siti Rahmawati"
      },
    ]
  },
  {
    title: "Rome, Italy",
    description: "Step back in time and explore the ancient ruins and vibrant culture of Rome.",
    icon: History,
    badge: "Historical",
    plans: [
      {
        title: "Historical Journey",
        description: "Visit the Colosseum, Vatican City, and more.",
        price: "₹59,999",
        duration: "5 days",
        location: "Rome",
        maxGroup: 10,
        features: ["Guided Tours", "Culinary Experiences", "Art Workshops"],
        badge: "Historical",
        image: "https://example.com/rome.jpg" // Replace with a valid image URL
      },
    ],
    reviews: [
      {
        photo: "https://randomuser.me/api/portraits/men/3.jpg",
        review: "A city filled with history and delicious food!",
        reviewer: "Giovanni Rossi"
      },
    ]
  },
];

const url = 'https://travel-o-backend.vercel.app/api/getPlaces';

const Places = () => {
  const [places, setPlaces] = useState(placesData); // Initialize with static data
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(url);
        setPlaces(response.data.data); // Update state with fetched data
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch places');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();

    return () => {
      // Cleanup if necessary
    };
  }, [url]);

  if (isLoading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>{error}</div>; // Error state
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Navbar />
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Explore Amazing Places</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Discover unique travel experiences and plan your next adventure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {places.map((place, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-slate-200/20 bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    <place.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <Badge className="bg-blue-600 text-white rounded-full px-3 py-1 text-sm font-semibold hover:bg-blue-700 transition duration-200">
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
                      <img src={review.photo} alt={review.reviewer} className="w-12 h-12 rounded-full " />
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
                  View More
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