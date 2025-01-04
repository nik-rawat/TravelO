import { addUser, getUser, updateUser } from "./userController.js";
import { URL } from 'url';
import { register, googleSignIn, login, forgotPassword, registerWithAuth } from "./authController.js";
// import { authenticate } from "./authMiddleware.js";
import { upload_audio, upload_img } from "./lib/upload.js";
import { updateDoc, doc, collection, getDocs, addDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./lib/firebase.js"; // Import db from Firebase initialization
import { promisify } from "util";
import fs from "fs";


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
        
        if (path === "/api/google-signin") {
            try {
            const userData = await googleSignIn();
            console.log("Data of user signed in: ", userData);
            return { status: 200, data: userData };
            } catch (err) {
                console.error(err);
                return { status: 500, message: "Error in Google sign-in" };
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
        if (path === '/api/add-place') {
            try {
                const placeData = req.body; // Get data from the request body
                
                // Validate the data
                if (!placeData.title || !placeData.description) {
                    return res.status(400).json({ error: "Title and description are required." });
                }
        
                // Add data to Firestore
                const placeId = placeData.placeId; // Get the placeID from the data
                const docRef = doc(db, "places", placeId);
        
                // Save data in Firestore
                await setDoc(docRef, placeData);
        
                // Send the success response
                return res.status(201).json({
                    message: "Place added successfully!",
                    id: placeId, // Return the provided placeId
                });
            } catch (error) {
                console.error("Error adding place:", error);
        
                // Send error response
                return res.status(500).json({ error: "Internal Server Error" });
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
    }

    // Handle PUT requests
    if (method === "PUT") {
        if (path === '/api/updateAvatar') {
            try {
                const readFile = promisify(fs.readFile);
                console.log(req.body);
                console.log(req.file);
                const file = req.file;
                if (!file) {
                    console.log('File not found');
                    return { status: 400, message: 'Missing file' };
                }

                const fileBuffer = await readFile(file.path);
                const metadata = {
                    contentType: file.mimetype,
                    filename: file.originalname,
                }
                const avatar = await upload_img(fileBuffer, file.originalname, metadata, "pfp");
                if (!req.body || !req.body.uid) {
                    return { status: 400, message: "Missing uid parameter" };
                }

                const { uid } = req.body; 
                const userDoc = doc(db, "users", uid); // Ensure UID is provided
                await updateDoc(userDoc, { avatar: avatar });
                return { status: 200, message: "image uploaded" };
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
    }

    return { status: 404, message: "Invalid path" };
}