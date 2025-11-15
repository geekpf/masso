import React, { useState } from 'react';
import TrashIcon from '../icons/TrashIcon';
import { Availability } from '../../types';

interface ManageAvailabilityProps {
  availability: Availability;
  availableWeekdays: number[];
  onAddTimeSlot: (day: number, time: string) => void;
  onDeleteTimeSlot: (day: number, time: string) => void;
  onSetAvailableWeekdays: (days: number[]) => void;
}

const WEEKDAYS = [
    { label: 'Domingo', value: 0 },
    { label: 'Segunda', value: 1 },
    { label: 'Terça', value: 2 },
    { label: 'Quarta', value: 3 },
    { label: 'Quinta', value: 4 },
    { label: 'Sexta', value: 5 },
    { label: 'Sábado', value: 6 },
];

// Helper component for managing slots for a single day
const DayAvailabilityManager: React.FC<{
    day: number;
    slots: string[];
    onAddTime: (day: number, time: string) => void;
    onDeleteTime: (day: number, time: string) => void;
}> = ({ day, slots, onAddTime, onDeleteTime }) => {
    const [newTime, setNewTime] = useState('');
    const dayLabel = WEEKDAYS.find(d => d.value === day)?.label;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTime.match(/^([01]\d|2[0-3]):([0-5]\d)$/)) {
            onAddTime(day, newTime);
            setNewTime('');
        } else {
            alert('Por favor, insira um horário válido no formato HH:MM.');
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg border">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">{dayLabel}</h4>
            <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
                <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="p-2 border rounded w-full"
                />
                <button type="submit" className="bg-violet-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-violet-700 text-sm">Adicionar</button>
            </form>
             {slots.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                {slots.map(time => (
                    <li key={time} className="flex items-center gap-2 p-2 bg-violet-100 text-violet-800 rounded-md font-medium text-sm">
                    <span>{time}</span>
                    <button onClick={() => onDeleteTime(day, time)} className="text-violet-700 hover:text-violet-900">
                        <TrashIcon className="w-4 h-4" />
                    </button>
                    </li>
                ))}
                </ul>
             ) : (
                <p className="text-sm text-gray-500">Nenhum horário adicionado.</p>
             )}
        </div>
    );
};


const ManageAvailability: React.FC<ManageAvailabilityProps> = ({ availability, availableWeekdays, onAddTimeSlot, onDeleteTimeSlot, onSetAvailableWeekdays }) => {

  const handleWeekdayToggle = (dayValue: number) => {
    const newDays = availableWeekdays.includes(dayValue)
        ? availableWeekdays.filter(d => d !== dayValue)
        : [...availableWeekdays, dayValue];
    onSetAvailableWeekdays(newDays.sort((a,b) => a - b)); // sort for consistent order
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gerenciar Disponibilidade</h2>
      
      {/* Manage Weekdays */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg border">
        <h3 className="text-xl font-semibold mb-4">1. Selecione os Dias de Atendimento</h3>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
            {WEEKDAYS.map(day => (
                 <label key={day.value} className="flex items-center gap-2 cursor-pointer text-base">
                    <input
                    type="checkbox"
                    checked={availableWeekdays.includes(day.value)}
                    onChange={() => handleWeekdayToggle(day.value)}
                    className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    />
                    {day.label}
                </label>
            ))}
        </div>
      </div>
      
      {/* Manage Time Slots per Day */}
      {availableWeekdays.length > 0 && (
          <div className="p-6 bg-gray-50 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">2. Defina os Horários para cada Dia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableWeekdays.map(day => (
                    <DayAvailabilityManager 
                        key={day}
                        day={day}
                        slots={availability[day] || []}
                        onAddTime={onAddTimeSlot}
                        onDeleteTime={onDeleteTimeSlot}
                    />
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default ManageAvailability;