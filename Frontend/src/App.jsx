import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import RotatingEarth from "./components/rotating-earth/rotating-earth"
import Home from "./pages/Home"
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/earth" element={<RotatingEarth />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App