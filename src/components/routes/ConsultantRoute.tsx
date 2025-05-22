
import { Outlet, Navigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const ConsultantRoute = () => {
  const { isLoggedIn, user } = useUser();
  const [isConsultant, setIsConsultant] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkConsultantRole = async () => {
      if (!isLoggedIn || !user) {
        setIsConsultant(false);
        setLoading(false);
        return;
      }
      
      try {
        // Check if user has consultant or admin role
        const { data, error } = await supabase
          .rpc('has_role', { requested_role: 'consultant' });
        
        if (error) throw error;
        
        if (!data) {
          // Also check for admin role as they can access consultant pages too
          const { data: isAdmin, error: adminError } = await supabase
            .rpc('has_role', { requested_role: 'admin' });
            
          if (adminError) throw adminError;
          
          setIsConsultant(!!isAdmin);
        } else {
          setIsConsultant(true);
        }
      } catch (error) {
        console.error("Error checking consultant role:", error);
        setIsConsultant(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkConsultantRole();
  }, [isLoggedIn, user]);
  
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-pulse text-white">Carregando...</div>
      </div>
    );
  }
  
  // If user is not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is not a consultant, redirect to dashboard
  if (!isConsultant) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Render the consultant dashboard if the user is a consultant
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default ConsultantRoute;
