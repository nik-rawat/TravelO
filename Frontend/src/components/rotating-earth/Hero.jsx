import { Html } from '@react-three/drei';
const Hero = () => {
  return (
    <Html 
      position={[0, 7, 0]}  // Adjust positioning relative to the sphere
      distanceFactor={4}   // Helps with scaling the HTML element
      center  // centers the HTML element
      // adjust the fixed size of the HTML element
      style={
        { 
          width: '100vw', 
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
    >
      <div className="text-center text-white bg-transparent p-4 rounded-lg w-svw font-serif">
        <h1 className="uppercase text-4xl font-bold mb-6">Travelo</h1>
        <p className="text-lg mb-6 font-sans max-w-md mx-auto">Explore the World, One Journey at a Time</p>
        <button className="bg-white hover:bg-gray-300 font-bold font-sans text-sm text-black py-1 px-4 rounded-full transition duration-300" onClick={() => window.location.href = "/plans"}>
          START EXPLORING
        </button>

      </div>
    </Html>
  );
};

export default Hero;