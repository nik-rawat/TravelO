import dotenv from 'dotenv';
dotenv.config();

import { initializeFirebaseApp } from "./src/controllers/lib/firebase.js";
import { handler } from "./src/controllers/handler.js";
initializeFirebaseApp();

const PORT = process.env.PORT || 3000;
import express from "express";
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();

// Middleware Setup
app.use(bodyParser.json());
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

// Routes
app.use('/api', handler);

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

// POST request
app.post('/uploadImg', upload.single('file'), async (req, res) => {
  try {
    const result = await handler(req, res, "POST");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});