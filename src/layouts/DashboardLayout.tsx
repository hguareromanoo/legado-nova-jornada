
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
import { Button } from '@/components/ui/button';
import {
  Home,
  FileText,
  BarChart2,
  User,
  Users,
  MessageSquare,
  Settings,
  LogOut
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { toast } = useToast();
  const [activeMenu, setActiveMenu] = useState(location.pathname.split('/')[1] || 'dashboard');
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Sessão finalizada",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/login');
  };
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home />, path: '/dashboard' },
    { id: 'assets', label: 'Ativos', icon: <BarChart2 />, path: '/assets' },
    { id: 'documents', label: 'Documentos', icon: <FileText />, path: '/documents' },
    { id: 'structure', label: 'Estrutura Societária', icon: <Users />, path: '/structure' },
    { id: 'assistant', label: 'Consultor Virtual', icon: <MessageSquare />, path: '/assistant' },
  ];
  
  const accountItems = [
    { id: 'profile', label: 'Perfil', icon: <User />, path: '/profile' },
    { id: 'settings', label: 'Configurações', icon: <Settings />, path: '/settings' },
  ];
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <Sidebar>
          <SidebarHeader>
            <div className="p-4">
              <h2 className="text-xl font-bold text-white">W1 Consultoria</h2>
              <p className="text-sm text-gray-400">Área de Membros</p>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={activeMenu === item.id} 
                    onClick={() => {
                      setActiveMenu(item.id);
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
                    isActive={activeMenu === item.id} 
                    onClick={() => {
                      setActiveMenu(item.id);
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
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold">
                  {menuItems.find(item => item.id === activeMenu)?.label || 'Dashboard'}
                </h1>
                <p className="text-gray-400">
                  {user?.name ? `Bem-vindo, ${user.name.split(' ')[0]}` : 'Bem-vindo à sua holding'}
                </p>
              </div>
              <SidebarTrigger />
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

export default DashboardLayout;
