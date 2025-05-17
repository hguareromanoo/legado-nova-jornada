import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, we would validate credentials against a database
    // Here we're just mocking the login
    login({
      id: '1',
      name: 'Usuário de Teste',
      email: email
    });

    toast({
      title: "Login realizado com sucesso",
      description: "Redirecionando...",
    });
    
    // Navigate based on user's onboarding status
    const hasCompletedOnboarding = localStorage.getItem('holdingSetupCompleted') === 'true';
    
    // Navigate to the redirect path or default paths based on onboarding status
    if (hasCompletedOnboarding) {
      navigate('/dashboard');
    } else {
      // Get current step or set to selection as default
      const currentStep = localStorage.getItem('onboardingStep') || 'selection';
      
      // Map steps to routes
      const stepRoutes = {
        'selection': '/onboarding',
        'chat': '/onboarding/chat', 
        'schedule': '/onboarding/schedule',
        'documents': '/document-collection',
        'review': '/document-review'
      };
      
      // Navigate to the appropriate step
      navigate(stepRoutes[currentStep as keyof typeof stepRoutes] || '/document-collection');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, we would create a user in the database
    // Here we're just mocking the signup
    login({
      id: '1',
      name: name,
      email: email
    });
    
    toast({
      title: "Cadastro realizado com sucesso",
      description: "Redirecionando para o processo de onboarding...",
    });

    // Set initial onboarding step and navigate to document collection
    localStorage.setItem('onboardingStep', 'selection');
    navigate('/document-collection');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-bold text-w1-primary-dark">W1 Consultoria</h1>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Bem-vindo</h2>
          <p className="mt-2 text-sm text-gray-600">
            Acesse sua conta para continuar o processo de abertura da sua holding familiar
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <Input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4" />
                  <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Lembrar de mim
                  </Label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-w1-primary-accent hover:text-w1-primary-accent/80">
                    Esqueceu sua senha?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-w1-primary-dark hover:bg-opacity-90 text-white"
              >
                Entrar
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email-signup">Email</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password-signup">Senha</Label>
                  <Input
                    id="password-signup"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                Ao se cadastrar, você concorda com nossos{" "}
                <a href="#" className="text-w1-primary-accent hover:text-w1-primary-accent/80">
                  Termos de Serviço
                </a>{" "}
                e{" "}
                <a href="#" className="text-w1-primary-accent hover:text-w1-primary-accent/80">
                  Política de Privacidade
                </a>
                .
              </div>

              <Button
                type="submit"
                className="w-full bg-w1-primary-dark hover:bg-opacity-90 text-white"
              >
                Cadastrar
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Precisa de ajuda?{" "}
            <a href="#" className="font-medium text-w1-primary-accent hover:text-w1-primary-accent/80">
              Entre em contato
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
