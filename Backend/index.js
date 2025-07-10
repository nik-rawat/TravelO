import dotenv from 'dotenv';
dotenv.config();

import { initializeFirebaseApp } from "./src/lib/firebase.js";
import { razorpay } from "./src/lib/razorpay.js";
import { handler } from "./src/handler.js";
initializeFirebaseApp();

const PORT = process.env.PORT || 3000;

// Import express to create the server
import express from "express";
// Import body-parser to parse incoming request bodies
import bodyParser from 'body-parser';
// Import cors for cross-origin resource sharing
import cors from 'cors';

// Import multer for file upload
import multer from 'multer';
import { createOrder, verifyPayment } from './src/controllers/paymentController.js';
import { addUser, getUser } from './src/controllers/userController.js';
const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Specify the directory to save uploaded files
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname); // Use the original file name
//   }
// });
const upload = multer({
  storage, // Store files in memory
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

const app = express();

// Middleware Setup
app.use(bodyParser.json());
const corsOptions = {
  origin: true, // allow all routes and origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // allow only these methods
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

// GET request
app.get('/', async (req, res) => {
  try {
    const result = await handler(req, res, "GET");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/getUser/:uid', async (req, res) => {
  try {
    const result = await handler(req, res, "GET");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/getPlans', async (req, res) => {
  try {
    const result = await handler(req, res, "GET");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


app.get('/api/getPlaces', async (req, res) => {
  try {
    const result = await handler(req, res, "GET");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/getReviews', async (req, res) => {
  try {
    const result = await handler(req, res, "GET");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/gallery', async (req, res) => {
  try {
    const result = await handler(req, res, "GET");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/getUserReviews/:uid', async (req, res) => {
  try {
    const result = await handler(req, res, "GET");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/getUserPlans/:uid', async (req, res) => {
  try {
    const result = await handler(req, res, "GET");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/getUserBookings/:uid', async (req, res) => {
  try {
    const result = await handler(req, res, "GET");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE request
app.delete('/api/deleteReview/:rid', async (req, res) => {
  try {
    const result = await handler(req, res, "DELETE");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// POST request
app.post('/api/register', async (req, res) => {
  try {
    const result = await handler(req, res, "POST");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const result = await handler(req, res, "POST");
    res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  try {
    const result = await handler(req, res, "POST");
    res.status(result.status).json(result);
    console.log(result);
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// update the user details
app.put('/api/updateUser', async (req, res) => {
  try {
    const result = await handler(req, res, "PUT");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// update the avatar
app.put('/api/updateAvatar', upload.single('avatar'), async (req, res) => {
  try {
    const result = await handler(req, res, "PUT");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.post('/api/add-place', async (req, res) => {
  try {
    const result = await handler(req, res, "POST");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
);
app.post('/api/add-plan',async(req,res)=>{
  try {
    const result = await handler(req, res, "POST");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
})

app.get('/api/getPlan/:planId',async(req,res)=>{
  try {
    const result = await handler(req, res, "GET");
    res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
})

app.get('/api/getPlace/:placeId',async(req,res)=>{
  try {
    const result = await handler(req, res, "GET");
    res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/getPlanReviews/:planId',async(req,res)=>{
  try {
    const result = await handler(req, res, "GET");
    res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/getPlansFromPlace/:placeId',async(req,res)=>{
  try {
    const result = await handler(req, res, "GET");
    res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
})

app.post('/api/like', async (req, res) => {
  try {
    const result = await handler(req, res, "POST");
    res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/api/unlike', async (req, res) => {
  try {
    const result = await handler(req, res, "POST");
    res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/api/add-review', upload.single('file'),async(req,res)=>{
  try {
    const result = await handler(req, res, "POST");
    res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
})

app.post('/api/add-itinerary',async(req,res)=>{
  try {
    const result = await handler(req, res, "POST");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
})

app.delete('/api/remove-itinerary',async(req,res)=>{
  try {
    const result = await handler(req, res, "DELETE");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
})

app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const order = await createOrder(amount, currency);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Error creating order" });
  }
});

app.get('/api/verify-payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    if (!paymentId) {
      return res.status(400).json({ message: "Missing paymentID" });
    }
    const paymentDetails = await verifyPayment(paymentId);
    if (!paymentDetails) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(paymentDetails);
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Error verifying payment" });
  }
});

app.post('/api/book-itinerary',async(req,res)=>{
  try {
    const result = await handler(req, res, "POST");
    res.status( result.status ).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put('/api/complete-itinerary',async(req,res)=>{
  try {
    const result = await handler(req, res, "PUT");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/getItinerary/:uid',async(req,res)=>{
  try {
    const result = await handler(req, res, "GET");
    res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/api/flush', async(req, res) => {
  try {
    const result = await handler(req, res, "POST");
    res.status(result.status).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
})

// AI powered routes

// app.post('/api/getRecommendations', async (req, res) => {
//   try {
//     const result = await handler(req, res, "POST");
//     res.status(result.status).json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// app.post('/api/generate-itinerary', async (req, res) => {
//   try {
//     const result = await handler(req, res, "POST");
//     res.status(result.status).json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

app.post('/api/verify-google-user', async (req, res) => {
  try {
    const userData = req.body;
    
    if (!userData || !userData.uid || !userData.email) {
      return res.status(400).json({ message: "Invalid user data" });
    }
    
    // Check if the user already exists in your database
    const existingUser = await getUser({ uid: userData.uid });
    
    if (!existingUser) {
      // Create a new user record
      const newUserData = {
        uid: userData.uid,
        email: userData.email,
        username: userData.email.split('@')[0], // Basic username from email
        fname: userData.displayName?.split(' ')[0] || '',
        lname: userData.displayName?.split(' ').slice(1).join(' ') || '',
        avatar: userData.photoURL || "https://firebasestorage.googleapis.com/v0/b/travelo-b3a59.appspot.com/o/images%2Fprof.png?alt=media&token=cba32a15-af9b-4256-acbe-2cdb1d0a75b4",
        registeredOn: new Date(),
        age: "",
        gender: "prefer not to say"
      };
      
      await addUser(newUserData);
    }
    
    res.status(200).json({ message: "User verified successfully", uid: userData.uid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error verifying Google user" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});