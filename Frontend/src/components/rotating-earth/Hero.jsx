import { Html } from '@react-three/drei';
import Navbar from '../Navbar';
const Hero = () => {
  return (
    <Html 
      position={[0, 7, 0]}  // Adjust positioning relative to the sphere
      distanceFactor={4}   // Helps with scaling the HTML element
      center          // Centers the content
    >
      <header className="flex w-1/5 px-0 py-0 bg-transparent text-white font-sans">
        <Navbar />
      </header>
      <div className="text-center text-white bg-transparent p-4 rounded-lg w-svw font-serif">
        <h1 className="uppercase text-6xl font-bold mb-6">Travelo</h1>
        <p className="text-lg mb-6 font-sans max-w-md mx-auto">Explore the World, One Journey at a Time</p>
        <button className="bg-white hover:bg-gray-300 font-bold font-sans text-sm text-black py-2 px-8 rounded-full transition duration-300" onClick={() => window.location.href = "/plans"}>
          START EXPLORING
        </button>
      </div>
    </Html>
  );
};

export default Hero;