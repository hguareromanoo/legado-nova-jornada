
import { useState, useEffect } from 'react';
import { X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoggedIn, logout } = useUser();

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

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-w1-primary-dark/95 shadow-lg backdrop-blur-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="w1-container flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-w1-text-light font-bold text-2xl">
            W1
            <span className="text-w1-primary-accent">.</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Button 
                variant="ghost" 
                className="text-w1-text-light hover:bg-white/10"
                asChild
              >
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button 
                variant="ghost"
                className="text-w1-text-light hover:bg-white/10"
                onClick={handleLogout}
              >
                Sair
              </Button>
              <Button 
                className="bg-w1-primary-accent text-w1-primary-dark hover:bg-w1-primary-accent-hover"
                asChild
              >
                <Link to="/assets">Meus Ativos</Link>
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                className="text-w1-text-light hover:bg-white/10"
                asChild
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button 
                className="bg-w1-primary-accent text-w1-primary-dark hover:bg-w1-primary-accent-hover"
                asChild
              >
                <Link to="/cadastro">Cadastre-se</Link>
              </Button>
            </>
          )}
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
            {isLoggedIn ? (
              <>
                <Button 
                  variant="ghost" 
                  className="text-w1-text-light hover:bg-white/10 justify-center"
                  onClick={() => setIsMenuOpen(false)}
                  asChild
                >
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-w1-text-light hover:bg-white/10 justify-center"
                  onClick={handleLogout}
                >
                  Sair
                </Button>
                <Button 
                  className="bg-w1-primary-accent text-w1-primary-dark hover:bg-w1-primary-accent-hover justify-center"
                  onClick={() => setIsMenuOpen(false)}
                  asChild
                >
                  <Link to="/assets">Meus Ativos</Link>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-w1-text-light hover:bg-white/10 justify-center"
                  onClick={() => setIsMenuOpen(false)}
                  asChild
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button 
                  className="bg-w1-primary-accent text-w1-primary-dark hover:bg-w1-primary-accent-hover justify-center"
                  onClick={() => setIsMenuOpen(false)}
                  asChild
                >
                  <Link to="/cadastro">Cadastre-se</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
