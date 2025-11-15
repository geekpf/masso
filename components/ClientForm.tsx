import React, { useState } from 'react';
import { Client } from '../types';

interface ClientFormProps {
  onSubmit: (client: Client) => void;
  client: Client;
}

const ClientForm: React.FC<ClientFormProps> = ({ onSubmit, client: initialClient }) => {
  const [client, setClient] = useState<Client>(initialClient);

  const formatPhoneNumber = (value: string) => {
    if (!value) return "";

    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');

    // Limit to 11 digits (DDD + 9 digits)
    const limited = cleaned.slice(0, 11);

    // Apply mask based on length
    if (limited.length > 10) {
      // (XX) XXXXX-XXXX
      return limited.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (limited.length > 6) {
      // (XX) XXXX-XXXX
      return limited.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    if (limited.length > 2) {
      // (XX) XXXX...
      return limited.replace(/(\d{2})(\d+)/, '($1) $2');
    }
    if (limited.length > 0) {
        // (XX
        return `(${limited}`;
    }
    return '';
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
        setClient({ ...client, [name]: formatPhoneNumber(value) });
    } else {
        setClient({ ...client, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(client);
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Suas Informações</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
          <input
            type="text"
            id="name"
            name="name"
            value={client.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={client.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone (WhatsApp)</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={client.phone}
            onChange={handleChange}
            required
            placeholder="(XX) XXXXX-XXXX"
            maxLength={15}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-violet-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-violet-700 transition-colors"
        >
          Continuar para Pagamento
        </button>
      </form>
    </div>
  );
};

export default ClientForm;