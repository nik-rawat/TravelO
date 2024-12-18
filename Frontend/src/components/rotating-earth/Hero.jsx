import { Html } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate(); // Use the useNavigate hook

  return (
    <Html 
      position={[0, 7, 0]} 
      distanceFactor={4}   
      center  
      style={{
        width: '100vw', 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
      }}
    >
      <div className="text-center text-white bg-transparent p-4 sm:p-0 rounded-lg w-full max-w-md mx-auto font-serif">
        <h1 className="uppercase text-2xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">Travelo</h1>
        <p className="text-sm sm:text-base md:text-lg mb-6 font-sans max-w-sm mx-4 px-4 sm:px-0">
          Explore the World, One Journey at a Time
        </p>
        <button 
          className="bg-white hover:bg-gray-300 font-bold font-sans sm:m-3 text-xs sm:text-sm text-black py-1 sm:py-2 px-2 sm:px-4 rounded-full transition duration-300" 
          onClick={() => navigate('/plans')}
        >
          START EXPLORING
        </button>
      </div>
    </Html>
  );
};

export default Hero;