
import React, { useState } from 'react';
import { Service, Professional, Availability, Booking } from './types';
import ClientView from './views/ClientView';
import AdminPanel from './views/AdminPanel';
import Login from './components/Login';
import MassoStoreView from './views/MassoStoreView';
import { SERVICES, PROFESSIONALS, AVAILABILITY, AVAILABLE_WEEKDAYS, INITIAL_BOOKINGS, PRODUCTS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<'client' | 'admin' | 'store'>('client');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  // App state from constants
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [professionals, setProfessionals] = useState<Professional[]>(PROFESSIONALS);
  const [availability, setAvailability] = useState<Availability>(AVAILABILITY);
  const [availableWeekdays, setAvailableWeekdays] = useState<number[]>(AVAILABLE_WEEKDAYS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  
  // --- Auth Handlers ---
  const handleLogin = (user: string, pass: string): boolean => {
    if (user === 'admin' && pass === 'admin123') {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setView('client');
  };
  
  // --- Admin Handlers (local state) ---
  const addService = (service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: Date.now().toString() };
    setServices(prev => [...prev, newService]);
  };
  const updateService = (updatedService: Service) => {
    setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
  };
  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    // Also update professionals who might have been linked to this service
    setProfessionals(prev => prev.map(p => ({
        ...p,
        services: p.services.filter(sId => sId !== id)
    })));
  };

  const addProfessional = (professional: Omit<Professional, 'id'>) => {
    const newProf = { ...professional, id: Date.now().toString() };
    setProfessionals(prev => [...prev, newProf]);
  };
  const updateProfessional = (updatedProfessional: Professional) => {
    setProfessionals(prev => prev.map(p => p.id === updatedProfessional.id ? updatedProfessional : p));
  };
  const deleteProfessional = (id: string) => {
    setProfessionals(prev => prev.filter(p => p.id !== id));
  };
  
  const addTimeSlot = (day: number, time: string) => {
    setAvailability(prev => {
      const daySlots = prev[day] || [];
      if (daySlots.includes(time)) return prev;
      return { ...prev, [day]: [...daySlots, time].sort() };
    });
  };
  const deleteTimeSlot = (day: number, time: string) => {
    setAvailability(prev => {
      const daySlots = prev[day] || [];
      return { ...prev, [day]: daySlots.filter(t => t !== time) };
    });
  };
  const handleSetAvailableWeekdays = (days: number[]) => {
      setAvailableWeekdays(days);
  };

  const handleAddBooking = (booking: Omit<Booking, 'status' | 'id'>) => {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      status: 'pending'
    };
    setBookings(prev => [
        newBooking,
        ...prev
    ].sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0) ));
  };
  
  const acceptBooking = (idToAccept: string) => {
    setBookings(prev => prev.map(b => b.id === idToAccept ? { ...b, status: 'confirmed' } : b));
  };

  const deleteBooking = (idToDelete: string) => {
    setBookings(prevBookings => prevBookings.filter(booking => booking.id !== idToDelete));
  }

  const renderAdminContent = () => {
    if (isAdminAuthenticated) {
      return (
        <AdminPanel 
          services={services}
          professionals={professionals}
          availability={availability}
          availableWeekdays={availableWeekdays}
          bookings={bookings}
          onAddService={addService}
          onUpdateService={updateService}
          onDeleteService={deleteService}
          onAddProfessional={addProfessional}
          onUpdateProfessional={updateProfessional}
          onDeleteProfessional={deleteProfessional}
          onAddTimeSlot={addTimeSlot}
          onDeleteTimeSlot={deleteTimeSlot}
          onSetAvailableWeekdays={handleSetAvailableWeekdays}
          onAcceptBooking={acceptBooking}
          onDeleteBooking={deleteBooking}
        />
      );
    }
    return <Login onLogin={handleLogin} onBackToClient={() => setView('client')} />;
  };
  
  const renderMainContent = () => {
    switch (view) {
      case 'client':
        return (
            <ClientView 
                services={services}
                professionals={professionals}
                availability={availability}
                availableWeekdays={availableWeekdays}
                onAddBooking={handleAddBooking}
                bookings={bookings}
              />
        );
      case 'store':
        return <MassoStoreView products={PRODUCTS} />;
      case 'admin':
         return renderAdminContent();
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen font-sans text-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 relative">
          <h1 className="text-4xl md:text-5xl font-bold text-violet-800">Massoterapia Concept Clínica</h1>
          <p className="text-lg text-gray-600 mt-2">
            {view === 'client' && 'Agende seu momento de bem-estar'}
            {view === 'store' && 'Masso Store: Produtos selecionados para seu cuidado'}
            {view === 'admin' && 'Painel de Administração'}
          </p>
          <div className="absolute top-0 right-0 flex items-center gap-4">
             {view !== 'admin' && (
              <button
                onClick={() => setView(view === 'client' ? 'store' : 'client')}
                className="bg-violet-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-violet-700 transition-colors"
              >
                {view === 'client' ? 'Ir para a Loja' : 'Fazer Agendamento'}
              </button>
            )}
            <button
              onClick={() => {
                if (isAdminAuthenticated) {
                  handleLogout();
                } else {
                  setView('admin');
                }
              }}
              className="bg-gray-200 text-gray-700 text-sm font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {isAdminAuthenticated ? 'Sair' : 'Admin'}
            </button>
          </div>
        </header>
        
        {renderMainContent()}
        
      </div>
    </div>
  );
};

export default App;