const Navbar = () => {
    return (
      <nav className="flex justify-between items-center px-4 py-0 bg-transparent text-white text-lg font-sans ml-10">
        {/* Logo */}
        <div className="font-bold text-2xl tracking-wide">
          TravelO
        </div>
  
        {/* Navigation Links */}
        <ul className="flex space-x-4 items-center">
          <li className="hover:text-gray-300 cursor-pointer transition">Plans</li>
          <li className="hover:text-gray-300 cursor-pointer transition">Places</li>
          <li className="hover:text-gray-300 cursor-pointer transition">Gallery</li>
          <li className="hover:text-gray-300 cursor-pointer transition">Reviews</li>
          <li>
            <button className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-300 transition">
              Enroll
            </button>
          </li>
        </ul>
      </nav>
    );
  };
  
  export default Navbar;
  