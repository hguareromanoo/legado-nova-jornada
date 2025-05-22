
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-w1-primary-dark text-white py-16">
      <div className="w1-container">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-md">
            <Link to="/" className="text-white font-bold text-2xl mb-6 block">
              W1<span className="text-w1-primary-accent">.</span>
            </Link>
            <p className="text-white/70 mb-6">
              W1 Consultoria Patrimonial - Transformando a gestão de patrimônios em uma arte sofisticada, 
              assegurando proteção, crescimento e transmissão eficiente do seu legado.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-medium mb-4">Navegação</h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-white/70 hover:text-w1-primary-accent transition-colors">Home</Link></li>
                <li><a href="/#about" className="text-white/70 hover:text-w1-primary-accent transition-colors">Sobre nós</a></li>
                <li><a href="/#services" className="text-white/70 hover:text-w1-primary-accent transition-colors">Serviços</a></li>
                <li><a href="/#contact" className="text-white/70 hover:text-w1-primary-accent transition-colors">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Serviços</h4>
              <ul className="space-y-3">
                <li><Link to="/simulation" className="text-white/70 hover:text-w1-primary-accent transition-colors">Simulação de Holding</Link></li>
                <li><a href="#" className="text-white/70 hover:text-w1-primary-accent transition-colors">Planejamento Sucessório</a></li>
                <li><a href="#" className="text-white/70 hover:text-w1-primary-accent transition-colors">Blindagem Patrimonial</a></li>
                <li><a href="#" className="text-white/70 hover:text-w1-primary-accent transition-colors">Gestão de Patrimônio</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Contato</h4>
              <ul className="space-y-3">
                <li className="text-white/70">contato@w1consultoria.com.br</li>
                <li className="text-white/70">+55 (11) 3000-0000</li>
                <li>
                  <a 
                    href="#contact" 
                    className="inline-flex items-center text-w1-primary-accent hover:underline"
                  >
                    Fale com um especialista <ArrowRight className="h-4 w-4 ml-1" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm">© 2024 W1 Consultoria Patrimonial. Todos os direitos reservados.</p>
          
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li><a href="#" className="text-white/50 hover:text-white transition-colors">Termos</a></li>
              <li><a href="#" className="text-white/50 hover:text-white transition-colors">Privacidade</a></li>
              <li><a href="#" className="text-white/50 hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
