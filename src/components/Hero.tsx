
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-w1-primary-dark text-w1-text-light pt-16 overflow-hidden">
      {/* Background video animation */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="object-cover w-full h-full opacity-30"
        >
          <source 
            src="https://cdn.sanity.io/files/vtdu2snp/production/d87a23a4e3797a6c26978cdd2bea561cbe85ec80.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-w1-primary-dark/80 to-w1-primary-dark/40 z-10"></div>
      </div>
      
      <div className="w1-container relative z-20">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-slate-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Protegendo e maximizando seu legado
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 leading-relaxed font-light text-gray-200 px-4 md:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Descubra como a W1 Consultoria Patrimonial transforma a gestão de patrimônios em uma arte sofisticada, assegurando proteção, crescimento e transmissão eficiente do seu legado.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Button 
              size="lg" 
              className="bg-w1-primary-accent hover:bg-w1-primary-accent/90 text-w1-primary-dark text-lg px-8 py-6 h-auto font-semibold" 
              asChild
            >
              <Link to="/simulation">
                Faça simulação de holding
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
          
          <motion.div 
            className="mt-16 text-sm text-gray-400 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 animate-bounce mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            CONTINUE EXPLORANDO
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
