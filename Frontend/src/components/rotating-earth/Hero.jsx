import { Html } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate(); // Use the useNavigate hook

  return (
    <Html 
      position={[0, 7, -1]} 
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
      <div className="flex flex-col items-center text-center text-white bg-transparent w-full max-w-md mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <h1 className="uppercase text-white text-3xl sm:text-4xl font-extrabold tracking-wide drop-shadow-[0_2px_2px_rgba(255,255,255,0.2)] font-playfair mb-2 sm:mb-4">
          Travelo
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-white/80 mb-8 max-w-sm leading-relaxed font-inter">
          Explore the World, One Journey at a Time
        </p>
       <button
          onClick={() => navigate('/plans')}
          className="relative overflow-hidden bg-white/5 text-white font-orbitron font-bold text-sm sm:text-base
                    py-2.5 px-6 rounded-full backdrop-blur-lg tracking-wider border border-white/25
                    transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-0.5
                    shadow-[0_0_20px_4px_rgba(255,255,255,0.1)] hover:animate-blackhole-glow"
        >
          START EXPLORING
        </button>



      </div>


    </Html>
  );
};

export default Hero;