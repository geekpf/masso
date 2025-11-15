
import React from 'react';
import { Service } from '../types';

interface ServiceSelectorProps {
  services: Service[];
  onSelectService: (service: Service) => void;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ services, onSelectService }) => {
  return (
    <div className="text-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length > 0 ? services.map((service) => {
          return (
            <div
              key={service.id}
              className="relative border rounded-lg text-left bg-white transition-shadow duration-300 hover:shadow-xl flex flex-col"
            >
              {service.imageUrl && (
                <img src={service.imageUrl} alt={service.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-violet-800">{service.name}</h3>
                <p className="text-gray-600 mt-2 text-sm flex-grow">{service.description}</p>
                <div className="flex justify-between items-center mt-6">
                  <span className="text-lg font-bold text-violet-600">
                    R$ {service.price.toFixed(2)}
                  </span>
                   <button
                    onClick={() => onSelectService(service)}
                    className="bg-violet-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    Agendar Agora
                  </button>
                </div>
              </div>
            </div>
          );
        }) : (
          <p className="text-gray-500 col-span-full">Nenhum serviço disponível no momento.</p>
        )}
      </div>
    </div>
  );
};

export default ServiceSelector;