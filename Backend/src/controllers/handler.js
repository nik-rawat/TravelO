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
}