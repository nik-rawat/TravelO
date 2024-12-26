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
    }
    

    // Handle POST requests
    if (method === "POST") {
        
    }


}