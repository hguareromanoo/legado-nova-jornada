
import React, { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface PublicLayoutProps {
  children: ReactNode;
  hideNavbar?: boolean;
  hideFooter?: boolean;
}

const PublicLayout = ({ children, hideNavbar = false, hideFooter = false }: PublicLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow pt-16">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default PublicLayout;
