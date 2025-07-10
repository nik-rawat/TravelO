import { addUser, getBookedItineraries, getLikedReviews, getUser, getUserReviews, updateUser } from "./controllers/userController.js";
import { URL } from 'url';
import { login, forgotPassword, registerWithAuth } from "./controllers/authController.js";
// import { authenticate } from "./authMiddleware.js";
import { upload_img } from "./lib/upload.js";
import { updateDoc, doc, collection, getDocs, addDoc, setDoc, getDoc, query, where, deleteDoc } from "firebase/firestore";
import { db, model } from "./lib/firebase.js"; // Import db from Firebase initialization

export async function handler(req, res, method) {
    const url = new URL(req.url, 'http://example.com'); // or any other base URL
    const path = url.pathname;

    // Handle GET requests
    if (method === "GET") {
        // If the path is '/', return a welcome message
        if (path === "/") {
            return { status: 200, data: "GET SET TravelO!" };
        }

        if (path === "/api/getUser/" + req.params.uid) {
            try {
                const uid = req.params.uid;
                console.log("UID: ", uid);
                if (!uid) {
                    return { status: 400, message: "Missing uid parameter" };
                }

                const data = { uid };
                const userData = await getUser(data);

                if (!userData) {
                    return { status: 404, message: "User not found" };
                }

                console.log(userData); // Check fetched user data
                return { status: 200, data: userData };
            } catch (err) {
                console.error(err);
                return { status: 500, message: "Error fetching user data" };
            }
        }

        if (path === "/api/getPlans") {
            try {
                const plans = [];
                const usersCollection = collection(db, "plans");
                const usersSnapshot = await getDocs(usersCollection);
                usersSnapshot.forEach((doc) => {
                    plans.push(doc.data());
                });
                console.log(plans);

                return { status: 200, data: plans };
            } catch (err) {
                console.error(err);
                return { status: 500, message: "Error fetching users" };
            }
        }

        if (path === "/api/getPlaces") {
            try {
                const places = [];
                const usersCollection = collection(db, "places");
                const usersSnapshot = await getDocs(usersCollection);
                usersSnapshot.forEach((doc) => {
                    places.push(doc.data());
                });
                console.log(places);

                return { status: 200, data: places };
            } catch (err) {
                console.error(err);
                return { status: 500, message: "Error fetching users" };
            }
        }

        if (path === "/api/getReviews") {
            try {
                const reviews = [];
                const usersCollection = collection(db, "reviews");
                const usersSnapshot = await getDocs(usersCollection);
                usersSnapshot.forEach((doc) => {
                    reviews.push(doc.data());
                });
                console.log(reviews);

                return { status: 200, data: reviews };
            } catch (err) {
                console.error(err);
                return { status: 500, message: "Error fetching users" };
            }
        }

        if (path === "/api/gallery") {
            try {
                const gallery = [];
                const usersCollection = collection(db, "gallery");
                const usersSnapshot = await getDocs(usersCollection);
                usersSnapshot.forEach((doc) => {
                    gallery.push(doc.data());
                });
                console.log(gallery);

                return { status: 200, data: gallery };
            } catch (err) {
                console.error(err);
                return { status: 500, message: "Error fetching users" };
            }
        }

        if (path === "/api/getUserPlans/" + req.params.uid) {
            try {
                const uid = req.params.uid;
                console.log("UID: ", uid);
                if (!uid) {
                    return { status: 400, message: "Missing uid parameter" };
                }

                const data = { uid };
                const userData = await getUserPlans(data);

                if (!userData) {
                    return { status: 404, message: "User not found" };
                }

                console.log(userData); // Check fetched user data
                return { status: 200, data: userData };
            } catch (err) {
                console.error(err);
                return { status: 500, message: "Error fetching user data" };
            }
        }

        if (path === "/api/getUserReviews/" + req.params.uid) {
            try {
                const uid = req.params.uid;
                console.log("UID: ", uid);
                if (!uid) {
                    return { status: 400, message: "Missing uid parameter" };
                }

                const data = { uid };
                const userData = await getUserReviews(data);

                if (!userData) {
                    return { status: 404, message: "User not found" };
                }

                console.log(userData); // Check fetched user data
                return { status: 200, data: userData };
            } catch (err) {
                console.error(err);
                return { status: 500, message: "Error fetching user data" };
            }
        }

        if (path === "/api/getUserBookings/" + req.params.uid) {
            try {
                const uid = req.params.uid;
                console.log("UID: ", uid);
                if (!uid) {
                    return { status: 400, message: "Missing uid parameter" };
                }

                const data = { uid };
                const userData = await getUserBookings(data);

                if (!userData) {
                    return { status: 404, message: "User not found" };
                }

                console.log(userData); // Check fetched user data
                return { status: 200, data: userData };
            } catch (err) {
                console.error(err);
                return { status: 500, message: "Error fetching user data" };
            }
        }

        if (path === "/api/getItinerary/" + req.params.uid) {
            try {
                const uid = req.params.uid;
                console.log("UID: ", uid);

                // Validate UID
                if (!uid) {
                    return { status: 400, message: "Missing uid parameter" };
                }

                // Fetch user data from Firestore (or any other source)
                const q = query(collection(db, "itinerary"), where("uid", "==", uid));
                const querySnapshot = await getDocs(q);
                const userData = [];
                querySnapshot.forEach((doc) => {
                    userData.push(doc.data());
                });

                console.log("Fetched User Data:", userData); // Log fetched data

                // Return success response with user data
                return { status: 200, data: userData };
            } catch (err) {
                console.error("Error fetching user data:", err);
                return { status: 500, message: "Error fetching user data" };
            }
        }

        if (path === "/api/getPlan/" + req.params.planId) {
            try {
                const planId = req.params.planId;
                console.log("Plan ID: ", planId);
                if (!planId) {
                    return { status: 400, message: "Missing planId parameter" };
                }
                const docRef = doc(db, "plans", planId);
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    return { status: 404, message: "Plan not found" };
                }
                const planData = docSnap.data();
                console.log("Fetched Plan Data:", planData);
                return { status: 200, data: planData };
            } catch (err) {
                console.error("Error fetching plan data:", err);
                return { status: 500, message: "Error fetching plan data" };
            }
        }

        if (path === "/api/getPlace/" + req.params.placeId) {
            try {
                const placeId = req.params.placeId;
                console.log("Place ID: ", placeId);
                if (!placeId) {
                    return { status: 400, message: "Missing placeId parameter" };
                }
                const docRef = doc(db, "places", placeId);
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    return { status: 404, message: "Place not found" };
                }
                const placeData = docSnap.data();
                console.log("Fetched Place Data:", placeData);
                return { status: 200, data: placeData };
            } catch (err) {
                console.error("Error fetching place data:", err);
                return { status: 500, message: "Error fetching place data" };
            }
        }

        if (path === "/api/getPlanReviews/" + req.params.planId) {
            try {
                const planId = req.params.planId;
                console.log("Plan ID: ", planId);
                if (!planId) {
                    return { status: 400, message: "Missing planId parameter" };
                }
                const q = query(collection(db, "reviews"), where("planId", "==", planId));
                const querySnapshot = await getDocs(q);
                const reviews = [];
                querySnapshot.forEach((doc) => {
                    reviews.push(doc.data());
                });
                console.log("Fetched Reviews:", reviews);
                return { status: 200, data: reviews };
            } catch (err) {
                console.error("Error fetching plan reviews:", err);
                return { status: 500, message: "Error fetching plan reviews" };
            }
        }

        if (path === "/api/getPlansFromPlace/" + req.params.placeId) {
            try {
                const placeId = req.params.placeId;
                console.log("Place ID: ", placeId);
                if (!placeId) {
                    return { status: 400, message: "Missing placeId parameter" };
                }
                const q = query(collection(db, "plans"), where("placeId", "==", placeId));
                const querySnapshot = await getDocs(q);
                const plans = [];
                querySnapshot.forEach((doc) => {
                    plans.push(doc.data());
                });
                console.log("Fetched Plans:", plans);
                return { status: 200, data: plans };
            } catch (err) {
                console.error("Error fetching plans from place:", err);
                return { status: 500, message: "Error fetching plans from place" };
            }
        }


    }


    // Handle POST requests
    if (method === "POST") {
        if (path === "/api/register") {
            try {
                const userData = req.body;
                const status = await registerWithAuth(userData);
                console.log("Data of user registered: ", userData);
                return { status: 201, data: status };
            } catch (err) {
                console.error(err);
                return { status: 500, message: "Error registering user" };
            }
        }


        if (path === "/api/login") {
            try {
                const data = req.body;
                const userData = await login(data);
                console.log("Data of user logged in: ", userData);
                return { status: 200, data: userData.uid };
            } catch (err) {
                console.error(err);
                if (err.message === 'Error logging in user: user email not verified') {
                    return { status: 403, message: "Email not verified" };
                }
                return { status: 500, message: "Error logging in" };
            }
        }
        if (path === '/api/add-plan') {
            try {
                const planData = req.body;
                // Check if required fields are provided
                if (!planData.title || !planData.description || !planData.price) {
                    return { status: 400, error: "Title, description, and price are required." };
                }
                const planId = planData.planId; // Get the placeID from the data
                const docRef = doc(db, "plans", planId);
                await setDoc(docRef, planData);
                return { status: 200, message: "Plan added successfully!", id: planId };
            } catch (error) {
                console.error("Error adding plan:", error);
                return { status: 500, error: "Internal Server Error" };
            }
        }

        if (path === '/api/add-place') {
            try {
                const placeData = req.body;
                if (!placeData.title || !placeData.description) {
                    return { status: 400, error: "Title and description are required." };
                }
                const placeId = placeData.placeId;
                const docRef = doc(db, "places", placeId);
                await setDoc(docRef, placeData);
                return {
                    status: 201,
                    message: "Place added successfully!",
                    id: placeId,
                };
            } catch (error) {
                console.error("Error adding place:", error);
                return { status: 500, error: "Internal Server Error" };
            }
        }

        if (path === '/api/add-review') {
            try {
                console.log(req.body);
                console.log(req.file);
                const file = req.file;
                const { uid, name, planId, review, rating } = req.body;
                if (!file) {
                    console.log('File not found');
                    return { status: 400, message: 'Missing file' };
                }
                if (!review) {
                    return { status: 400, error: "review is required." };
                }
                const fileBuffer = file.buffer;
                const metadata = {
                    contentType: file.mimetype,
                    filename: file.originalname,
                }
                const dateString = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = `${uid}-${planId}-${dateString}`;
                const image = await upload_img(fileBuffer, file.originalname, metadata, "gallery", filename);

                const reviewId = `${uid}-${planId}-${dateString}`;
                const docRef = doc(db, "reviews", reviewId);
                const reviewData = {
                    reviewId,
                    uid,
                    name,
                    planId,
                    review,
                    rating,
                    image,
                    createdAt: new Date().toISOString(),
                };
                await setDoc(docRef, reviewData);
                return {
                    status: 201,
                    message: "review added successfully!",
                    id: reviewId,
                };
            } catch (error) {
                console.error("Error adding place:", error);
                return { status: 500, error: "Internal Server Error" };
            }
        }

        if (path === '/api/add-itinerary') {
            try {
                const { uid, planId, } = req.body;
                const itineraryData = {
                    uid,
                    planId,
                    status: "selected"
                }
                const itineraryId = itineraryData.uid + itineraryData.planId;
                const docRef = doc(db, "itinerary", itineraryId);
                const docSnapshot = await getDoc(docRef);
                if (docSnapshot.exists()) {
                    return { status: 400, error: "Itinerary already exists" };
                }

                await setDoc(docRef, itineraryData);
                return { status: 201, message: "Itinerary scheduled successfully!", id: itineraryId, }
            } catch (error) {
                console.error("Error scheduling itinerary:", error);
                return { status: 500, error: "Internal Server Error" };
            }
        }

        if (path === '/api/book-itinerary') {
            try {
                const { uid, planId, scheduled, duration, personCount, totalAmount } = req.body;
                const itineraryData = {
                    uid,
                    planId,
                    scheduled,
                    duration,
                    personCount,
                    totalAmount,
                    createdAt: new Date().toISOString(),
                    status: "ongoing"
                }
                const itineraryId = itineraryData.uid + itineraryData.planId;
                const docRef = doc(db, "itinerary", itineraryId);
                await setDoc(docRef, itineraryData);
                return {
                    status: 200,
                    message: "Itinerary scheduled successfully!",
                    id: itineraryId,
                };
            } catch (error) {
                console.error("Error scheduling itinerary:", error);
                return { status: 500, error: "Internal Server Error" };
            }
        }

        if (path === '/api/forgot-password') {
            try {
                const data = req.body;
                const status = await forgotPassword(data);
                return { status: 200, data: status };
            } catch (err) {
                console.error(err);
                return { status: 500, message: "Error resetting password" };
            }
        }

        if (path === '/api/create-user' || path === '/api/add-user') {
            try {
                const userData = req.body;
                userData.avatar = ""; // Set a default avatar if needed
                const createdUser = await addUser(userData);
                console.log("Data of user added: ", userData);
                return { status: 201, data: createdUser };
            } catch (err) {
                console.error(err);
                return { status: 500, message: "Error adding user" };
            }
        }

        if (path === '/api/upload-gallery') {
            try {
                console.log(req.body);
                console.log(req.file);
                const file = req.file;
                if (!file) {
                    console.log('File not found');
                    return { status: 400, message: 'Missing file' };
                }
                const fileBuffer = file.buffer;
                const metadata = {
                    contentType: file.mimetype,
                    filename: file.originalname,
                }
                const { uid } = req.body;
                const dateString = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = `${dateString}-${file.originalname}`;
                const link = await upload_img(fileBuffer, file.originalname, metadata, "gallery", filename);
                if (!req.body || !req.body.uid) {
                    return { status: 400, message: "Missing uid parameter" };
                }

                const userDoc = doc(db, "users", uid); // Ensure UID is provided
                // await updateDoc(userDoc, { avatar: avatar });
                return { status: 200, message: "image uploaded", data: avatar };
            } catch (err) {
                console.error(err);
                return { status: 500, message: "Error uploading avatar" };
            }
        }

        if (path === '/api/like') {
            try {
                const { uid, reviewId } = req.body; // Get the user ID from the request body
                console.log("Review ID: ", reviewId);
                if (!reviewId) {
                    return { status: 400, message: "Missing reviewId parameter" };
                }
                const docRef = doc(db, "reviews", reviewId);
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    return { status: 404, message: "Review not found" };
                }

                // maintain only one like per user
                // check in the userLikes array if the user has already liked the review
                const userLikes = docSnap.data().likes || [];
                if (userLikes.includes(uid)) {
                    return { status: 400, message: "You have already liked this review" };
                }
                // Add the user to the likes array

                const reviewData = docSnap.data();
                const likes = reviewData.likes || 0; // Get current likes or default to 0
                await updateDoc(docRef, { likes: likes + 1 });
                // Update the likes array with the new user
                await updateDoc(docRef, { likes: [...userLikes, uid] });
                return { status: 200, message: "Review liked successfully!", likes: likes + 1 };
            } catch (err) {
                console.error("Error liking review:", err);
                return { status: 500, message: "Error liking review" };
            }
        }

        if (path === '/api/unlike') {
            try {
                const { uid, reviewId } = req.body; // Get the user ID from the request body
                console.log("Review ID: ", reviewId);
                if (!reviewId) {
                    return { status: 400, message: "Missing reviewId parameter" };
                }
                const docRef = doc(db, "reviews", reviewId);
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    return { status: 404, message: "Review not found" };
                }
                // maintain only one like per user
                // check in the userLikes array if the user has already liked the review
                const userLikes = docSnap.data().likes || [];
                if (!userLikes.includes(uid)) {
                    return { status: 400, message: "You have not liked this review yet" };
                }
                // Remove the user from the likes array
                const reviewData = docSnap.data();
                const likes = reviewData.likes || 0; // Get current likes or default to 0
                await updateDoc(docRef, { likes: likes - 1 });
                // Update the likes array by removing the user
                const updatedLikes = userLikes.filter(userId => userId !== uid);
                await updateDoc(docRef, { likes: updatedLikes });
                return { status: 200, message: "Review unliked successfully!", likes: likes - 1 };
            } catch (err) {
                console.error("Error unliking review:", err);
                return { status: 500, message: "Error unliking review" };
            }
        }

        if (path === '/api/flush') {
            try {

                const places = req.body.places; // Get the array of places from the request body
                // Validate the places array
                if (!Array.isArray(places) || places.length === 0) {
                    return { status: 400, message: "Invalid or empty places array" };
                }

                // Iterate over each place and create a document in the "places" collection
                for (const place of places) {
                    const docRef = doc(db, "places", place.placeId);
                    await setDoc(docRef, place);
                }
                console.log("Flush operation completed successfully");

                return { status: 200, message: "Flush operation completed successfully" };
            } catch (error) {
                console.error("Error flushing data:", error);
                return { status: 500, error: "Internal Server Error" };
            }
        }

        // AI poweered request
        if (path === '/api/getRecommendations') {
            try {
                const { uid } = req.body; // Get the user ID from the request body

                if (!uid) {
                    return { status: 400, message: "Missing uid parameter" };
                }

                // Get user's past bookings and liked reviews
                const userBookings = await getBookedItineraries(uid);
                const userLikedReviews = await getLikedReviews(uid);

                // Fetch available places and plans for recommendations
                const placesSnapshot = await getDocs(collection(db, "places"));
                const places = [];
                placesSnapshot.forEach((doc) => places.push(doc.data()));

                const plansSnapshot = await getDocs(collection(db, "plans"));
                const plans = [];
                plansSnapshot.forEach((doc) => plans.push(doc.data()));

                // Construct a prompt for the AI model
                const promptText = `
                Based on this user's travel history and preferences, recommend 3-5 travel destinations.
                
                User's past bookings: ${JSON.stringify(userBookings)}
                User's reviews: ${JSON.stringify(userLikedReviews)}
                
                Available places: ${JSON.stringify(places.map(p => ({ id: p.placeId, name: p.title, location: p.location })))}
                Available plans: ${JSON.stringify(plans.map(p => ({ id: p.planId, title: p.title, placeId: p.placeId })))}
                
                For each recommendation, include:
                1. Place name
                2. Why it matches their preferences
                3. Suggested plan ID (if applicable)
                
                Format as JSON with an array of recommendations.
                `;

                // Generate recommendations using the AI model
                const result = await model.generateContent(promptText);
                const response = await result.response;
                const text = response.text();

                // Parse the AI response (assuming it returns properly formatted JSON)
                let recommendations;
                try {
                    const cleanedText = text.replace(/```json|```/g, '').trim();
                    console.log("AI response:", cleanedText);
                    const parsedResponse = JSON.parse(cleanedText);

                    // Handle different response formats
                    if (Array.isArray(parsedResponse)) {
                        // If the response is an array, wrap it in an object
                        recommendations = { recommendations: parsedResponse };
                    } else if (parsedResponse && typeof parsedResponse === 'object') {
                        // If it's already an object, check if it has recommendations property
                        if (Array.isArray(parsedResponse.recommendations)) {
                            recommendations = parsedResponse;
                        } else {
                            // If it's an object without recommendations array, wrap it
                            recommendations = { recommendations: [parsedResponse] };
                        }
                    } else {
                        throw new Error("Invalid AI response format");
                    }

                    // Ensure recommendations has the expected structure and is an array
                    if (!recommendations || !recommendations.recommendations || !Array.isArray(recommendations.recommendations)) {
                        throw new Error("Invalid AI response structure");
                    }
                } catch (err) {
                    console.error("Error parsing AI response:", err);
                    recommendations = {
                        recommendations: [
                            // Fallback recommendations in case parsing fails
                            {
                                placeName: places[0]?.title || "Popular Destination",
                                reason: "Popular destination you might enjoy based on your interests",
                                placeId: places[0]?.placeId
                            }
                        ]
                    };
                }

                // Enhance recommendations with full place and plan details
                const enhancedRecommendations = recommendations.recommendations.map(rec => {
                    // Convert fields to consistent format (handle variation in field names)
                    const placeName = rec.placeName || rec["Place name"] || "";
                    const reason = rec.reason || rec["Why it matches their preferences"] || "";
                    const suggestedPlanId = rec.suggestedPlanId || rec["Suggested plan ID"] || "";

                    // Find matching place by name
                    const place = places.find(p =>
                        (placeName && p.title && p.title.toLowerCase().includes(placeName.toLowerCase())) ||
                        p.placeId === rec.placeId
                    );

                    // Find suggested plans either by ID or for this place
                    let suggestedPlans = [];
                    if (suggestedPlanId) {
                        const specificPlan = plans.find(p => p.planId === suggestedPlanId);
                        if (specificPlan) suggestedPlans = [specificPlan];
                    } else if (place) {
                        suggestedPlans = plans.filter(p => p.placeId === place.placeId);
                    }

                    return {
                        placeName,
                        reason,
                        suggestedPlanId,
                        placeDetails: place || {},
                        suggestedPlans: suggestedPlans || []
                    };
                });

                return {
                    status: 200,
                    data: {
                        recommendations: enhancedRecommendations,
                        generatedAt: new Date().toISOString()
                    }
                };
            } catch (error) {
                console.error("Error generating recommendations:", error);
                return {
                    status: 500,
                    error: "Failed to generate recommendations",
                    message: error.message
                };
            }
        }
        if (path === '/api/generate-itinerary') {
            try {
                const { destination, duration, interests, budget } = req.body;
                if (!destination || !duration || !interests || !budget) {
                    return { status: 400, message: "Missing required fields" };
                }
                // Construct a prompt for the AI model
                const promptText = `Generate a detailed travel itinerary for a trip to ${destination} for ${duration} days.
                The itinerary should include:
                1. Daily activities and places to visit
                2. Recommended restaurants and dining options
                3. Estimated costs for each activity and meal
                4. Transportation options and costs
                5. Accommodation suggestions
                6. Any special events or festivals happening during the trip
                The itinerary should be tailored to the following interests: ${interests.join(", ")}.
                The budget for the trip is ${budget}. Please provide the itinerary in JSON format.`;
                // Generate itinerary using the AI model
                const result = await model.generateContent(promptText);
                const response = await result.response;
                const text = await response.text();
                // Parse the AI response (assuming it returns properly formatted JSON)
                let generatedItinerary;
                try {
                    generatedItinerary = JSON.parse(text);
                } catch (err) {
                    console.error("Error parsing AI response:", err);
                    return { staus: 422, message: "Failed to parse AI response" };
                }
                // Ensure the generated itinerary has the expected structure
                if (!generatedItinerary || typeof generatedItinerary !== 'object') {
                    return { staus: 422, message: "Invalid itinerary format" };
                }
                // Return the generated itinerary
                console.log("Generated Itinerary:", generatedItinerary);
                return { status: 200, itinerary: generatedItinerary };
            } catch (err) {
                console.error(err);
                return { status: 500, message: "Failed to generate itinerary" };
            }
        }
    }

    // Handle PUT requests
    if (method === "PUT") {
        if (path === '/api/updateAvatar') {
            try {
                console.log(req.body);
                console.log(req.file);
                const file = req.file;
                if (!file) {
                    console.log('File not found');
                    return { status: 400, message: 'Missing file' };
                }
                const fileBuffer = file.buffer;
                const metadata = {
                    contentType: file.mimetype,
                    filename: file.originalname,
                }
                const { uid } = req.body;
                const avatar = await upload_img(fileBuffer, file.originalname, metadata, "pfp", uid);
                if (!req.body || !req.body.uid) {
                    return { status: 400, message: "Missing uid parameter" };
                }

                const userDoc = doc(db, "users", uid); // Ensure UID is provided
                await updateDoc(userDoc, { avatar: avatar });
                return { status: 200, message: "image uploaded", data: avatar };
            } catch (err) {
                console.error(err);
                return { status: 500, message: "Error uploading avatar" };
            }
        }

        if (path === '/api/updateUser') {
            try {
                const data = req.body;
                if (!data || !data.uid) {
                    return { status: 400, message: "Missing uid parameter" };
                }

                await updateUser(data);
                return { status: 200, message: "User updated" };
            } catch (err) {
                console.error(err);
                return { status: 500, message: "Error updating user" };
            }
        }

        if (path === '/api/complete-itinerary') {
            try {
                const { uid, planId } = req.body;
                const itineraryId = uid + planId;
                const docRef = doc(db, "itinerary", itineraryId);
                const docSnapshot = await getDoc(docRef);
                if (!docSnapshot.exists()) {
                    return { status: 404, error: "Itinerary not found" };
                }
                await updateDoc(docRef, { status: "completed" });

                return {
                    status: 200,
                    message: "Itinerary completion successfully!",
                    id: itineraryId,
                };
            } catch (error) {
                console.error("Error completing itinerary:", error);
                return { status: 500, error: "Internal Server Error" };
            }
        }
    }

    // Handle DELETE requests
    if (method === "DELETE") {
        if (path === '/api/deleteUser') {
            try {
                const data = req.body;
                if (!data || !data.uid) {
                    return { status: 400, message: "Missing uid parameter" };
                }
                await deleteUser(data);
                return { status: 200, message: "User deleted" };
            } catch (err) {
                console.error(err);
                return { status: 500, message: "Error deleting user" };
            }
        }

        if (path === '/api/deleteReview') {
            try {
                const data = req.body;
                if (!data || !data.uid) {
                    return { status: 400, message: "Missing uid parameter" };
                }
                await deleteReview(data);
                return { status: 200, message: "User plan deleted" };
            } catch (err) {
                console.error(err);
                return { status: 500, message: "Error deleting user Review" };
            }
        }

        if (path === '/api/remove-itinerary') {
            try {
                const { uid, planId } = req.body;
                const itineraryId = uid + planId;
                const docRef = doc(db, "itinerary", itineraryId);
                await deleteDoc(docRef);
                return { status: 200, message: "Itinerary removed successfully!" };
            } catch (error) {
                console.error("Error removing itinerary:", error);
                return { status: 500, error: "Internal Server Error" };
            }
        }
    }

    return { status: 404, message: "Invalid path" };
}