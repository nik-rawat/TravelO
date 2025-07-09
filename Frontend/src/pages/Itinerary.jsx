/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Users, Clock } from "lucide-react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';

// New Skeleton Loader Component for full cards (used when initial itineraryData is loading)
const ItineraryCardSkeleton = () => (
  <div className="bg-slate-900/50 backdrop-blur-sm border-slate-200/20 p-4 rounded-lg shadow-md">
    <div className="animate-pulse">
      {/* Card Header (Title) */}
      <div className="h-6 bg-slate-700 rounded w-3/4 mb-4"></div>

      {/* Card Content (Description) */}
      <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-slate-700 rounded w-5/6 mb-6"></div>

      {/* This section now mimics the controls for a 'selected' card */}
      <div className="space-y-4">
        {/* Persons Counter Placeholder */}
        <div className="flex justify-between items-center">
          <div className="h-5 bg-slate-700 rounded w-20"></div>
          <div className="h-8 bg-slate-700 rounded w-28"></div>
        </div>

        {/* Date Picker Placeholder */}
        <div className="h-10 bg-slate-700 rounded w-full"></div>

        {/* Total Amount Placeholder */}
        <div className="h-6 bg-slate-700 rounded w-36"></div>

        {/* Action Buttons Placeholder */}
        <div className="flex justify-between gap-4 pt-2">
          <div className="h-10 bg-slate-700 rounded w-1/2"></div>
          <div className="h-10 bg-slate-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  </div>
);

const ItineraryCard = ({ plan, detailedPlans, buttonActions }) => {
  const planDetails = detailedPlans[plan.planId];
  const isPlanDetailsLoading = !planDetails;

  return (
    <motion.div
      className="bg-gradient-to-b from-slate-900 to-slate-950 backdrop-blur-sm border border-slate-800 rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CardHeader className="p-5 border-b border-slate-800 bg-slate-900/50">
        {isPlanDetailsLoading ? (
          <div className="animate-pulse">
            <div className="h-6 bg-slate-700 rounded w-3/4 mb-2"></div>
          </div>
        ) : (
          <CardTitle className="text-xl text-white">{planDetails.title}</CardTitle>
        )}
      </CardHeader>
      
      <CardContent className="p-5">
        {isPlanDetailsLoading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-700 rounded w-5/6"></div>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-slate-400 mb-4">{planDetails.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-blue-500/20 text-blue-300 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {planDetails.duration}
              </Badge>
              <Badge className="bg-green-500/20 text-green-300">
                ₹{planDetails.price}
              </Badge>
              <Badge className="bg-orange-500/20 text-orange-300 flex items-center gap-1">
                <Users className="w-3 h-3" />
                Max {planDetails.maxGroup} persons
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col border-t border-slate-800 bg-slate-900/30 p-5 gap-4">
        {isPlanDetailsLoading ? (
          <div className="animate-pulse w-full flex flex-col gap-4">
            <div className="h-5 bg-slate-700 rounded w-20"></div>
            <div className="h-10 bg-slate-700 rounded w-full"></div>
            <div className="h-6 bg-slate-700 rounded w-36"></div>
            <div className="flex justify-between gap-4 pt-2">
              <div className="h-10 bg-slate-700 rounded w-1/2"></div>
              <div className="h-10 bg-slate-700 rounded w-1/2"></div>
            </div>
          </div>
        ) : (
          buttonActions(plan)
        )}
      </CardFooter>
    </motion.div>
  );
};

const ItineraryList = () => {
  const [itineraryData, setItineraryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailedPlans, setDetailedPlans] = useState({});
  const [personCounts, setPersonCounts] = useState({});
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
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/getItinerary/${uid}`);
      if (response.status === 200) {
        setItineraryData(response.data.data);
        fetchDetailedPlans(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching itinerary data:", err);
      toast.error("Failed to fetch your itineraries. Please try again later.");
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
    const detailedPlansPromises = plans.map(async (plan) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/getPlan/${plan.planId}`);
        const planData = response.data.data;
        return { planId: plan.planId, data: planData };
      } catch (err) {
        console.error(`Error fetching detailed plan data for planId ${plan.planId}:`, err);
        return { planId: plan.planId, data: null };
      }
    });

    const results = await Promise.all(detailedPlansPromises);
    const newDetailedPlans = {};
    const newInitialAmounts = {};

    results.forEach(({ planId, data }) => {
      if (data) {
        newDetailedPlans[planId] = data;
        // Calculate initial amount using plan's price and default person count (1)
        newInitialAmounts[planId] = (data.price || 0) * (personCounts[planId] || 1);
      }
    });

    setDetailedPlans((prev) => ({ ...prev, ...newDetailedPlans }));
    setAmounts((prev) => ({ ...prev, ...newInitialAmounts }));
  };

  const handlePersonCount = (planId, increment) => {
    setPersonCounts((prevCounts) => {
      const currentCount = prevCounts[planId] || 1;
      const maxGroup = detailedPlans[planId]?.maxGroup || 1;
      const newCount = increment ? 
        Math.min(maxGroup, currentCount + 1) : 
        Math.max(1, currentCount - 1);

      // Update amounts - remove duration multiplication since we use plan's built-in duration
      setAmounts((prevAmounts) => ({
        ...prevAmounts,
        [planId]: (detailedPlans[planId]?.price || 0) * newCount,
      }));

      return { ...prevCounts, [planId]: newCount };
    });
  };

  const handleDateSelect = (planId, date) => {
    setScheduleDates((prevDates) => ({
      ...prevDates,
      [planId]: date,
    }));
  };

  const handleCompleteItinerary = async (planId) => {
    const promise = axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/complete-itinerary`,
      { uid, planId }
    );

    toast.promise(promise, {
      loading: 'Completing itinerary...',
      success: (response) => {
        if (response.status === 200) {
          setItineraryData((prevData) =>
            prevData.map((plan) =>
              plan.planId === planId ? { ...plan, status: "completed" } : plan
            )
          );
          return 'Itinerary marked as completed!';
        }
        throw new Error('Failed to complete itinerary');
      },
      error: 'Could not complete itinerary. Please try again.',
    });
  };

  const handleGiveReview = () => {
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (planId) => {
    const payload = new FormData();
    payload.append('uid', uid);
    payload.append('planId', planId);
    payload.append('name', reviewDetails.name);
    payload.append('rating', reviewDetails.rating);
    payload.append('review', reviewDetails.review);
    payload.append('file', reviewDetails.image);

    const promise = axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/add-review`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    toast.promise(promise, {
      loading: 'Submitting your review...',
      success: (response) => {
        if (response.status === 201) {
          setIsReviewModalOpen(false);
          setReviewDetails({ image: null, name: '', rating: '', review: '' });
          return 'Thank you for your review!';
        }
        throw new Error('Failed to submit review');
      },
      error: 'Could not submit review. Please check your input.',
    });
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

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        console.error("Failed to load script:", src);
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // Razorpay payment and booking logic
  const handleBook = async (planId) => {
    if (!scheduleDates[planId]) {
      toast.error("Please select a date before booking.");
      return;
    }

    const planDetails = detailedPlans[planId];
    const totalAmount = (planDetails?.price || 0) * (personCounts[planId] || 1);
    
    const bookingPromise = async () => {
      // 1. Create Razorpay order
      const orderRes = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/create-order`, {
        amount: totalAmount * 100, // in paise
        currency: "INR"
      });
      const order = orderRes.data;

      // 2. Load Razorpay script
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) throw new Error("Razorpay SDK failed to load. Are you online?");

      // 3. Open Razorpay payment window
      return new Promise((resolve, reject) => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "TravelO",
          description: "Booking Itinerary",
          image: "https://travel-o-sage.vercel.app/assets/Travelo-white-bg.png",
          order_id: order.id,
          handler: async function (response) {
            try {
              const verifyRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/verify-payment/${response.razorpay_payment_id}`);
              if (verifyRes.status === 200) {
                const payload = {
                  scheduled: scheduleDates[planId] ? format(scheduleDates[planId], "d MMMM yyyy 'at' HH:mm:ss 'UTC+5:30'") : "Not scheduled",
                  duration: planDetails?.duration || "Not specified", // Use plan's duration
                  personCount: personCounts[planId] || 1,
                  totalAmount: totalAmount,
                  uid: uid,
                  planId: planId,
                };
                const bookRes = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/book-itinerary`, payload);
                if (bookRes.status === 200) {
                  setItineraryData((prevData) =>
                    prevData.map((plan) =>
                      plan.planId === planId ? { ...plan, status: "ongoing", scheduled: payload.scheduled } : plan
                    )
                  );
                  resolve("Payment successful! Your itinerary has been booked.");
                } else {
                  reject("Booking failed after payment. Please contact support.");
                }
              } else {
                reject("Payment verification failed. Please try again.");
              }
            } catch (err) {
              console.error("Payment verification error:", err);
              reject("Payment verification error. Please try again.");
            }
          },
          prefill: { name: "John Doe", email: "" },
          theme: { color: "#050A1C" },
          modal: {
            ondismiss: () => {
              reject("Payment was cancelled.");
            }
          }
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      });
    };

    toast.promise(bookingPromise(), {
      loading: 'Initializing payment...',
      success: (message) => message,
      error: (err) => err.toString(),
    });
  };

  const handleRemovePlan = async (planId) => {
    const promise = axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/remove-itinerary`, {
      data: { uid, planId }
    });

    toast.promise(promise, {
      loading: 'Removing plan...',
      success: (response) => {
        if (response.status === 200) {
          setItineraryData((prevData) => prevData.filter((plan) => plan.planId !== planId));
          return 'Plan removed successfully!';
        }
        throw new Error('Failed to remove plan');
      },
      error: 'Could not remove plan. Please try again.',
    });
  };

  const categorizedPlans = {
    selected: itineraryData.filter((plan) => plan.status === "selected"),
    ongoing: itineraryData.filter((plan) => plan.status === "ongoing"),
    previous: itineraryData.filter((plan) => plan.status === "completed"),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} toastOptions={{
        className: 'bg-slate-800 text-white',
      }} />
      <div className="container mx-auto py-16 px-4">
        <motion.h1 className="text-4xl font-bold text-white mb-8 text-center">Your Itineraries</motion.h1>
        
        {/* Add this tagline section */}
        <div className="text-center mb-12">
          <p className="text-slate-300 max-w-2xl mx-auto">
            Manage your travel plans and track your journey from planning to completion
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => <ItineraryCardSkeleton key={i} />)}
          </div>
        ) : (
          ["selected", "ongoing", "previous"].map((category) => (
            <div key={category} className="mb-12">
              <AnimatePresence>
                {categorizedPlans[category].length > 0 && (
                  <motion.div>
                    <h2 className="text-2xl text-white mb-4 capitalize">{category} itineraries</h2>
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
                                <div className="flex flex-col gap-4 mt-4 w-full">
                                  <div className="flex items-center justify-between">
                                    <span className="text-white flex items-center gap-2">
                                      <Users className="w-4 h-4" />
                                      Persons:
                                    </span>
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
                                        className="text-white w-8 text-center"
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

                                  <div className="text-center text-sm text-slate-400">
                                    Maximum {detailedPlans[currentPlan.planId]?.maxGroup || 1} persons allowed
                                  </div>

                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal text-white bg-slate-800/50 border-slate-200/20"
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
                                        disabled={{
                                          before: (() => {
                                            const date = new Date();
                                            date.setDate(date.getDate() + 2);
                                            return date;
                                          })()
                                        }}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>

                                  <div className="flex items-center justify-between text-white font-semibold text-lg bg-slate-800/30 p-3 rounded-lg">
                                    <span>Total Amount:</span>
                                    <span className="text-green-400">
                                      ₹{amounts[currentPlan.planId]?.toLocaleString('en-IN') || "0"}
                                    </span>
                                  </div>

                                  <div className="text-xs text-slate-400 text-center">
                                    Price includes {detailedPlans[currentPlan.planId]?.duration} duration
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
                                      disabled={!scheduleDates[currentPlan.planId]}
                                      onClick={() => handleBook(currentPlan.planId)}
                                    >
                                      Book
                                    </Button>
                                  </div>
                                </div>
                              </>
                            ) : category === "ongoing" ? (
                              <div className="flex flex-col gap-4 p-4 text-white rounded-lg w-full">
                                <div className="text-sm text-slate-400">
                                  Scheduled for: {currentPlan.scheduled ? currentPlan.scheduled : "Not scheduled"}
                                </div>
                                <div className="text-sm text-slate-400">
                                  Duration: {detailedPlans[currentPlan.planId]?.duration || "Not specified"}
                                </div>
                                <Button className="bg-blue-500" onClick={() => handleCompleteItinerary(currentPlan.planId)}>
                                  Complete Itinerary
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-4 p-4 text-white rounded-lg w-full">
                                <div className="text-sm text-slate-400 mb-2">
                                  Completed • Duration: {detailedPlans[currentPlan.planId]?.duration || "Not specified"}
                                </div>
                                <Button onClick={() => handleGiveReview()}>Give Review</Button>
                                <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen} className="bg-slate-900/50 backdrop-blur-sm">
                                  <DialogContent className="bg-slate-900/50 backdrop-blur-sm p-4 rounded-lg text-white border border-slate-200/20" aria-describedby="review-description">
                                    <DialogHeader className="flex justify-between items-center">
                                      <DialogTitle className="text-white">Give Review</DialogTitle>
                                      <DialogClose />
                                    </DialogHeader>
                                    <DialogDescription id="review-description" className="text-slate-400">
                                      Fill out the review form
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ItineraryList;
