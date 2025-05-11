
import { useState, useEffect } from 'react';
import { X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-w1-primary-dark/95 shadow-lg backdrop-blur-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="w1-container flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="text-w1-text-light font-bold text-2xl">W1</a>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" className="text-w1-text-light hover:bg-w1-primary-accent/10">
            Login
          </Button>
          <Button className="bg-w1-primary-accent text-w1-primary-dark hover:opacity-90">
            Cadastro
          </Button>
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-w1-text-light">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-w1-primary-dark/95 backdrop-blur-sm absolute top-full left-0 w-full py-4 shadow-lg">
          <div className="w1-container flex flex-col space-y-4">
            <Button 
              variant="ghost" 
              className="text-w1-text-light hover:bg-w1-primary-accent/10 justify-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Button>
            <Button 
              className="bg-w1-primary-accent text-w1-primary-dark hover:opacity-90 justify-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Cadastro
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
