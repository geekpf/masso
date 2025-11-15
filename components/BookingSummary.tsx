
import React from 'react';
import { Booking } from '../types';
import UserIcon from './icons/UserIcon';
import CalendarIcon from './icons/CalendarIcon';
import ClockIcon from './icons/ClockIcon';

interface BookingSummaryProps {
  booking: Booking;
}

const SummaryItem: React.FC<{ icon: React.ReactNode; label: string; value: string | null }> = ({ icon, label, value }) => (
    value ? (
        <div className="flex items-start py-3">
            <div className="text-violet-600 mr-3 mt-1">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-semibold text-gray-800">{value}</p>
            </div>
        </div>
    ) : null
);

const BookingSummary: React.FC<BookingSummaryProps> = ({ booking }) => {
  const { service, professional, date, time } = booking;

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">Resumo da Reserva</h3>
      {service && (
        <>
            <div className="py-3">
                <p className="text-sm text-gray-500">Serviço</p>
                <p className="font-semibold text-xl text-violet-700">{service.name}</p>
                 <div className="flex justify-between items-baseline mt-1 text-gray-600">
                    <span>{service.duration} min</span>
                    <span className="font-bold">
                        R$ {service.price.toFixed(2)}
                    </span>
                </div>
            </div>
            <div className="border-t">
                <SummaryItem icon={<UserIcon />} label="Profissional" value={professional?.name ?? null} />
                {/* Fix: Corrected typo from toLocaleDate'pt-BR' to toLocaleDateString('pt-BR') */}
                <SummaryItem icon={<CalendarIcon />} label="Data" value={date?.toLocaleDateString('pt-BR') ?? null} />
                <SummaryItem icon={<ClockIcon />} label="Horário" value={time} />
            </div>
        </>
      )}
      {!service && <p className="text-gray-500">Selecione um serviço para começar.</p>}
    </div>
  );
};

export default BookingSummary;
