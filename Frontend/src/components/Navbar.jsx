import { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react"; // User icon for avatar
import { useSelector, useDispatch } from "react-redux";
import { clearUid } from "@/redux/authSlice"; // Action to clear uid

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <nav className="flex justify-between items-center px-4 md:px-8 py-4 bg-transparent text-white">
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
            className="hover:text-gray-300 transition"
          >
            {link.label}
          </Link>
        ))}
        {uid ? (
          <>
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <User className="h-6 w-6" />
              </Button>
            </Link>
            <Button variant="default" size="sm" onClick={handleLogout}>
              Logout
            </Button>
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
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="w-full">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  className="w-full"
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
