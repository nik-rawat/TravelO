import { Html } from '@react-three/drei';

const Hero = () => {
  return (
    <Html 
      position={[0, 7, 0]}  // Adjust positioning relative to the sphere
      distanceFactor={4}   // Helps with scaling the HTML element
      center          // Centers the content
    >
      <div className="text-center text-white bg-transparent p-4 rounded-lg w-svw font-sans">
        <h1 className="text-4xl font-bold mb-4 font-sans">Travelo</h1>
        <p className="text-xl mb-6 font-sans">From Dreaming to Exploring: We've Got You Covered</p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 font-sans">
          Start Your Adventure
        </button>
      </div>
    </Html>
  );
};

export default Hero;