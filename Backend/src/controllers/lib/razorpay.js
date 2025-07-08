import Razorpay from "razorpay";
import dotenv from 'dotenv';
dotenv.config();

// Initialize Razorpay with the key ID and secret from environment variables
export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
