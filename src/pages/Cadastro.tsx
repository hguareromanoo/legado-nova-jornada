
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";

const Cadastro = () => {
  return (
    <div className="min-h-screen w-full flex">
      {/* Left Column - 5/12 width */}
      <div className="hidden md:flex w-5/12 relative bg-w1-primary-dark">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/lovable-uploads/e17d2fac-2689-4bc4-9910-b66fe3145acb.png" 
            alt="W1 Consultoria" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>
        
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
            <h1 className="text-4xl md:text-5xl font-light leading-tight mb-6">
              Sinta a sensação de <span className="font-bold text-w1-primary-accent">transformar cada um dos seus objetivos em conquistas</span>
            </h1>
          </div>
        </div>
      </div>
      
      {/* Right Column - 7/12 width */}
      <div className="w-full md:w-7/12 flex items-center justify-center p-6 md:p-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-w1-primary-dark mb-6">
              Crie sua conta W1
            </h2>
            <p className="text-w1-secondary-text">
              Comece a transformar seu planejamento patrimonial hoje
            </p>
          </div>
          
          <div className="space-y-4">
            <Button 
              variant="outline" 
              size="w1Base" 
              className="w-full flex justify-center items-center gap-2"
            >
              <FcGoogle size={20} />
              <span>Cadastre-se com Google</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="w1Base" 
              className="w-full flex justify-center items-center gap-2"
            >
              <FaMicrosoft size={18} className="text-blue-500" />
              <span>Cadastre-se com Microsoft</span>
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
              className="w-full bg-w1-primary-dark hover:bg-w1-secondary-dark"
            >
              Continuar com Email
            </Button>
          </div>
          
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
    </div>
  );
};

export default Cadastro;
