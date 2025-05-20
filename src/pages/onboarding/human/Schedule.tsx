
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CalendarIcon, Clock, MapPin, Video } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';

// Mock data para consultores
const consultants = [
  {
    id: 1,
    name: 'Dra. Amanda Silva',
    specialty: 'Planejamento Patrimonial',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
    bio: 'Especialista em proteção patrimonial com mais de 10 anos de experiência em consultoria para famílias de alto patrimônio.',
  },
  {
    id: 2,
    name: 'Dr. Ricardo Mendes',
    specialty: 'Sucessão Familiar',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    bio: 'Especializado em planejamento sucessório e estruturação de holdings familiares para preservação de patrimônio entre gerações.',
  },
];

// Horários disponíveis
const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

// Locais para reuniões presenciais
const locations = [
  {
    id: 'sp',
    name: 'São Paulo - Faria Lima',
    address: 'Av. Brigadeiro Faria Lima, 3900, 8º andar',
  },
  {
    id: 'rj',
    name: 'Rio de Janeiro - Centro',
    address: 'Av. Rio Branco, 115, 20º andar',
  },
];

const Schedule = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeStep } = useOnboarding();
  
  const [meetingType, setMeetingType] = useState<'online' | 'presencial'>('online');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [location, setLocation] = useState<string>(locations[0].id);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // O consultor é selecionado com base na data e horário
  const selectedConsultant = consultants[0]; // Padrão para o primeiro consultor neste demo
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !selectedTime) {
      toast({
        title: "Informações incompletas",
        description: "Por favor, selecione uma data e horário para a consulta.",
        variant: "destructive",
      });
      return;
    }
    
    if (!name || !email) {
      toast({
        title: "Informações incompletas",
        description: "Por favor, informe seu nome e email para confirmar o agendamento.",
        variant: "destructive",
      });
      return;
    }
    
    // Salvar informações de agendamento no localStorage para persistência
    const bookingInfo = {
      date: date.toISOString(),
      time: selectedTime,
      type: meetingType,
      location: meetingType === 'presencial' ? locations.find(loc => loc.id === location) : null,
      consultant: selectedConsultant,
      contact: { name, email, phone }
    };
    
    localStorage.setItem('humanConsultationBooking', JSON.stringify(bookingInfo));
    
    // Marcar esta etapa como concluída no fluxo de onboarding
    completeStep('schedule');
    
    // Navegar para página de confirmação
    navigate('/onboarding/human/confirmation');
    
    toast({
      title: "Agendamento realizado!",
      description: `Sua consulta foi agendada para ${format(date, 'PPP', { locale: ptBR })} às ${selectedTime}.`,
    });
  };
  
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    
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
    setPhone(formatPhoneNumber(e.target.value));
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/onboarding')}
        className="flex items-center mb-8 text-gray-600"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para seleção
      </Button>
      
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Agende sua Consulta Personalizada
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Nossa equipe de especialistas está pronta para ajudar na estruturação ideal da sua holding familiar.
          Escolha a modalidade, data e horário que melhor se adequam à sua agenda.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seleção do Tipo de Reunião */}
        <Card>
          <CardHeader>
            <CardTitle>Como você prefere realizar a consulta?</CardTitle>
            <CardDescription>
              Escolha entre uma reunião online ou um encontro presencial em um de nossos escritórios.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={meetingType} 
              onValueChange={(value) => setMeetingType(value as 'online' | 'presencial')}
              className="flex flex-col sm:flex-row gap-6"
            >
              <div className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer ${meetingType === 'online' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <RadioGroupItem value="online" id="online" className="text-blue-600" />
                <Label htmlFor="online" className="flex items-center cursor-pointer">
                  <Video className="h-5 w-5 mr-2 text-blue-600" />
                  <div>
                    <p className="font-medium">Reunião Online</p>
                    <p className="text-sm text-gray-500">Via videoconferência</p>
                  </div>
                </Label>
              </div>
              
              <div className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer ${meetingType === 'presencial' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                <RadioGroupItem value="presencial" id="presencial" className="text-green-600" />
                <Label htmlFor="presencial" className="flex items-center cursor-pointer">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  <div>
                    <p className="font-medium">Reunião Presencial</p>
                    <p className="text-sm text-gray-500">Em um de nossos escritórios</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
            
            {/* Seleção de local (apenas visível para reuniões presenciais) */}
            {meetingType === 'presencial' && (
              <div className="mt-6">
                <Label htmlFor="location" className="block mb-2">
                  Escolha o escritório mais próximo de você:
                </Label>
                <RadioGroup 
                  value={location} 
                  onValueChange={setLocation}
                  className="flex flex-col gap-3 mt-2"
                >
                  {locations.map(loc => (
                    <div key={loc.id} className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer">
                      <RadioGroupItem value={loc.id} id={loc.id} />
                      <Label htmlFor={loc.id} className="cursor-pointer flex-1">
                        <p className="font-medium">{loc.name}</p>
                        <p className="text-sm text-gray-500">{loc.address}</p>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Calendário e Seleção de Horário */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5 text-blue-600" />
                Selecione uma Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                disabled={(date) => {
                  // Desabilitar fins de semana e datas passadas
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
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-600" />
                Horários Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!date ? (
                <p className="text-center py-10 text-gray-500">
                  Selecione uma data para ver os horários disponíveis
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                      className={selectedTime === time ? "bg-blue-600" : ""}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Cartão do Consultor - Exibido apenas após selecionar data e hora */}
        {date && selectedTime && (
          <Card className="border-blue-200 shadow-md">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="text-blue-800">Seu Consultor Especializado</CardTitle>
              <CardDescription>
                Este especialista estará disponível no horário selecionado
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <img 
                    src={selectedConsultant.imageUrl}
                    alt={selectedConsultant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-bold text-lg">{selectedConsultant.name}</h3>
                  <p className="text-blue-600">{selectedConsultant.specialty}</p>
                  <p className="mt-2 text-gray-600 text-sm max-w-md">
                    {selectedConsultant.bio}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Suas Informações */}
        <Card>
          <CardHeader>
            <CardTitle>Suas Informações de Contato</CardTitle>
            <CardDescription>
              Precisamos apenas de informações básicas para confirmar seu agendamento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Seu nome completo"
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
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="seu@email.com"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              type="submit" 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!date || !selectedTime || !name || !email}
            >
              Confirmar Agendamento
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default Schedule;
