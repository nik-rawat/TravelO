import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Plane, Waves, Mountain, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import the CSS

// Icon mapping object
const iconMap = {
  Mountain: Mountain,
  Calendar: Calendar,
  MapPin: MapPin,
  Users: Users,
  Plane: Plane,
  Waves: Waves,
};

const Plans = () => {
  const uid = useSelector((state) => state.auth.uid);
  const [plansData, setPlansData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get("https://travel-o-backend.vercel.app/api/getPlans");
        setPlansData(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const getIconComponent = (iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="w-8 h-8 text-blue-400" /> : null;
  };

  const handleAddItinerary = async (uid, planId) => {
    try {
      const response = await axios.post("https://travel-o-backend.vercel.app/api/add-itinerary", {
        uid: uid,
        planId: planId,
      });

      if (response.status === 200) {
        toast.success("Itinerary added successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error("Failed to add itinerary. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (err) {
      toast.error("Error adding itinerary. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900">
      <Navbar />
      <ToastContainer /> {/* Add ToastContainer here */}
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Discover Your Perfect Journey</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Choose from our carefully curated travel experiences, each designed to create unforgettable memories
          </p>
        </div>

        {loading && (
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
          {plansData.map((plan, index) => {
            console.log(plan);
            const Icon = plan.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-slate-200/20 bg-slate-900/50 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      {getIconComponent(plan.icon)}
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
                    <span className="text-3xl font-bold">₹{plan.price}</span>
                    <span className="text-slate-400 ml-2">/ person</span>
                  </div>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white" size="lg"
                    onClick={() => handleAddItinerary(uid, plan.planId)}>
                    Add Now
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Plans;