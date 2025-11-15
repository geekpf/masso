import React, { useState, useMemo } from 'react';
import { Availability, Professional, Booking } from '../types';

interface DateTimePickerProps {
  onSelectDateTime: (date: Date, time: string) => void;
  availableWeekdays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  availability: Availability;
  professional: Professional | null;
  bookings: Booking[];
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ onSelectDateTime, availableWeekdays, availability, professional, bookings }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const availableDates = useMemo(() => {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) { // Increased range to 30 days
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (availableWeekdays.includes(date.getDay())) {
        dates.push(date);
      }
    }
    return dates;
  }, [availableWeekdays]);

  const timeSlotsForSelectedDate = useMemo(() => {
      if (!selectedDate || !professional) return [];
      const dayOfWeek = selectedDate.getDay();
      const allSlotsForDay = availability[dayOfWeek] || [];

      // Filter out already booked slots for the selected professional on the selected date
      const bookedSlots = bookings
        .filter(b =>
            b.professional?.id === professional.id &&
            b.date?.toDateString() === selectedDate.toDateString()
        )
        .map(b => b.time);
      
      return allSlotsForDay.filter(slot => !bookedSlots.includes(slot));

  }, [selectedDate, availability, professional, bookings]);

  const handleTimeSelect = (time: string) => {
    if (selectedDate) {
      onSelectDateTime(selectedDate, time);
    }
  };
  
  const formatDate = (date: Date) => {
      // Fix: Corrected typo from toLocaleDate'pt-BR' to toLocaleDateString('pt-BR')
      return date.toLocaleDateString('pt-BR', { weekday: 'short' });
  }
  
  const formatDateNumber = (date: Date) => {
      return date.getDate();
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Escolha a Data e o Horário</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Selecione uma data</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {availableDates.map((date) => (
            <button
              key={date.toISOString()}
              onClick={() => setSelectedDate(date)}
              className={`w-16 h-20 rounded-lg flex flex-col items-center justify-center transition-colors duration-200
                ${selectedDate?.toDateString() === date.toDateString() 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-gray-100 hover:bg-violet-100'
                }`}
            >
              <span className="text-sm font-medium uppercase">{formatDate(date)}</span>
              <span className="text-2xl font-bold">{formatDateNumber(date)}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div>
          {/* Fix: Corrected typo from toLocaleDate'pt-BR' to toLocaleDateString('pt-BR') */}
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Selecione um horário para {selectedDate.toLocaleDateString('pt-BR')}</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-w-md mx-auto">
            {timeSlotsForSelectedDate.length > 0 ? timeSlotsForSelectedDate.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className="bg-violet-500 text-white py-2 px-4 rounded-lg hover:bg-violet-600 transition-colors"
              >
                {time}
              </button>
            )) : <p className="col-span-full text-gray-500">Nenhum horário disponível para este dia.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;