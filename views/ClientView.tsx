import React, { useState } from 'react';
import { Booking, Service, Professional, Client, Availability } from '../types';
import StepIndicator from '../components/StepIndicator';
import ServiceSelector from '../components/ServiceSelector';
import ProfessionalSelector from '../components/ProfessionalSelector';
import DateTimePicker from '../components/DateTimePicker';
import ClientForm from '../components/ClientForm';
import Payment from '../components/Payment';
import Confirmation from '../components/Confirmation';
import BookingSummary from '../components/BookingSummary';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import { generateConfirmationMessage } from '../services/geminiService';

interface ClientViewProps {
  services: Service[];
  professionals: Professional[];
  availability: Availability;
  availableWeekdays: number[];
  onAddBooking: (booking: Omit<Booking, 'status' | 'id'>) => void;
  bookings: Booking[];
}

const initialBookingState: Omit<Booking, 'id' | 'status'> = {
    service: null,
    professional: null,
    date: null,
    time: null,
    client: { name: '', email: '', phone: '' },
};


const ClientView: React.FC<ClientViewProps> = ({ services, professionals, availability, availableWeekdays, onAddBooking, bookings }) => {
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState<Omit<Booking, 'id' | 'status'>>(initialBookingState);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const handleServiceSelect = (service: Service) => {
    setBooking({ ...booking, service });
    setStep(2);
  };

  const handleProfessionalSelect = (professional: Professional) => {
    setBooking({ ...booking, professional, date: null, time: null });
    setStep(3);
  };

  const handleDateTimeSelect = (date: Date, time: string) => {
    setBooking({ ...booking, date, time });
    setStep(4);
  };

  const handleClientInfoSubmit = (client: Client) => {
    setBooking({ ...booking, client });
    setStep(5);
  };

  const handlePaymentConfirm = async () => {
    setIsLoading(true);
    // Create a temporary booking with a dummy status to satisfy the type for the AI function
    const tempBookingForAI: Booking = { ...booking, status: 'pending' };
    try {
      const message = await generateConfirmationMessage(tempBookingForAI);
      setConfirmationMessage(message);
    } catch (error) {
      console.error("Error generating confirmation message:", error);
      setConfirmationMessage("Sua solicitação de reserva foi recebida! Agradecemos por nos escolher. Entraremos em contato em breve para confirmar seu horário.");
    } finally {
      // Simulate payment processing time
      setTimeout(() => {
        setIsLoading(false);
        onAddBooking(booking);
        setStep(6);
      }, 1000);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      // From professional selection, go back to service list
      setBooking({
        ...booking,
        service: null,
        professional: null,
      });
      setStep(1);
    } else if (step > 2) {
      setStep(step - 1);
    }
  };
  
  const handleNewBooking = () => {
    setBooking(initialBookingState);
    setConfirmationMessage('');
    setStep(1);
  }

  const renderStepContent = () => {
    // Re-add dummy status for components that expect the full Booking type
    const fullBooking: Booking = { ...booking, status: 'pending' };
    switch (step) {
      // Step 1 is now the main service list, handled by the main render logic
      case 2:
        return <ProfessionalSelector service={fullBooking.service} professionals={professionals} onSelectProfessional={handleProfessionalSelect} />;
      case 3:
        return <DateTimePicker 
                    onSelectDateTime={handleDateTimeSelect} 
                    availableWeekdays={availableWeekdays} 
                    availability={availability}
                    professional={booking.professional}
                    bookings={bookings}
                />;
      case 4:
        return <ClientForm onSubmit={handleClientInfoSubmit} client={fullBooking.client} />;
      case 5:
        return <Payment booking={fullBooking} onConfirm={handlePaymentConfirm} isLoading={isLoading} />;
      case 6:
        return <Confirmation booking={fullBooking} aiMessage={confirmationMessage} onNewBooking={handleNewBooking} />;
      default:
        return <div>Etapa não encontrada</div>;
    }
  };
  
  const fullBookingForSummary: Booking = { ...booking, status: 'pending' };
  
  // If no service is selected, show the service list as the main page.
  if (!booking.service) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Nossos Serviços</h2>
        <p className="text-center text-gray-600 mb-8">Escolha um de nossos tratamentos e inicie seu agendamento.</p>
        <ServiceSelector 
          services={services} 
          onSelectService={handleServiceSelect} 
        />
      </div>
    );
  }

  // If a service is selected, show the booking flow.
  return (
    <>
      {step > 1 && step < 6 && <StepIndicator currentStep={step} />}

      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8 relative">
        {step > 1 && step < 6 && (
          <button
            onClick={handleBack}
            className="absolute top-6 left-6 flex items-center text-violet-700 hover:text-violet-900 transition-colors"
          >
            <ChevronLeftIcon />
            <span className="ml-1 font-semibold">Voltar</span>
          </button>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-grow lg:w-2/3">{renderStepContent()}</div>
          {step > 1 && step < 6 && booking.service && (
            <aside className="lg:w-1/3 lg:border-l lg:pl-8">
              <BookingSummary booking={fullBookingForSummary} />
            </aside>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientView;