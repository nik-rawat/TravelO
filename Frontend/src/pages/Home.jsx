import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../components/ErrorBoundary";
import React, { Suspense, useState, useEffect } from "react";
const RotatingEarth = React.lazy(() => import("../components/rotating-earth/rotating-earth"));
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import "./Home.css";
import Navbar from "../components/Navbar";

const Home = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) {
      // Trigger any additional actions when loading ends
    }
  }, [loaded]);

  return (
    <div>
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}} >
        <Suspense fallback={
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", background: "black" }}>
            <ClimbingBoxLoader color={"#ffffff"} size={30} className="fade-in" />
            <h1 style={{ color: "white", fontSize: "2rem", fontWeight: "bold", marginTop: "40px" }} className="fade-in">Get. Set. Travelo.</h1>
          </div>
        }>
          <RotatingEarth onLoaded={() => setLoaded(true)} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Home;