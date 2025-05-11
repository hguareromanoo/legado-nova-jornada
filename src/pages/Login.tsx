
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Home } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, we'll just mock the login/signup process
    // In a real application, this would connect to a backend service
    
    /* 
    // Future implementation with a database connection:
    
    if (isLogin) {
      // Login logic
      const loginData = {
        email: formData.email,
        password: formData.password
      };
      
      // Example API call
      // const response = await api.post('/auth/login', loginData);
      // if (response.status === 200) {
      //   localStorage.setItem('token', response.data.token);
      //   navigate('/members');
      // }
    } else {
      // Signup logic
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      };
      
      // Example API call
      // const response = await api.post('/auth/register', signupData);
      // if (response.status === 201) {
      //   localStorage.setItem('token', response.data.token);
      //   navigate('/members');
      // }
    }
    */
    
    // For this mock version, we'll just redirect to the members page
    navigate('/members');
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-w1-primary-dark text-w1-text-light">
      {/* Simple header with home button */}
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <a href="/" className="flex items-center text-w1-text-light">
          <Home size={20} className="mr-2" />
          <span className="font-bold">W1 Consultoria</span>
        </a>
      </div>
      
      <div className="w1-container py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">{isLogin ? 'Login' : 'Cadastro'}</h1>
            <p className="text-gray-400 mt-2">
              {isLogin 
                ? 'Acesse sua conta para gerenciar sua holding.' 
                : 'Crie sua conta para iniciar o processo de criação da sua holding.'}
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              {!isLogin && (
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required={!isLogin}
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-w1-primary-accent text-w1-primary-dark hover:opacity-90 mt-6"
              >
                {isLogin ? 'Entrar' : 'Cadastrar'}
              </Button>
            </form>
            
            <div className="text-center mt-6 text-sm">
              <p className="text-gray-400">
                {isLogin ? 'Ainda não tem uma conta?' : 'Já possui uma conta?'}
                <button
                  type="button"
                  onClick={toggleForm}
                  className="text-w1-primary-accent ml-2 hover:underline focus:outline-none"
                >
                  {isLogin ? 'Cadastre-se' : 'Faça login'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
