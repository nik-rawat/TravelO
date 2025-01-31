import dotenv from 'dotenv';
dotenv.config();

import { initializeFirebaseApp } from "./src/controllers/lib/firebase.js";
import { handler } from "./src/controllers/handler.js";
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
app.use(cors({ origin: true }));
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
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
})

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

app.put('/api/book-itinerary',async(req,res)=>{
  try {
    const result = await handler(req, res, "PUT");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
})

app.put('/api/complete-itinerary',async(req,res)=>{
  try {
    const result = await handler(req, res, "PUT");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
})

app.get('/api/getItinerary/:uid',async(req,res)=>{
  try {
    const result = await handler(req, res, "GET");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
})
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});