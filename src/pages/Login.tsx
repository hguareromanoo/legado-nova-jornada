
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailConfirmationAlert, setShowEmailConfirmationAlert] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await login(email, password);
      
      if (error) {
        toast({
          title: "Erro ao fazer login",
          description: error,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Definir hasSeenWelcome como false para mostrar a tela de boas-vindas
      localStorage.setItem('hasSeenWelcome', 'false');
      
      toast({
        title: "Login realizado com sucesso",
        description: "Redirecionando...",
      });
      
      // O redirecionamento será feito automaticamente pelo PublicRoute
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const redirectToSignUp = () => {
    navigate('/cadastro');
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

        {showEmailConfirmationAlert && (
          <Alert className="bg-amber-50 border-amber-300 text-amber-800 mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Um email de confirmação foi enviado para seu endereço. 
              Por favor, verifique sua caixa de entrada e confirme seu email antes de fazer login.
            </AlertDescription>
          </Alert>
        )}

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
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-w1-primary-accent hover:text-w1-primary-accent/80"
              onClick={redirectToSignUp}
            >
              Cadastre-se
            </Button>
          </p>
        </div>

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
