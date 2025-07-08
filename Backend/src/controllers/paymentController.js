import { razorpay } from './lib/razorpay.js';

// Function to create a new order
export const createOrder = async (amount, currency = 'INR') => {
    try {
        const options = {
            amount: amount * 100, // Amount in paise
            currency: currency,
            receipt: `receipt_${new Date().getTime()}`,
            payment_capture: 1, // Auto capture the payment
        };
        const response = await razorpay.orders.create(options);
        const orderDetails = {
            order_id: response.id,
            amount: response.amount,
            currency: response.currency,
        }
        return orderDetails;
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        throw error;
    }
}

// Function to verify the payment signature
export const verifyPayment = async (paymentId) => {

    try{
        const payment = await razorpay.payments.fetch(paymentId);
        if (!payment) {
            throw new Error("Payment not found");
        }
        
        return {
            status: payment.status,
            amount: payment.amount,
            currency: payment.currency,
            method: payment.method,
            captured: payment.captured,
            created_at: payment.created_at
        }

    } catch (error) {
        console.error("Error verifying payment:", error);
        throw error; // Rethrow the error for further handling
    }
}