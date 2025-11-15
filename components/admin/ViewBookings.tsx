
import React, { useState, useMemo } from 'react';
import { Booking, Professional } from '../../types';
import MailIcon from '../icons/MailIcon';
import PhoneIcon from '../icons/PhoneIcon';
import UserIcon from '../icons/UserIcon';
import CalendarIcon from '../icons/CalendarIcon';
import ClockIcon from '../icons/ClockIcon';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import XCircleIcon from '../icons/XCircleIcon';
import Modal from '../Modal';

interface ViewBookingsProps {
  bookings: Booking[];
  professionals: Professional[];
  onAcceptBooking: (id: string) => void;
  onDeleteBooking: (id: string) => void;
}

const BookingCard: React.FC<{ booking: Booking, onAccept?: (id: string) => void, onDeleteRequest: (booking: Booking) => void }> = ({ booking, onAccept, onDeleteRequest }) => {
    const isPending = booking.status === 'pending';
    
    return (
        <div className={`p-5 bg-white rounded-lg border-2 ${isPending ? 'border-yellow-400' : 'border-gray-200'} shadow-sm flex flex-col sm:flex-row justify-between sm:items-start`}>
          <div className="flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Client Info */}
                <div className="md:col-span-1">
                  <h3 className="font-bold text-lg text-gray-800">{booking.client.name}</h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <MailIcon className="w-4 h-4" />
                    <span>{booking.client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <PhoneIcon className="w-4 h-4" />
                    <span>{booking.client.phone}</span>
                  </div>
                </div>
                {/* Booking Details */}
                <div className="md:col-span-2 border-t md:border-t-0 md:border-l md:pl-4 pt-4 md:pt-0">
                  <p className="font-semibold text-violet-700 text-lg">{booking.service?.name}</p>
                   <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{booking.date?.toLocaleDateString('pt-BR')}</span>
                      </div>
                       <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        <span>{booking.professional?.name}</span>
                      </div>
                   </div>
                </div>
              </div>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0 flex sm:flex-col gap-2">
             {isPending && onAccept && (
                <button 
                    onClick={() => onAccept(booking.id!)}
                    className="flex items-center w-full justify-center gap-2 text-sm text-green-700 font-semibold py-2 px-3 rounded-lg bg-green-100 hover:bg-green-200 transition-colors"
                >
                    <CheckCircleIcon className="w-5 h-5" />
                    Aceitar
                </button>
             )}
              <button 
                onClick={() => onDeleteRequest(booking)}
                className="flex items-center w-full justify-center gap-2 text-sm text-red-700 font-semibold py-2 px-3 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
              >
                <XCircleIcon className="w-5 h-5" />
                {isPending ? 'Rejeitar' : 'Cancelar'}
              </button>
          </div>
        </div>
    );
};

const ViewBookings: React.FC<ViewBookingsProps> = ({ bookings, professionals, onAcceptBooking, onDeleteBooking }) => {
  const [filterDate, setFilterDate] = useState('');
  const [filterProfessional, setFilterProfessional] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

  const { pendingBookings, confirmedBookings } = useMemo(() => {
    const filtered = bookings.filter(booking => {
      if (!booking.date || !booking.professional || !booking.client) return false;
      const dateMatch = !filterDate || (booking.date.toISOString().slice(0, 10) === filterDate);
      const professionalMatch = !filterProfessional || (booking.professional.id === filterProfessional);
      return dateMatch && professionalMatch;
    });

    return {
      pendingBookings: filtered.filter(b => b.status === 'pending'),
      confirmedBookings: filtered.filter(b => b.status === 'confirmed'),
    };
  }, [bookings, filterDate, filterProfessional]);

  const handleCancelRequest = (booking: Booking) => {
    setBookingToCancel(booking);
    setIsModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (bookingToCancel?.id) {
      onDeleteBooking(bookingToCancel.id);
    }
    setIsModalOpen(false);
    setBookingToCancel(null);
  };

  const clearFilters = () => {
    setFilterDate('');
    setFilterProfessional('');
  };

  const isPendingAction = bookingToCancel?.status === 'pending';

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Agendamentos</h2>

      {/* Filters */}
      <div className="p-4 bg-gray-50 rounded-lg border mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700">Filtrar por Data</label>
          <input
            type="date"
            id="date-filter"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="mt-1 block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label htmlFor="prof-filter" className="block text-sm font-medium text-gray-700">Filtrar por Profissional</label>
          <select
            id="prof-filter"
            value={filterProfessional}
            onChange={(e) => setFilterProfessional(e.target.value)}
            className="mt-1 block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm p-2"
          >
            <option value="">Todos</option>
            {professionals.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={clearFilters}
          className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors text-sm font-semibold"
        >
          Limpar Filtros
        </button>
      </div>

      {/* Bookings Lists */}
      <div className="space-y-8">
        {/* Pending Bookings */}
        <div>
            <h3 className="text-xl font-semibold mb-4 text-yellow-700">Agendamentos Pendentes ({pendingBookings.length})</h3>
            <div className="space-y-4">
                {pendingBookings.length > 0 ? (
                    pendingBookings.map(booking => <BookingCard key={booking.id} booking={booking} onAccept={onAcceptBooking} onDeleteRequest={handleCancelRequest} />)
                ) : <p className="text-gray-500 text-sm">Nenhum agendamento pendente.</p>}
            </div>
        </div>
        {/* Confirmed Bookings */}
        <div>
            <h3 className="text-xl font-semibold mb-4 text-green-700">Agendamentos Confirmados ({confirmedBookings.length})</h3>
             <div className="space-y-4">
                {confirmedBookings.length > 0 ? (
                    confirmedBookings.map(booking => <BookingCard key={booking.id} booking={booking} onDeleteRequest={handleCancelRequest} />)
                ) : <p className="text-gray-500 text-sm">Nenhum agendamento confirmado.</p>}
            </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title={isPendingAction ? 'Confirmar Rejeição' : 'Confirmar Cancelamento'}
        confirmButtonText={isPendingAction ? 'Sim, Rejeitar' : 'Sim, Cancelar'}
        cancelButtonText={isPendingAction ? 'Não, Manter' : 'Não'}
      >
        <p>Você tem certeza que deseja <span className="font-semibold">{isPendingAction ? 'rejeitar' : 'cancelar'}</span> este agendamento? Esta ação é permanente e não pode ser desfeita.</p>
        {bookingToCancel && (
            <div className="mt-4 p-3 bg-gray-100 rounded-md border text-sm">
                <p><span className="font-semibold">Cliente:</span> {bookingToCancel.client.name}</p>
                <p><span className="font-semibold">Serviço:</span> {bookingToCancel.service?.name}</p>
                <p><span className="font-semibold">Data:</span> {bookingToCancel.date?.toLocaleDateString('pt-BR')} às {bookingToCancel.time}</p>
            </div>
        )}
      </Modal>

    </div>
  );
};

export default ViewBookings;
