import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Navbar from '../components/Navbar';

const Itinerary = () => {
  // Local state for plans, ongoing plans, and previous plans
  const [plans, setPlans] = useState([
    { id: 1, name: "Mountain Explorer", scheduleDetails: "" },
    { id: 2, name: "Coastal Paradise", scheduleDetails: "" },
    { id: 3, name: "Cultural Odyssey", scheduleDetails: "" },
  ]);
  const [ongoingPlans, setOngoingPlans] = useState([]);
  const [previousPlans, setPreviousPlans] = useState([]);
  const [memberCounts, setMemberCounts] = useState({}); // Local state for member counts

  // Handle scheduling a plan
  const handleSchedule = (planId) => {
    const scheduleDetails = prompt('Enter schedule details (date, time, etc.):');
    if (scheduleDetails) {
      setPlans((prevPlans) =>
        prevPlans.map((plan) =>
          plan.id === planId ? { ...plan, scheduleDetails } : plan
        )
      );
    }
  };

  // Handle removing a plan
  const removePlan = (planId) => {
    setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== planId));
  };

  // Handle marking a plan as ongoing
  const markAsOngoing = (planId) => {
    const plan = plans.find((plan) => plan.id === planId);
    if (plan) {
      setOngoingPlans((prev) => [...prev, plan]);
      setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== planId));
    }
  };

  // Handle marking a plan as completed
  const markAsCompleted = (planId) => {
    const plan = ongoingPlans.find((plan) => plan.id === planId);
    if (plan) {
      setPreviousPlans((prev) => [...prev, plan]);
      setOngoingPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== planId));
    }
  };

  // Handle updating member count for a plan
  const handleMemberCountChange = (planId, count) => {
    setMemberCounts((prev) => ({ ...prev, [planId]: count }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900">
      <Navbar/>
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Your Itinerary</h1>

        {/* Selected Plans Section */}
        <h2 className="text-2xl font-bold text-white mb-6">Selected Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.id} className="group hover:shadow-xl transition-all duration-300 border-slate-200/20 bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                <CardDescription className="text-slate-400">Plan your adventure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-slate-300 space-x-4">
                    <Users className="w-4 h-4" />
                    <span>Members: </span>
                    <input
                      type="number"
                      value={memberCounts[plan.id] || 1}
                      onChange={(e) => handleMemberCountChange(plan.id, e.target.value)}
                      min="1"
                      className="w-16 bg-slate-800 text-white rounded-md px-2 py-1"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Button
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-blue-600 text-white"
                  onClick={() => handleSchedule(plan.id)}
                >
                  Schedule
                </Button>
                <Button
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:bg-red-600 text-white"
                  onClick={() => removePlan(plan.id)}
                >
                  Remove
                </Button>
                <Button
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:bg-green-600 text-white"
                  onClick={() => markAsOngoing(plan.id)}
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
            <Card key={plan.id} className="group hover:shadow-xl transition-all duration-300 border-slate-200/20 bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                <CardDescription className="text-slate-400">Scheduled: {plan.scheduleDetails}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between items-center">
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => markAsCompleted(plan.id)}
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
            <Card key={plan.id} className="group hover:shadow-xl transition-all duration-300 border-slate-200/20 bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-white">{plan.name} - Completed</CardTitle>
                <CardDescription className="text-slate-400">Scheduled: {plan.scheduleDetails}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Itinerary;