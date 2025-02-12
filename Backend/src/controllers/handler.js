import { addUser, getUser, updateUser } from "./userController.js";
import { URL } from 'url';
import { login, forgotPassword, registerWithAuth } from "./authController.js";
// import { authenticate } from "./authMiddleware.js";
import { upload_img } from "./lib/upload.js";
import { updateDoc, doc, collection, getDocs, addDoc, setDoc, getDoc, query, where, deleteDoc } from "firebase/firestore";
import { db } from "./lib/firebase.js"; // Import db from Firebase initialization

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
                const usersCollection = collection(db, "review");
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
                return { status: 201,
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
                const docRef = doc(db, "review", reviewId);
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
                return { status: 201,
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
                return { status: 201, message: "Itinerary scheduled successfully!", id: itineraryId,}
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
                return { status: 200, 
                    message: "Itinerary scheduled successfully!",
                    id: itineraryId,
                };
            } catch (error) {
                console.error("Error scheduling itinerary:", error);
                return { status: 500, error: "Internal Server Error" };
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

                return { status: 200, 
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