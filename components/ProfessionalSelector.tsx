import React, { useMemo } from 'react';
import { Service, Professional } from '../types';

interface ProfessionalSelectorProps {
  service: Service | null;
  professionals: Professional[];
  onSelectProfessional: (professional: Professional) => void;
}

const ProfessionalSelector: React.FC<ProfessionalSelectorProps> = ({ service, professionals, onSelectProfessional }) => {
  const availableProfessionals = useMemo(() => {
    if (!service) return [];
    return professionals.filter(p => p.services.includes(service.id));
  }, [service, professionals]);

  if (!service) {
    return <div className="text-center text-red-500">Por favor, selecione um serviço primeiro.</div>;
  }
  
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Escolha o Profissional</h2>
      {availableProfessionals.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-8">
          {availableProfessionals.map((professional) => (
            <div
              key={professional.id}
              onClick={() => onSelectProfessional(professional)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="relative w-32 h-32">
                <img
                  src={professional.imageUrl}
                  alt={professional.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-transparent group-hover:border-violet-500 transition-all duration-300"
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-700 group-hover:text-violet-700">{professional.name}</h3>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-4">Nenhum profissional disponível para este serviço.</p>
      )}
    </div>
  );
};

export default ProfessionalSelector;