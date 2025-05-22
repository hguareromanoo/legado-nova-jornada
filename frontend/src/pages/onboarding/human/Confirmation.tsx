
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Clock, MapPin, Video, CheckCircle, CalendarPlus, Edit, ArrowRight } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';

interface BookingInfo {
  date: string;
  time: string;
  type: 'online' | 'presencial';
  location: {
    id: string;
    name: string;
    address: string;
  } | null;
  consultant: {
    id: number;
    name: string;
    specialty: string;
    imageUrl: string;
    bio: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
}

const Confirmation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeStep } = useOnboarding();
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  
  // For simulating meeting completion after a certain time 
  // (in real app this would be based on actual meeting completion)
  const [simulateMeetingDone, setSimulateMeetingDone] = useState(false);
  
  useEffect(() => {
    // Retrieve booking info from localStorage
    const storedBooking = localStorage.getItem('humanConsultationBooking');
    
    if (storedBooking) {
      setBookingInfo(JSON.parse(storedBooking));
    } else {
      // If no booking info is found, redirect back to scheduling
      navigate('/onboarding/human/schedule');
      toast({
        title: "Informações não encontradas",
        description: "Por favor, realize o agendamento novamente.",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);
  
  const handleAddToCalendar = () => {
    if (!bookingInfo) return;
    
    // This is a mock function - in production would integrate with calendar APIs
    toast({
      title: "Adicionado ao calendário",
      description: "O evento foi adicionado ao seu calendário.",
    });
  };
  
  const handleReschedule = () => {
    navigate('/onboarding/human/schedule');
  };
  
  const handleContinue = () => {
    // In a real implementation, this would only be available after the meeting
    // Mark the consultation as completed in localStorage
    localStorage.setItem('humanConsultationCompleted', 'true');
    
    // Navigate to the portal
    navigate('/onboarding/human/portal');
  };
  
  // For demo purposes - simulate that meeting has happened after 10s
  // In a real app this would be based on actual meeting completion or consultant confirmation
  useEffect(() => {
    const timer = setTimeout(() => {
      setSimulateMeetingDone(true);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!bookingInfo) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Carregando informações do agendamento...</p>
      </div>
    );
  }
  
  const meetingDate = new Date(bookingInfo.date);
  const formattedDate = format(meetingDate, "PPPP", { locale: ptBR });
  
  // Generate a fake Google Meet link for online meetings
  const meetLink = 'https://meet.google.com/' + 
    Math.random().toString(36).substring(2, 7) + '-' +
    Math.random().toString(36).substring(2, 7) + '-' +
    Math.random().toString(36).substring(2, 7);
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Agendamento Confirmado!
        </h1>
        <p className="text-lg text-gray-600">
          Sua consulta foi agendada com sucesso. Abaixo estão os detalhes da sua reunião.
        </p>
      </div>
      
      <Card className="mb-8 shadow-md border-green-100">
        <CardHeader className="bg-green-50 border-b border-green-100">
          <CardTitle className="flex items-center text-green-800">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Detalhes do Agendamento
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <CalendarIcon className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Data</p>
                <p className="font-medium">{formattedDate}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Horário</p>
                <p className="font-medium">{bookingInfo.time}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-start space-x-3">
            {bookingInfo.type === 'online' ? (
              <Video className="h-5 w-5 text-blue-600 mt-0.5" />
            ) : (
              <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
            )}
            <div>
              <p className="text-sm text-gray-500">Modalidade</p>
              <p className="font-medium">
                {bookingInfo.type === 'online' ? 'Reunião Online' : 'Reunião Presencial'}
              </p>
              {bookingInfo.type === 'online' ? (
                <a 
                  href={meetLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm mt-1 inline-block"
                >
                  {meetLink}
                </a>
              ) : bookingInfo.location && (
                <p className="text-sm">
                  <span className="font-medium">{bookingInfo.location.name}</span> - {bookingInfo.location.address}
                </p>
              )}
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
              <img 
                src={bookingInfo.consultant.imageUrl}
                alt={bookingInfo.consultant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">Seu Consultor</p>
              <p className="font-medium">{bookingInfo.consultant.name}</p>
              <p className="text-sm text-blue-600">{bookingInfo.consultant.specialty}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={handleReschedule} className="flex items-center">
            <Edit className="mr-2 h-4 w-4" />
            Reagendar
          </Button>
          <Button variant="outline" onClick={handleAddToCalendar} className="flex items-center">
            <CalendarPlus className="mr-2 h-4 w-4" />
            Adicionar ao Calendário
          </Button>
        </CardFooter>
      </Card>
      
      {/* Meeting preparation card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Prepare-se para sua consulta</CardTitle>
          <CardDescription>
            Algumas dicas simples para aproveitar ao máximo sua consulta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">O que ter em mãos (opcional)</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 mr-2"></span>
                <span>Uma visão geral dos seus ativos (imóveis, investimentos)</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 mr-2"></span>
                <span>Informações sobre sua família (cônjuge, filhos)</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 mr-2"></span>
                <span>Suas principais preocupações e objetivos patrimoniais</span>
              </li>
            </ul>
            <p className="text-sm italic mt-3 text-blue-600">
              Não se preocupe se não tiver essas informações agora. Seu consultor irá orientá-lo durante a reunião.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Continue button - only enabled after the demo timer or in real app after actual meeting */}
      <div className="text-center">
        <Button 
          onClick={handleContinue} 
          size="lg"
          disabled={!simulateMeetingDone} 
          className="bg-blue-600 hover:bg-blue-700 px-8"
        >
          {simulateMeetingDone ? (
            <>
              Continuar para Portal do Cliente
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          ) : (
            "Aguardando a realização da consulta..."
          )}
        </Button>
        {!simulateMeetingDone && (
          <p className="text-sm text-gray-500 mt-2">
            Este botão será ativado após a realização da sua consulta
          </p>
        )}
      </div>
    </div>
  );
};

export default Confirmation;
