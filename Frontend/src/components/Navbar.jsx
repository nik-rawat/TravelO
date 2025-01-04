import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, User, PlaneTakeoff } from "lucide-react"; // User icon for avatar
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
    { href: "/gallery", label: "Gallery" },
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
            <Link to="/itinerary">
              <Button variant="primary" size="icon" className="hover:bg-gradient-to-r from-gray-900 to-blue-950 text-white hover:text-white transition ease-out duration-500">
                <PlaneTakeoff className="h-6 w-6" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="primary" size="icon" className="hover:bg-gradient-to-r from-gray-600 to-gray-900 text-white hover:text-white transition ease-out duration-500">
                <User className="h-6 w-6" />
              </Button>
            </Link>
            <Button variant="default" size="sm" onClick={handleLogout}>
              Logout </Button>
          </>
        ) : (
          <Link to="/login">
            <Button variant="default" size="sm">
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
        <SheetContent side="right" className="w-[300px]">
          <DialogTitle className="sr-only">Navigation Menu</DialogTitle> {/* Visually hidden title */}
          <DialogDescription className="sr-only">Access the navigation links and user actions</DialogDescription> {/* Visually hidden description */}
          <div className="flex flex-col space-y-4 pt-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-lg hover:text-primary transition"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {uid ? (
              <>
                <Link to="/itinerary">
                  <Button variant="ghost" size="sm" className="w-full bg-gradient-to-r from-gray-400 to-blue-900 hover:from-blue-800 hover:to-blue-950 transition ease-out duration-500 text-black hover:text-white">
                    Itinerary
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="w-full bg-gradient-to-r from-gray-300 to-gray-500 hover:from-gray-500 hover:to-gray-900 transition ease-out duration-500 text-black hover:text-white">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  className="w-full bg-gradient-to-r from-gray-400 to-red-600 hover:from-red-500 hover:to-red-800 transition ease-out duration-500 text-black hover:text-white"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button className="w-full">Login</Button>
              </Link>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navbar;