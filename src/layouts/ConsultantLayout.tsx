
import React, { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter, 
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset
} from '@/components/ui/sidebar';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import {
  Home,
  Users,
  Calendar,
  User,
  Settings,
  LogOut
} from 'lucide-react';

interface ConsultantLayoutProps {
  children: ReactNode;
}

const ConsultantLayout = ({ children }: ConsultantLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { toast } = useToast();
  const [activeMenu, setActiveMenu] = useState(location.pathname.split('/')[1] || 'consultant');
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Sessão finalizada",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/login');
  };
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home />, path: '/consultant' },
    { id: 'clients', label: 'Meus Clientes', icon: <Users />, path: '/consultant/clients' },
    { id: 'agenda', label: 'Agenda', icon: <Calendar />, path: '/consultant/agenda' },
  ];
  
  const accountItems = [
    { id: 'profile', label: 'Perfil', icon: <User />, path: '/consultant/profile' },
    { id: 'settings', label: 'Configurações', icon: <Settings />, path: '/consultant/settings' },
  ];
  
  // Get first name from user metadata or use "Consultor" as fallback
  const firstName = user?.user_metadata?.first_name || user?.user_metadata?.full_name?.split(' ')[0] || 'Consultor';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <Sidebar>
          <SidebarHeader>
            <div className="p-4">
              <h2 className="text-xl font-bold text-white">W1 Consultoria</h2>
              <p className="text-sm text-gray-300">Portal do Consultor</p>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={location.pathname === item.path} 
                    onClick={() => {
                      navigate(item.path);
                    }}
                    tooltip={item.label}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            
            <div className="my-4 border-t border-gray-700"></div>
            
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={location.pathname === item.path} 
                    onClick={() => {
                      navigate(item.path);
                    }}
                    tooltip={item.label}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout}
                  tooltip="Sair"
                >
                  <LogOut />
                  <span>Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter>
            <div className="p-4 text-center text-xs text-gray-400">
              W1 Consultoria Patrimonial © 2024
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="p-6">
            {/* Header com destaque para a saudação */}
            <header className="mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Olá, {firstName} 👋</h1>
                    <p className="text-lg text-gray-300">
                      Bem-vindo ao portal de consultores W1
                    </p>
                  </div>
                  <SidebarTrigger />
                </div>
              </div>
            </header>
            
            <main>
              {children}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ConsultantLayout;
