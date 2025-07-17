# TravelO - Comprehensive Travel Planning Platform

![TravelO](https://travel-o-sage.vercel.app/assets/Travelo-white-bg.png)

## 🌐 [Live Demo](https://travel-o-sage.vercel.app/) | [GitHub Repository](https://github.com/nik-rawat/travelO)

## Project Overview

TravelO is an integrated travel booking platform designed to simplify the travel planning experience. It provides users with a seamless interface to discover destinations, book accommodations, schedule transportation, and create personalized itineraries—all in one place.

## ✨ Key Features

- **User Authentication System**
  - JWT-based authentication with access & refresh tokens
  - Email verification
  - Google Sign-in integration

- **Destination Discovery**
  - 30+ curated travel destinations
  - Detailed information about each location
  - Categorized travel plans

- **Itinerary Management**
  - Create and manage travel itineraries
  - Track upcoming, ongoing, and past trips
  - Save favorite destinations

- **Review System**
  - Leave reviews with ratings and photos
  - Like and interact with other travelers' reviews
  - Build a community of shared experiences

- **Responsive Design**
  - Fully responsive UI works across all devices
  - Modern, intuitive user interface with animations
  - Seamless navigation between sections

## 🛠️ Technologies Used

### Frontend
- React (with Hooks and Context API)
- Redux for state management
- React Router for navigation
- Framer Motion for animations
- TailwindCSS & ShadCN for styling
- THREE.js & THREE Fiber for 3D effects
- Axios for API communication

### Backend
- Node.js
- Express.js
- RESTful API architecture
- JWT authentication with refresh tokens
- Multer for file uploads

### Database & Storage
- Firebase Firestore
- Firebase Storage for images

### Authentication
- Firebase Authentication
- Custom JWT implementation

### Payment Integration
- RazorPay payment gateway

## 📋 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- RazorPay account (for payment features)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/nik-rawat/travelO.git
   cd travelO
   ```
2. Install dependencies for backend
   ```bash
   cd backend
   npm install
   ```
3. Install dependencies for frontend
   ```bash
   cd ../frontend
   npm install
   ```
4. Set up environment variables

   - Create .env files in both Backend and Frontend folders
   - Backend .env example:
     ```env
     PORT=5000
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     FIREBASE_PROJECT_ID=your_firebase_project_id
     FIREBASE_PRIVATE_KEY=your_firebase_private_key
     FIREBASE_CLIENT_EMAIL=your_firebase_client_email
     ```
   - Frontend .env example:
     ```env
     VITE_API_URL=http://localhost:5000/api
     VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
     VITE_GOOGLE_CLIENT_ID=your_google_client_id
     ```
5. Run the backend server
   ```bash
   cd backend
   npm run dev
   ```
6. Run the frontend development server
   ```bash
   cd frontend
   npm run dev
   ```
7. Open your browser and navigate to http://localhost:5173

## 📷 Screenshots
<img alt="Homepage" src="https://travel-o-sage.vercel.app/assets/screenshot-home.png">
Homepage with destination highlights
<img alt="Plans" src="https://travel-o-sage.vercel.app/assets/screenshot-plans.png">
Travel plans browsing page
<img alt="Itinerary" src="https://travel-o-sage.vercel.app/assets/screenshot-itinerary.png">
Itinerary management interface
<img alt="Reviews" src="https://travel-o-sage.vercel.app/assets/screenshot-reviews.png">
User reviews section

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact
Nikhil Rawat - GitHub - LinkedIn

Project Link: https://github.com/nik-rawat/travelO

Built with ❤️ by Nikhil Rawat