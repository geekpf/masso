import React, { useState } from 'react';
import { Service, Professional, Availability, Booking } from '../types';
import ManageServices from '../components/admin/ManageServices';
import ManageProfessionals from '../components/admin/ManageProfessionals';
import ManageAvailability from '../components/admin/ManageAvailability';
import ViewBookings from '../components/admin/ViewBookings';
import AgendaView from './AgendaView';
import CalendarDaysIcon from '../components/icons/CalendarDaysIcon';

type AdminTab = 'bookings' | 'services' | 'professionals' | 'availability' | 'agenda';

interface AdminPanelProps {
  services: Service[];
  professionals: Professional[];
  availability: Availability;
  availableWeekdays: number[];
  bookings: Booking[];
  onAddService: (service: Omit<Service, 'id'>) => void;
  onUpdateService: (service: Service) => void;
  onDeleteService: (id: string) => void;
  onAddProfessional: (professional: Omit<Professional, 'id'>) => void;
  onUpdateProfessional: (professional: Professional) => void;
  onDeleteProfessional: (id: string) => void;
  onAddTimeSlot: (day: number, time: string) => void;
  onDeleteTimeSlot: (day: number, time: string) => void;
  onSetAvailableWeekdays: (days: number[]) => void;
  onAcceptBooking: (id: string) => void;
  onDeleteBooking: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = (props) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('bookings');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'bookings':
        return <ViewBookings bookings={props.bookings} professionals={props.professionals} onAcceptBooking={props.onAcceptBooking} onDeleteBooking={props.onDeleteBooking} />;
      case 'agenda':
        return <AgendaView bookings={props.bookings} professionals={props.professionals} />;
      case 'services':
        return <ManageServices services={props.services} onAdd={props.onAddService} onUpdate={props.onUpdateService} onDelete={props.onDeleteService} />;
      case 'professionals':
        return <ManageProfessionals professionals={props.professionals} services={props.services} onAdd={props.onAddProfessional} onUpdate={props.onUpdateProfessional} onDelete={props.onDeleteProfessional} />;
      case 'availability':
        return <ManageAvailability 
            availability={props.availability} 
            availableWeekdays={props.availableWeekdays}
            onAddTimeSlot={props.onAddTimeSlot}
            onDeleteTimeSlot={props.onDeleteTimeSlot}
            onSetAvailableWeekdays={props.onSetAvailableWeekdays}
        />;
      default:
        return null;
    }
  };

  const TabButton: React.FC<{ tab: AdminTab; label: string; icon?: React.ReactNode }> = ({ tab, label, icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
        activeTab === tab
          ? 'bg-violet-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="flex flex-wrap gap-4 border-b pb-4 mb-6">
        <TabButton tab="bookings" label="Ver Agendamentos" />
        <TabButton tab="agenda" label="Agenda Semanal" icon={<CalendarDaysIcon className="w-5 h-5"/>} />
        <TabButton tab="services" label="Gerenciar Serviços" />
        <TabButton tab="professionals" label="Gerenciar Profissionais" />
        <TabButton tab="availability" label="Gerenciar Disponibilidade" />
      </div>
      <div>{renderTabContent()}</div>
    </div>
  );
};

export default AdminPanel;