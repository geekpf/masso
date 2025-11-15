
import React from 'react';
import { Booking } from '../types';
import BookingSummary from './BookingSummary';
import SparklesIcon from './icons/SparklesIcon';
import InformationCircleIcon from './icons/InformationCircleIcon';

interface ConfirmationProps {
  booking: Booking;
  aiMessage: string;
  onNewBooking: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({ booking, aiMessage, onNewBooking }) => {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <InformationCircleIcon className="h-10 w-10 text-blue-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-800">Solicitação Recebida!</h2>
      <p className="text-gray-600 mt-2">Sua solicitação de agendamento foi enviada. Você receberá a confirmação da clínica em breve.</p>
      
      <div className="mt-6 bg-violet-50/50 border border-violet-200 rounded-lg p-4 text-violet-800 flex items-start gap-3">
        <SparklesIcon className="w-8 h-8 flex-shrink-0 mt-1"/>
        <p className="text-left">{aiMessage}</p>
      </div>

      <div className="mt-8 text-left border-t pt-6">
        <h3 className="text-xl font-semibold mb-4 text-center">Detalhes da sua Solicitação</h3>
        <BookingSummary booking={booking} />
      </div>

      <button
        onClick={onNewBooking}
        className="mt-8 bg-violet-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-violet-700 transition-colors"
      >
        Fazer Novo Agendamento
      </button>
    </div>
  );
};

export default Confirmation;