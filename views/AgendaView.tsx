import React, { useState, useMemo } from 'react';
import { Booking, Professional } from '../types';
import { getHolidays } from '../services/holidayService';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';

interface AgendaViewProps {
  bookings: Booking[];
  professionals: Professional[];
}

const AgendaView: React.FC<AgendaViewProps> = ({ bookings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const holidays = useMemo(() => getHolidays(currentDate.getFullYear()), [currentDate]);

  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    // Set to the last Sunday
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  }, [currentDate]);

  const timeSlots = useMemo(() => {
    const slots = [];
    let currentTime = 8 * 60; // Start at 08:00
    const endTime = 20 * 60;   // End at 20:00
    const interval = 60;       // 1 hour in minutes

    while (currentTime < endTime) {
      const hours = Math.floor(currentTime / 60).toString().padStart(2, '0');
      const minutes = (currentTime % 60).toString().padStart(2, '0');
      slots.push(`${hours}:${minutes}`);
      currentTime += interval;
    }
    return slots;
  }, []);

  const getBookingsForSlot = (day: Date, time: string) => {
    return bookings.filter(b => 
        b.date && b.time &&
        b.date.toDateString() === day.toDateString() &&
        b.time === time
    );
  };
  
  const handlePrevWeek = () => {
      setCurrentDate(prev => {
          const newDate = new Date(prev);
          newDate.setDate(newDate.getDate() - 7);
          return newDate;
      });
  };
  
  const handleNextWeek = () => {
      setCurrentDate(prev => {
          const newDate = new Date(prev);
          newDate.setDate(newDate.getDate() + 7);
          return newDate;
      });
  };

  const getWeekDisplayString = () => {
    const start = weekDays[0];
    const end = weekDays[6];
    const startMonth = start.toLocaleString('pt-BR', { month: 'long' });
    const endMonth = end.toLocaleString('pt-BR', { month: 'long' });
    
    if (startMonth === endMonth) {
      return `${start.getDate()} - ${end.getDate()} de ${endMonth} de ${end.getFullYear()}`;
    }
    return `${start.getDate()} de ${startMonth} - ${end.getDate()} de ${endMonth} de ${end.getFullYear()}`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Agenda Semanal</h2>

      <div className="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg border">
        <button onClick={handlePrevWeek} className="p-2 rounded-full hover:bg-gray-200"><ChevronLeftIcon /></button>
        <h3 className="text-lg font-semibold text-violet-700">{getWeekDisplayString()}</h3>
        <button onClick={handleNextWeek} className="p-2 rounded-full hover:bg-gray-200"><ChevronRightIcon /></button>
      </div>

      <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-px bg-gray-200 border border-gray-200">
        {/* Header */}
        <div className="bg-white p-2"></div> {/* Empty corner */}
        {weekDays.map(day => {
            const dateString = day.toISOString().slice(0, 10);
            const holidayName = holidays.get(dateString);
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
                <div key={day.toISOString()} className={`p-2 text-center font-semibold ${holidayName ? 'bg-blue-100 text-blue-800' : 'bg-gray-50'} ${isToday ? 'bg-violet-100 text-violet-800' : ''}`}>
                    <span className="text-sm">{day.toLocaleString('pt-BR', { weekday: 'short' })}</span>
                    <div className="text-lg">{day.getDate()}</div>
                     {holidayName && <div className="text-xs font-normal truncate">{holidayName}</div>}
                </div>
            );
        })}

        {/* Time Slots and Bookings */}
        {timeSlots.map(time => (
          <React.Fragment key={time}>
            <div className="bg-gray-50 p-2 text-center text-sm font-semibold text-gray-600 flex items-center justify-center">
              {time}
            </div>
            {weekDays.map(day => {
              const slotBookings = getBookingsForSlot(day, time);
              return (
                <div key={`${day.toISOString()}-${time}`} className="bg-white p-1 min-h-[80px]">
                    {slotBookings.map(booking => (
                        <div key={booking.id} className="bg-violet-100 border-l-4 border-violet-500 rounded-r-md p-2 text-xs mb-1">
                            <p className="font-bold text-violet-800">{booking.client.name}</p>
                            <p className="text-gray-600">{booking.service?.name}</p>
                            <p className="text-gray-500 text-[10px]">{booking.professional?.name}</p>
                        </div>
                    ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};


const ChevronRightIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);


export default AgendaView;