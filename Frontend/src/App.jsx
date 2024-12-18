import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import RotatingEarth from "./components/rotating-earth/rotating-earth"
import Home from "./pages/Home"
import Plans from "./pages/Plans"
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/earth" element={<RotatingEarth />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App