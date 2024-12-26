import { addUser, getUser, updateUser } from "./userController.js";
import { URL } from 'url';
import { register, googleSignIn, login, forgotPassword, registerWithAuth } from "./authController.js";
// import { authenticate } from "./authMiddleware.js";
import { upload_audio, upload_img } from "./lib/upload.js";
import { updateDoc, doc, collection, getDocs, addDoc, setDoc, getDoc } from "firebase/firestore";
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

    if (path === '/api/updateUser') {
        try {
            const userData = req.body;
            await updateUser(userData);
            console.log("Data of user updated: ", userData);
            return { status: 200, data: userData };
        } catch (err) {
            console.error(err);
            return { status: 500, message: "Error updating user" };
        }
    }


}