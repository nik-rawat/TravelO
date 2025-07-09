import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, User, PlaneTakeoff, LogOut } from "lucide-react"; // Added LogOut icon
import { useSelector, useDispatch } from "react-redux";
import { clearUid } from "@/redux/authSlice"; // Action to clear uid
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [hasBackground, setHasBackground] = useState(false); // State for background
  const uid = useSelector((state) => state.auth.uid); // Get uid from Redux store
  const dispatch = useDispatch();

  const navLinks = [
    { href: "/plans", label: "Plans" },
    { href: "/places", label: "Places" },
    { href: "/reviews", label: "Reviews" },
  ];

  const handleLogout = () => {
    dispatch(clearUid()); // Clear uid from store
    // Optionally, you can redirect to the login page or home page
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      // Show/hide navbar based on scroll direction
      if (currentScrollPos > prevScrollPos) {
        // Scrolling down
        setIsNavbarVisible(false);
      } else {
        // Scrolling up
        setIsNavbarVisible(true);
      }

      // Add/remove background based on scroll position
      if (currentScrollPos > 0) {
        setHasBackground(true); // Add background when scrolled down
      } else {
        setHasBackground(false); // Remove background at the top
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <nav
      className={`flex justify-between items-center px-4 md:px-8 py-4 text-white fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isNavbarVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        hasBackground ? "bg-black/80 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center font-bold text-lg tracking-wide">
        <img src="/assets/Travelo-white-bg.png" alt="TravelO" className="h-8 mr-4 w-auto rounded" />
        TravelO
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="hover:text-gradient-to-r from-blue-100 to-blue-200 text-white transition ease-out duration-500"
          >
            {link.label}
          </Link>
        ))}
        {uid ? (
          <>
            {/* Itinerary Button - Ocean Blue (Earth's water) */}
            <Link to="/itinerary">
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 
                          text-white border border-cyan-500/30 shadow-lg shadow-cyan-500/20 
                          hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 
                          hover:scale-105 backdrop-blur-sm"
              >
                <PlaneTakeoff className="h-5 w-5" />
              </Button>
            </Link>
            
            {/* Profile Button - Forest Green (Earth's vegetation) */}
            <Link to="/dashboard">
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 
                          text-white border border-emerald-500/30 shadow-lg shadow-emerald-500/20 
                          hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 
                          hover:scale-105 backdrop-blur-sm"
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>
            
            {/* Logout Button - Sunset Red (Earth's sunset) */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 
                        text-white border border-red-500/30 shadow-lg shadow-red-500/20 
                        hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 
                        hover:scale-105 backdrop-blur-sm flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </>
        ) : (
          <Link to="/login">
            <Button 
              variant="ghost" 
              size="sm"
              className="bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900 
                        text-white border border-teal-500/30 shadow-lg shadow-teal-500/20 
                        hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300 
                        hover:scale-105 backdrop-blur-sm"
            >
              Login
            </Button>
          </Link>
        )}
      </div>

      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] bg-slate-900 border-slate-700">
          <DialogTitle className="sr-only">Navigation Menu</DialogTitle>
          <DialogDescription className="sr-only">Access the navigation links and user actions</DialogDescription>
          <div className="flex flex-col space-y-4 pt-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-lg text-white hover:text-blue-300 transition duration-300 p-2 rounded-md hover:bg-slate-800"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {uid ? (
              <>
                {/* Mobile Itinerary Button - Ocean Blue */}
                <Link to="/itinerary" onClick={() => setIsOpen(false)}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 
                              text-white border border-cyan-500/30 shadow-lg shadow-cyan-500/20 
                              hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 
                              flex items-center gap-2"
                  >
                    <PlaneTakeoff className="h-4 w-4" />
                    Itinerary
                  </Button>
                </Link>
                
                {/* Mobile Profile Button - Forest Green */}
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 
                              text-white border border-emerald-500/30 shadow-lg shadow-emerald-500/20 
                              hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 
                              flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                
                {/* Mobile Logout Button - Sunset Red */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 
                            text-white border border-red-500/30 shadow-lg shadow-red-500/20 
                            hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 
                            flex items-center gap-2"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900 
                            text-white border border-teal-500/30 shadow-lg shadow-teal-500/20 
                            hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navbar;