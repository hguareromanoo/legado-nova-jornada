
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Check if this is likely a redirect from email verification
    const isLikelyEmailVerification = location.search.includes('type=signup') || 
                                     location.pathname.includes('verify') || 
                                     location.search.includes('token=');
                                     
    if (isLikelyEmailVerification) {
      console.log("This appears to be an email verification redirect. Redirecting to login page.");
    }
  }, [location.pathname, location.search]);

  // Check if this is likely a redirect from email verification
  const isLikelyEmailVerification = location.search.includes('type=signup') || 
                                   location.pathname.includes('verify') || 
                                   location.search.includes('token=');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
        {isLikelyEmailVerification ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Email Verificado</h1>
            <p className="text-gray-600 mb-6">
              Seu email foi verificado com sucesso. Por favor, faça login para acessar sua conta.
            </p>
            <Link to="/login" className="px-4 py-2 bg-w1-primary-dark text-white rounded hover:bg-opacity-90">
              Ir para Login
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-4">Oops! Página não encontrada</p>
            <Link to="/" className="text-w1-primary-accent hover:text-w1-primary-accent/80 underline">
              Voltar para a Página Inicial
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NotFound;
