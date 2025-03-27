import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-10 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Logo />
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
              className={`beautiful-transition text-sm font-medium ${
                location.pathname === item.path
                  ? 'text-google-blue'
                  : 'text-gray-600 hover:text-google-blue'
              }`}
            >
              {item.label}
            </a>
          ))}
          <Button 
            className="bg-google-blue hover:bg-google-blue/90 text-white rounded-full px-6"
            onClick={() => navigate('/dashboard')}
          >
            Try Now
          </Button>
        </nav>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-slideIn">
          <div className="py-4 px-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`py-2 ${
                  location.pathname === item.path
                    ? 'text-google-blue font-medium'
                    : 'text-gray-600'
                }`}
              >
                {item.label}
              </a>
            ))}
            <Button 
              className="bg-google-blue hover:bg-google-blue/90 text-white w-full mt-2 rounded-full"
              onClick={() => {
                navigate('/dashboard');
                setMobileMenuOpen(false);
              }}
            >
              Try Now
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
