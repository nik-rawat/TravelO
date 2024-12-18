import { Link } from 'react-router-dom';
const Navbar = () => {
    return (
      <nav className="flex justify-between items-center px-8 py-4 ml-4 mr-4 bg-transparent text-white text-lg font-sans">
        {/* Logo */}
        <div className="font-bold text-lg tracking-wide">
          TravelO
        </div>
  
        {/* Navigation Links */}
        <ul className="flex space-x-4 text-lg items-center">
          <li className="hover:text-gray-300 cursor-pointer transition">Plans</li>
          <li className="hover:text-gray-300 cursor-pointer transition">Places</li>
          <li className="hover:text-gray-300 cursor-pointer transition">Gallery</li>
          <li className="hover:text-gray-300 cursor-pointer transition">Reviews</li>
          <li>
            <button className="bg-white text-black px-3 py-1 rounded-full font-semibold hover:bg-gray-300 transition">
              Enroll
            </button>
          </li>
        </ul>
      </nav>
    );
  };
  
  export default Navbar;
  