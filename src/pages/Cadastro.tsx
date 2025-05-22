
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";

const Cadastro = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error, needsEmailConfirmation } = await signUp(email, password, {
        first_name: firstName,
        last_name: lastName
      });
      
      if (error) {
        toast({
          title: "Erro ao criar conta",
          description: error,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Definir hasSeenWelcome como false para mostrar a tela de boas-vindas
      localStorage.setItem('hasSeenWelcome', 'false');
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: needsEmailConfirmation 
          ? "Por favor, verifique seu email para confirmar seu cadastro."
          : "Redirecionando para o processo de onboarding...",
      });
      
      // Se não precisar de confirmação por email, redirecionar para onboarding
      if (!needsEmailConfirmation) {
        // Definir o passo inicial do onboarding
        localStorage.setItem('onboardingStep', 'selection');
        
        // Redirecionar para a página de onboarding
        navigate('/onboarding');
      }
      
    } catch (error) {
      console.error("Erro ao fazer cadastro:", error);
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      // Implementação da autenticação com Google usando Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/welcome`
        }
      });
      
      if (error) {
        throw error;
      }
      
      // O redirecionamento é feito automaticamente pelo Supabase
      // Nenhum código adicional é necessário aqui
      
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
      toast({
        title: "Erro na autenticação",
        description: "Não foi possível fazer login com Google. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Right Column - 5/12 width */}
      <div className="w-full md:w-5/12 flex items-center justify-center p-6 md:p-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-w1-primary-dark mb-6">
              Crie sua conta W1
            </h2>
            <p className="text-w1-secondary-text">
              Comece a transformar seu planejamento patrimonial hoje
            </p>
          </div>
          
          <AnimatePresence mode="wait">
            {!showEmailForm ? (
              <motion.div 
                key="signup-options"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <Button 
                  variant="outline" 
                  size="w1Base" 
                  className="w-full flex justify-center items-center gap-2"
                  onClick={handleGoogleSignIn}
                >
                  <FcGoogle size={20} />
                  <span>Cadastre-se com Google</span>
                </Button>
                
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">ou</span>
                  </div>
                </div>
                
                <Button 
                  variant="default" 
                  size="w1Base" 
                  className="w-full bg-w1-primary-dark hover:bg-w1-secondary-dark text-white"
                  onClick={() => setShowEmailForm(true)}
                >
                  Continuar com Email
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                key="email-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-2 px-0 text-w1-secondary-text hover:text-w1-primary-dark hover:bg-transparent"
                    onClick={() => setShowEmailForm(false)}
                  >
                    <ArrowLeft size={18} />
                    <span>Voltar às opções</span>
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-w1-primary-dark mb-1">
                      Nome
                    </label>
                    <Input 
                      id="firstName" 
                      type="text" 
                      placeholder="Digite seu nome"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-w1-primary-dark mb-1">
                      Sobrenome
                    </label>
                    <Input 
                      id="lastName" 
                      type="text" 
                      placeholder="Digite seu sobrenome"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-w1-primary-dark mb-1">
                      Email
                    </label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Digite seu email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-w1-primary-dark mb-1">
                      Senha
                    </label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>
                
                  <Button 
                    type="submit"
                    variant="w1Dark" 
                    size="w1Base" 
                    className="w-full mt-6"
                    disabled={loading}
                  >
                    {loading ? 'Cadastrando...' : 'Cadastrar-me'}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Ao criar uma conta, você concorda com os{" "}
              <Link to="/termos" className="text-w1-primary-accent hover:underline">
                Termos de Serviço
              </Link>{" "}
              e{" "}
              <Link to="/privacidade" className="text-w1-primary-accent hover:underline">
                Política de Privacidade
              </Link>
            </p>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-w1-secondary-text">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-w1-primary-accent font-medium hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Left Column - 7/12 width */}
      <div className="hidden md:flex w-7/12 relative">
        {/* Updated background with gradient overlay */}
        <div 
          className="absolute inset-0 z-0" 
          style={{
            background: "linear-gradient(-90deg, rgba(0, 0, 0, 0.00) 10%, #000000 100%), url(https://cdn.sanity.io/images/vtdu2snp/production/4a6d8d90763e58a5c6b3ba43b9394c61592581d1-2436x1152.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "65%"
          }}
        ></div>
        
        {/* Content overlay */}
        <div className="relative z-10 flex flex-col h-full p-10 text-white">
          {/* W1 Logo */}
          <div className="mb-auto">
            <Link to="/" className="text-w1-text-light font-bold text-3xl">
              W1
              <span className="text-w1-primary-accent">.</span>
            </Link>
          </div>
          
          {/* Copywriting */}
          <div className="mb-20">
            <h1 className="text-white text-4xl md:text-5xl font-light leading-tight mb-6">
              Sinta a sensação de <span className="font-bold text-w1-primary-accent">transformar cada um dos seus objetivos em conquistas</span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
