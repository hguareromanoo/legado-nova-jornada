
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const timeSlots = [
  '9:00', '10:00', '11:00', '14:00', '15:00', '16:00'
];

const ScheduleConsultant = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !timeSlot || !name || !phone || !email) {
      toast({
        title: "Formulário incompleto",
        description: "Por favor, preencha todos os campos para agendar sua consulta.",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would normally send the data to your backend
    // For now, we'll just show a success toast and redirect

    toast({
      title: "Agendamento realizado!",
      description: `Sua consulta foi agendada para ${format(date, 'PPP', { locale: ptBR })} às ${timeSlot}.`,
    });
    
    // Simulate a backend call with setTimeout
    setTimeout(() => {
      navigate('/roadmap-progress');
    }, 2000);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format the phone number
    if (digits.length <= 2) {
      return `(${digits}`;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setPhone(formattedPhone);
  };

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="w1-container max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6 text-w1-primary-dark"
          onClick={() => navigate('/onboarding')}
        >
          <ArrowLeft className="mr-2" /> Voltar
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-w1-primary-dark mb-4">
            Agende sua Consulta com Especialista
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Escolha o melhor dia e horário para conversarmos sobre sua holding familiar.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="text-w1-primary-accent" /> 
                Selecione a Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                disabled={(date) => {
                  // Disable weekends and past dates
                  const day = date.getDay();
                  const isPastDate = date < new Date();
                  const isWeekend = day === 0 || day === 6;
                  return isPastDate || isWeekend;
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="text-w1-primary-accent" /> 
                Horários Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!date ? (
                <p className="text-center text-gray-500 py-8">
                  Selecione uma data para ver os horários disponíveis
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot) => (
                    <Button 
                      key={slot}
                      variant={timeSlot === slot ? "default" : "outline"}
                      className={`${timeSlot === slot ? 'bg-w1-primary-accent text-w1-primary-dark' : ''}`}
                      onClick={() => setTimeSlot(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Separator className="my-10" />

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Seus Dados para Contato</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Digite seu nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    value={phone} 
                    onChange={handlePhoneChange} 
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="seu@email.com"
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-w1-primary-dark text-white hover:bg-opacity-90"
                  disabled={!date || !timeSlot}
                >
                  Confirmar Agendamento
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScheduleConsultant;
