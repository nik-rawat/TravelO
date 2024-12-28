import Navbar from "../components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Plane, Waves, Mountain } from "lucide-react";

const plansData = [
  {
    title: "Mountain Explorer",
    description: "Summit majestic peaks and discover hidden valleys in this thrilling mountain adventure package.",
    price: "₹24,999",
    duration: "3 days",
    location: "Swiss Alps",
    maxGroup: 8,
    icon: Mountain,
    features: ["Guided Hiking", "Mountain Lodge Stay", "Equipment Rental"],
    badge: "Most Popular"
  },
  {
    title: "Coastal Paradise",
    description: "Experience pristine beaches, crystal-clear waters, and vibrant marine life in this tropical getaway.",
    price: "₹39,999",
    duration: "5 days",
    location: "Maldives",
    maxGroup: 6,
    icon: Waves,
    features: ["Snorkeling", "Beach Villa", "Sunset Cruise"],
    badge: "Luxury"
  },
  {
    title: "Cultural Odyssey",
    description: "Immerse yourself in rich traditions, historic landmarks, and authentic local experiences.",
    price: "₹34,999",
    duration: "4 days",
    location: "Kyoto",
    maxGroup: 10,
    icon: Plane,
    features: ["Temple Tours", "Tea Ceremony", "Local Cuisine"],
    badge: "Educational"
  }
];

const Plans = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900">
      <Navbar />
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Discover Your Perfect Journey</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Choose from our carefully curated travel experiences, each designed to create unforgettable memories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plansData.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-slate-200/20 bg-slate-900/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
                      {plan.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-white mt-4">{plan.title}</CardTitle>
                  <CardDescription className="text-slate-400">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-slate-300 space-x-4">
                      <Calendar className="w-4 h-4" />
                      <span>{plan.duration}</span>
                      <MapPin className="w-4 h-4" />
                      <span>{plan.location}</span>
                      <Users className="w-4 h-4" />
                      <span>Max {plan.maxGroup}</span>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="text-slate-300 flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="text-white">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-slate-400 ml-2">/ person</span>
                  </div>
                  <Button 
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    size="lg"
                  >
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
            )
            })}
        </div>
      </div>
    </div>
  );
};


export default Plans;