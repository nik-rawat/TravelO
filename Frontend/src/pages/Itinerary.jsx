import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const LoadingSpinner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center p-8"
  >
    <motion.div
      animate={{
        rotate: 360,
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <Loader className="w-12 h-12 text-blue-500" />
    </motion.div>
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-4 text-white text-lg"
    >
      Loading your itineraries...
    </motion.p>
  </motion.div>
);

const ErrorMessage = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mx-auto max-w-md"
  >
    <motion.p className="text-red-500 text-lg font-semibold">{message}</motion.p>
  </motion.div>
);

const ItineraryCard = ({ plan, detailedPlans, buttonActions }) => (
  <motion.div
    className="bg-slate-900/50 backdrop-blur-sm border-slate-200/20 p-4 rounded-lg shadow-md"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <CardHeader>
      <CardTitle className="text-xl text-white">{detailedPlans[plan.planId]?.title || "Loading..."}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-slate-400">{detailedPlans[plan.planId]?.description || "Loading..."}</p>
    </CardContent>
    <CardFooter className="flex justify-between gap-4">{buttonActions(plan)}</CardFooter>
  </motion.div>
);

const ItineraryList = () => {
  const [itineraryData, setItineraryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailedPlans, setDetailedPlans] = useState({});
  const [personCounts, setPersonCounts] = useState({}); 
  const [durations, setDurations] = useState({});
  const [scheduleDates, setScheduleDates] = useState({});
  const uid = useSelector((state) => state.auth.uid);

  useEffect(() => {
    const fetchItineraryData = async () => {
      try {
        const response = await axios.get(`https://travel-o-backend.vercel.app/api/getItinerary/${uid}`);
        if (response.status === 200) {
          setItineraryData(response.data.data);
          fetchDetailedPlans(response.data.data);
        }
      } catch (err) {
        setError("Error fetching itinerary data");
      } finally {
        setLoading(false);
      }
    };

    if (uid) {
      fetchItineraryData();
    }
  }, [uid]);

  const fetchDetailedPlans = async (plans) => {
    const detailedPlansData = {};
    for (const plan of plans) {
      try {
        const response = await axios.get(`https://travel-o-backend.vercel.app/api/getPlan/${plan.planId}`);
        detailedPlansData[plan.planId] = response.data.data;
      } catch (err) {
        console.error(`Error fetching detailed plan data for planId ${plan.planId}:`, err);
      }
    }
    setDetailedPlans(detailedPlansData);
  };

  const handleCompleteItinerary = (planId) => {
    console.log(`Completing itinerary: ${planId}`);
    // Implement logic to mark the itinerary as completed
  };

  const handleGiveReview = (planId) => {
    console.log(`Giving review for planId: ${planId}`);
    // Implement logic to open review form
  };

  const handleBook = (planId) => {
    console.log(`Booking itinerary: ${planId}`);
    // Implement booking logic here
  };

  const handleRemovePlan = (planId) => {
    console.log(`Removing planId: ${planId}`);
    // Implement removal logic here
  };

  const categorizedPlans = {
    selected: itineraryData.filter((plan) => plan.status === "selected"),
    ongoing: itineraryData.filter((plan) => plan.status === "ongoing"),
    previous: itineraryData.filter((plan) => plan.status === "completed"),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900">
      <Navbar />
      <div className="container mx-auto py-16 px-4">
        <motion.h1 className="text-4xl font-bold text-white mb-8 text-center">Your Itineraries</motion.h1>
        <AnimatePresence>
          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}
        </AnimatePresence>

        {["selected", "ongoing", "previous"].map((category) => (
          <div key={category} className="mb-12">
            <motion.h2 className="text-2xl text-white mb-4 capitalize">{category} itineraries</motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categorizedPlans[category].map((plan, index) => (
                <ItineraryCard
                  key={plan.planId}
                  className="bg-slate-900/50 backdrop-blur-sm border-slate-200/20 shadow-md rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  plan={plan}
                  detailedPlans={detailedPlans}
                  buttonActions={(currentPlan) =>
                    category === "selected" ? (
                      <>
                        <div className="flex flex-col gap-4 mt-4">
                          <div className="flex items-center gap-4">
                            <span className="text-white">Persons:</span>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => handlePersonCount(currentPlan.planId, false)}
                                className="h-8 w-8 rounded-full bg-gray-700 hover:bg-gray-600"
                              >
                                -
                              </Button>
                              <motion.span
                                key={personCounts[currentPlan.planId]}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="text-white"
                              >
                                {personCounts[currentPlan.planId] || 1}
                              </motion.span>
                              <Button
                                onClick={() => handlePersonCount(currentPlan.planId, true)}
                                className="h-8 w-8 rounded-full bg-gray-700 hover:bg-gray-600"
                                disabled={(personCounts[currentPlan.planId] || 1) >= (detailedPlans[currentPlan.planId]?.maxGroup || 1)}
                              >
                                +
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-white">Duration (days):</span>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => handleDuration(currentPlan.planId, false)}
                                className="h-8 w-8 rounded-full bg-gray-700 hover:bg-gray-600"
                              >
                                -
                              </Button>
                              <motion.span
                                key={durations[currentPlan.planId]}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="text-white"
                              >
                                {durations[currentPlan.planId] || 1}
                              </motion.span>
                              <Button
                                onClick={() => handleDuration(currentPlan.planId, true)}
                                className="h-8 w-8 rounded-full bg-gray-700 hover:bg-gray-600"
                              >
                                +
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal text-gray-800"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {scheduleDates[currentPlan.planId]
                                    ? format(scheduleDates[currentPlan.planId], "PPP")
                                    : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={scheduleDates[currentPlan.planId]}
                                  onSelect={(date) => handleDateSelect(currentPlan.planId, date)}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="flex justify-between gap-4">
                            <Button
                              className="w-1/2 bg-red-500 hover:bg-red-600"
                              onClick={() => handleRemovePlan(currentPlan.planId)}
                            >
                              Remove
                            </Button>
                            <Button
                              className="w-1/2 bg-green-500 hover:bg-green-600"
                              onClick={() => handleBook(currentPlan.planId)}
                            >
                              Book
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : category === "ongoing" ? (
                      <Button className="bg-blue-500" onClick={() => handleCompleteItinerary(currentPlan.planId)}>
                        Complete Itinerary
                      </Button>
                    ) : (
                      <Button className="bg-yellow-800" onClick={() => handleGiveReview(currentPlan.planId)}>
                        Give Review
                      </Button>
                    )
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryList;
