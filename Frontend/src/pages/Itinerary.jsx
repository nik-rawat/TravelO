/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
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
  const [amounts, setAmounts] = useState({});
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewDetails, setReviewDetails] = useState({
    image: null,
    name: '',
    rating: '',
    review: ''
  });
  const uid = useSelector((state) => state.auth.uid);

  const fetchItineraryData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/getItinerary/${uid}`);
      if (response.status === 200) {
        setItineraryData(response.data.data);
        fetchDetailedPlans(response.data.data);
      }
    } catch (err) {
      setError("Error fetching itinerary data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uid) {
      fetchItineraryData();
    }
  }, [uid]);

  const fetchDetailedPlans = async (plans) => {
    const detailedPlansData = {};
    const initialAmounts = {};
    for (const plan of plans) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/getPlan/${plan.planId}`);
        const planData = response.data.data;
        detailedPlansData[plan.planId] = planData;

        initialAmounts[plan.planId] = 
        (planData.price || 0) *
        (durations[plan.planId] || 1) *
        (personCounts[plan.planId] || 1);
      } catch (err) {
        console.error(`Error fetching detailed plan data for planId ${plan.planId}:`, err);
      }
    }
    setDetailedPlans(detailedPlansData);
    setAmounts(initialAmounts);
  };

  const handlePersonCount = (planId, increment) => {
    setPersonCounts((prevCounts) => {
      const currentCount = prevCounts[planId] || 1;
      const newCount = increment ? currentCount + 1 : Math.max(1, currentCount - 1);
  
      // Update amounts
      setAmounts((prevAmounts) => ({
        ...prevAmounts,
        [planId]:
          (detailedPlans[planId]?.price || 0) *
          newCount *
          (durations[planId] || 1),
      }));
  
      return { ...prevCounts, [planId]: newCount };
    });
  };
  
  
  const handleDuration = (planId, increment) => {
    setDurations((prevDurations) => {
      const currentDuration = prevDurations[planId] || 1;
      const newDuration = increment ? currentDuration + 1 : Math.max(1, currentDuration - 1);
  
      // Update amounts
      setAmounts((prevAmounts) => ({
        ...prevAmounts,
        [planId]:
          (detailedPlans[planId]?.price || 0) *
          (personCounts[planId] || 1) *
          newDuration,
      }));
  
      return { ...prevDurations, [planId]: newDuration };
    });
  };
  
  
  const handleDateSelect = (planId, date) => {
    setScheduleDates((prevDates) => ({
      ...prevDates,
      [planId]: date,
    }));
  };
  

  const handleCompleteItinerary = async (planId) => {
    try {
      const payload = {
        uid: uid,
        planId: planId,
      };
  
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/complete-itinerary`,
        payload
      );
  
      if (response.status === 200) {
        setItineraryData((prevData) =>
          prevData.map((plan) =>
            plan.planId === planId ? { ...plan, status: "completed" } : plan
          )
        );
      } else {
        console.error("Failed to mark itinerary as completed:", response.data);
      }
    } catch (error) {
      console.error("Error completing itinerary:", error);
    }
  };

  const handleGiveReview = () => {
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (planId) => {
    try {
      const payload = {
        uid: uid,
        planId: planId,
        name: reviewDetails.name,
        rating: reviewDetails.rating,
        review: reviewDetails.review,
        file: reviewDetails.image,
      };
      console.log('Review payload:', payload);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/add-review`
        , payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Review response:', response);

      if (response.status === 201) {
        console.log('Review submitted successfully');
        setIsReviewModalOpen(false);  
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setReviewDetails((prevDetails) => ({
      ...prevDetails,
      image: e.target.files[0]
    }));
  };

  const handleBook = async (planId) => {
    try {
      const payload = {
        scheduled: scheduleDates[planId] ? format(scheduleDates[planId], "d MMMM yyyy 'at' HH:mm:ss 'UTC+5:30'") : "Not scheduled",
        duration: durations[planId] || 1,
        personCount: personCounts[planId] || 1,
        totalAmount: (detailedPlans[planId]?.price || 0) * (durations[planId] || 1) * (personCounts[planId] || 1),
        uid: uid,
        planId: planId,
      };
  
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/book-itinerary`,
        payload
      );
  
      if (response.status === 200) {
        setItineraryData((prevData) =>
          prevData.map((plan) =>
            plan.planId === planId ? { ...plan, status: "ongoing", scheduled: payload.scheduled } : plan
          )
        );
      } else {
        console.error("Booking failed:", response.data);
      }
    } catch (error) {
      console.error("Error booking itinerary:", error);
    }
  };

  const handleRemovePlan = async (planId) => {
    try {
      const payload = {
        uid: uid,
        planId: planId,
      };
  
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/remove-itinerary`,
        { data: payload }
      );
  
      if (response.status === 200) {
        setItineraryData((prevData) =>
          prevData.filter((plan) => plan.planId !== planId)
        );
      } else {
        console.error("Removal failed:", response.data);
      }
    } catch (error) {
      console.error("Error removing itinerary:", error);
    }
  };

  // const handle reviewSubmit = async (planId, review) => {
  //   try {
  //     const reviewUrl = `${import.meta.env.VITE_API_BASE_URL}/api/add-review`;
      
  //     const payload = {
  //       uid: uid,
  //       name: name,
  //       planId: planId,
  //       review: review,
  //       rating: rating,
  //       image: image,
  //     };

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
                                {scheduleDates[currentPlan. planId]
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
              
                        <div className="flex items-center text-white">
                          Total amount: ₹
                          <span className="text-white">
                            {amounts[currentPlan.planId] || "N/A"}
                          </span>
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
                    <div className="flex flex-col gap-4 p-4 text-white rounded-lg shadow-md">
                      Scheduled for: {currentPlan.scheduled ? currentPlan.scheduled : "Not scheduled"}
                      <Button className="bg-blue-500" onClick={() => handleCompleteItinerary(currentPlan.planId)}>
                        Complete Itinerary
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 p-4 text-white rounded-lg shadow-md">
                      <Button onClick={() => handleGiveReview()}>Give Review</Button>
                      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen} className="bg-slate-900/50 backdrop-blur-sm">
                        <DialogContent className="bg-slate-900/50 backdrop-blur-sm p-4 rounded-lg text-white border border-slate-200/20" aria-describedby="review-description">
                          <DialogHeader className="flex justify-between items-center">
                            <DialogTitle className="text-white">Give Review</DialogTitle>
                            <DialogClose />
                          </DialogHeader>
                          <DialogDescription id="review-description" className="text-slate-400">
                            Fill ou the review form
                          </DialogDescription>
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            handleReviewSubmit(currentPlan.planId);
                          }}
                          className="flex flex-col gap-4"
                          >
                            <Input 
                              type="file" 
                              name="image" 
                              onChange={handleImageChange} 
                              accept="image/*"
                              className="bg-slate-800/50 text-white border border-slate-200/20 p-2"
                              required
                            />
                            <Input
                              type="text"
                              placeholder="Write your name"
                              name="name"
                              value={reviewDetails.name}
                              onChange={handleInputChange}
                              className="bg-slate-800/50 text-white border border-slate-200/20 p-2"
                              required
                            />
                            <Input 
                              type="number" 
                              name="rating" 
                              value={reviewDetails.rating} 
                              onChange={handleInputChange} 
                              placeholder="Rating (1-5)" 
                              min="1" 
                              max="5" 
                              required
                              className="bg-slate-800/50 text-white border border-slate-200/20 p-2"
                            />
                            <Textarea 
                              name="review" 
                              value={reviewDetails.review} 
                              onChange={handleInputChange} 
                              placeholder="Write your review here..."
                              className="bg-slate-800/50 text-white border border-slate-200/20 p-2"
                              required
                            />
                            <Button type="submit" className="hover:bg-slate-800">Submit Review</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
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
