import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import Navbar from '../components/Navbar';
import axios from "axios";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const ItineraryList = () => {
    const [itineraryData, setItineraryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [detailedPlans, setDetailedPlans] = useState({}); // State to store detailed plan data

    // Retrieve uid from Redux state
    const uid = useSelector((state) => state.auth.uid); // Adjust based on your Redux state structure

    // Fetch itinerary data from the backend
    useEffect(() => {
        const fetchItineraryData = async () => {
            try {
                const response = await axios.get(`https://travel-o-backend.vercel.app/api/getItinerary/${uid}`);
                if (response.status === 200) {
                    setItineraryData(response.data.data);
                    fetchDetailedPlans(response.data.data); // Fetch detailed data for each plan
                } else {
                    setError("Failed to fetch itinerary data");
                }
            } catch (err) {
                console.error("Error fetching itinerary data:", err);
                setError("Error fetching itinerary data");
            } finally {
                setLoading(false);
            }
        };

        if (uid) {
            fetchItineraryData();
        }
    }, [uid]);

    // Fetch detailed plan data for each planId
    const fetchDetailedPlans = async (plans) => {
        const detailedPlansData = {};
        for (const plan of plans) {
            try {
                const response = await axios.get(`https://travel-o-backend.vercel.app/api/getPlan/${plan.planId}`);
                if (response.status === 200) {
                    detailedPlansData[plan.planId] = response.data;
                }
            } catch (err) {
                console.error(`Error fetching detailed plan data for planId ${plan.planId}:`, err);
            }
        }
        setDetailedPlans(detailedPlansData);
    };

    const selectedPlans = itineraryData.filter((plan) => plan.status === "selected");
    const ongoingPlans = itineraryData.filter((plan) => plan.status === "ongoing");
    const previousPlans = itineraryData.filter((plan) => plan.status === "completed");

    // Placeholder functions for button actions
    const handleSchedule = (planId) => {
        console.log("Schedule plan:", planId);
    };

    const removePlan = (planId) => {
        console.log("Remove plan:", planId);
    };

    const markAsOngoing = (planId) => {
        console.log("Mark as ongoing:", planId);
    };

    const markAsCompleted = (planId) => {
        console.log("Mark as completed:", planId);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900">
            <Navbar />
            <div className="container mx-auto py-16 px-4">
                <h1 className="text-4xl font-bold text-white mb-8 text-center">Your Itinerary</h1>

                {loading && (
                    <motion.div
                        className="loader-container flex flex-col items-center justify-center p-8 rounded-lg"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            animate={{ rotate: 360, scale: [1, 1, 2, 1] }}
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

                {/* Selected Plans Section */}
                <h2 className="text-2xl font-bold text-white mb-6">Selected Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {selectedPlans.map((plan) => (
                        <Card key={plan.planId} className="group hover:shadow-xl transition-all duration-300 border-slate-200/20 bg-slate-900/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl text-white">Plan ID: {plan.planId}</CardTitle>
                                <CardDescription className="text-slate-400">Status: {plan.status}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="text-slate-300">
                                        <p><strong>Title:</strong> {detailedPlans[plan.planId]?.title || "Loading..."}</p>
                                        <p><strong>Location:</strong> {detailedPlans[plan.planId]?.location || "Loading..."}</p>
                                        <p><strong>Duration:</strong> {detailedPlans[plan.planId]?.duration || "Loading..."}</p>
                                        <p><strong>Price:</strong> {detailedPlans[plan.planId]?.price || "Loading..."}</p>
                                        <p><strong>Description:</strong> {detailedPlans[plan.planId]?.description || "Loading..."}</p>
                                        <p><strong>Features:</strong> {detailedPlans[plan.planId]?.features.join(", ") || "Loading..."}</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                                <Button
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-blue-600 text-white"
                                    onClick={() => handleSchedule(plan.planId)}
                                >
                                    Schedule
                                </Button>
                                <Button
                                    className="bg-gradient-to-r from-red-500 to-red-600 hover:bg-red-600 text-white"
                                    onClick={() => removePlan(plan.planId)}
                                >
                                    Remove
                                </Button>
                                <Button
                                    className="bg-gradient-to-r from-green-500 to-green-600 hover:bg-green-600 text-white"
                                    onClick={() => markAsOngoing(plan.planId)}
                                >
                                    Start Plan
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Ongoing Plans Section */}
                <h2 className="text-2xl font-bold text-white mt-12 mb-6">Ongoing Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ongoingPlans.map((plan) => (
                        <Card key={plan.planId} className="group hover:shadow-xl transition-all duration-300 border-slate-200/20 bg-slate-900/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl text-white">Plan ID: {plan.planId}</CardTitle>
                                <CardDescription className="text-slate-400">Status: {plan.status}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="text-slate-300">
                                        <p><strong>Title:</strong> {detailedPlans[plan.planId]?.title || "Loading..."}</p>
                                        <p><strong>Location:</strong> {detailedPlans[plan.planId]?.location || "Loading..."}</p>
                                        <p><strong>Duration:</strong></p>                                     <p><strong>Duration:</strong> {detailedPlans[plan.planId]?.duration || "Loading..."}</p>
                                        <p><strong>Price:</strong> {detailedPlans[plan.planId]?.price || "Loading..."}</p>
                                        <p><strong>Description:</strong> {detailedPlans[plan.planId]?.description || "Loading..."}</p>
                                        <p><strong>Features:</strong> {detailedPlans[plan.planId]?.features.join(", ") || "Loading..."}</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                                <Button
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                    onClick={() => markAsCompleted(plan.planId)}
                                >
                                    Complete Plan
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Previous Plans Section */}
                <h2 className="text-2xl font-bold text-white mt-12 mb-6">Previous Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {previousPlans.map((plan) => (
                        <Card key={plan.planId} className="group hover:shadow-xl transition-all duration-300 border-slate-200/20 bg-slate-900/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl text-white">Plan ID: {plan.planId} - Completed</CardTitle>
                                <CardDescription className="text-slate-400">Status: {plan.status}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="text-slate-300">
                                        <p><strong>Title:</strong> {detailedPlans[plan.planId]?.title || "Loading..."}</p>
                                        <p><strong>Location:</strong> {detailedPlans[plan.planId]?.location || "Loading..."}</p>
                                        <p><strong>Duration:</strong> {detailedPlans[plan.planId]?.duration || "Loading..."}</p>
                                        <p><strong>Price:</strong> {detailedPlans[plan.planId]?.price || "Loading..."}</p>
                                        <p><strong>Description:</strong> {detailedPlans[plan.planId]?.description || "Loading..."}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ItineraryList;