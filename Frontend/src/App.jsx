import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import RotatingEarth from "./components/rotating-earth/rotating-earth"
import Plans from "./pages/Plans"
import Places from "./pages/Places"
import Reviews from "./pages/Reviews"
import Login from "./pages/Login"
import Register from "./pages/Register" 
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Itinerary from "./pages/Itinerary"
import { useSelector } from "react-redux";
const App = () => {
    const currentUser = useSelector((state) => state.auth.uid);
  

  return (
    <div>
      <Router>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/earth" element={<RotatingEarth />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/places" element={<Places />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              currentUser ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/itinerary"
            element={
              currentUser ? <Itinerary /> : <Navigate to="/login" replace />
            }
          />

          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
