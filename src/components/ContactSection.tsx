
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from "sonner";

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Recebemos sua solicitação", {
      description: "Um especialista entrará em contato em breve.",
    });
    
    reset();
    setIsSubmitting(false);
  };

  return (
    <section className="w1-section bg-white" id="contact">
      <div className="w1-container">
        <div className="bg-w1-primary-dark rounded-2xl p-8 md:p-12 shadow-xl overflow-hidden relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-w1-primary-dark to-[#1A2C3E] z-0"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-full lg:w-1/2">
              <h2 className="text-white mb-6">
                Dê o Primeiro Passo
              </h2>
              <p className="text-white/80 mb-8">
                A jornada do seu legado começa aqui. Faça o primeiro movimento em direção a um futuro mais seguro e próspero. 
                A W1 Consultoria Patrimonial está pronta para guiá-lo em cada passo do caminho.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="w1-button-primary">
                  Comece Agora <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-w1-text-dark text-2xl font-semibold mb-6">Fale com um Especialista</h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Input
                    placeholder="Seu nome"
                    className="bg-w1-bg-light border-0"
                    {...register('name', { required: true })}
                  />
                  {errors.name && <span className="text-sm text-red-500">Nome é obrigatório</span>}
                </div>
                
                <div>
                  <Input
                    type="email"
                    placeholder="Seu email"
                    className="bg-w1-bg-light border-0"
                    {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                  />
                  {errors.email && <span className="text-sm text-red-500">Email válido é obrigatório</span>}
                </div>
                
                <div>
                  <Input
                    type="tel"
                    placeholder="Seu telefone"
                    className="bg-w1-bg-light border-0"
                    {...register('phone', { required: true })}
                  />
                  {errors.phone && <span className="text-sm text-red-500">Telefone é obrigatório</span>}
                </div>
                
                <div>
                  <Textarea
                    placeholder="Como podemos ajudar?"
                    className="bg-w1-bg-light border-0 min-h-[100px]"
                    {...register('message')}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-w1-primary-accent text-w1-primary-dark hover:opacity-90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
