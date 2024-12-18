import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/plans", label: "Plans" },
    { href: "/places", label: "Places" },
    { href: "/gallery", label: "Gallery" },
    { href: "/reviews", label: "Reviews" },
  ];

  return (
    <nav className="flex justify-between items-center px-4 md:px-8 py-4 bg-transparent text-white">
      {/* Logo */}
      <Link to="/" className="font-bold text-lg tracking-wide">
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
        <Link to="/login">
          <Button variant="default" size="sm">
            Login
          </Button>
        </Link>
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
            <Link to="/login">
              <Button className="w-full">Enroll</Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navbar;