import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import RotatingEarth from "./components/rotating-earth/rotating-earth"
import Plans from "./pages/Plans"
import Places from "./pages/Places"
import Gallery from "./pages/Gallery"
import Reviews from "./pages/Reviews"
import Login from "./pages/Login"
import Register from "./pages/Register" 
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Itinerary from "./pages/Itinerary"
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/earth" element={<RotatingEarth />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/places" element={<Places />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/itinerary" element={<Itinerary />} />

          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
