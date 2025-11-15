
import React, { useState, useEffect } from 'react';
import { Professional, Service } from '../../types';
import TrashIcon from '../icons/TrashIcon';
import PencilIcon from '../icons/PencilIcon';

interface ManageProfessionalsProps {
  professionals: Professional[];
  services: Service[];
  onAdd: (professional: Omit<Professional, 'id'>) => void;
  onUpdate: (professional: Professional) => void;
  onDelete: (id: string) => void;
}

const emptyProfState = {
    name: '',
    imageUrl: '',
    services: [] as string[],
};

const ManageProfessionals: React.FC<ManageProfessionalsProps> = ({ professionals, services, onAdd, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [profForm, setProfForm] = useState(emptyProfState);

  useEffect(() => {
    if(isEditing) {
        const profToEdit = professionals.find(p => p.id === isEditing);
        if(profToEdit) {
            setProfForm(profToEdit);
        }
    } else {
        setProfForm(emptyProfState);
    }
  }, [isEditing, professionals]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfForm(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setProfForm(prev => {
      const currentServices = prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId];
      return { ...prev, services: currentServices };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(profForm.name && profForm.imageUrl && profForm.services.length > 0) {
        if (isEditing) {
            onUpdate({ id: isEditing, ...profForm });
        } else {
            onAdd(profForm);
        }
        cancelEdit();
    } else {
        alert("Por favor, preencha todos os campos e selecione ao menos um serviço.");
    }
  };
  
  const startEdit = (prof: Professional) => {
      setIsEditing(prof.id);
  };
  
  const cancelEdit = () => {
      setIsEditing(null);
      setProfForm(emptyProfState);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gerenciar Profissionais</h2>

      {/* Add/Edit Professional Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg border">
        <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Editar Profissional' : 'Adicionar Novo Profissional'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Nome do Profissional" value={profForm.name} onChange={handleInputChange} required className="p-2 border rounded" />
          <input type="text" name="imageUrl" placeholder="URL da Imagem" value={profForm.imageUrl} onChange={handleInputChange} required className="p-2 border rounded" />
        </div>
        <div className="mt-4">
          <h4 className="font-semibold">Serviços Oferecidos:</h4>
          <div className="flex flex-wrap gap-4 mt-2">
            {services.map(service => (
              <label key={service.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={profForm.services.includes(service.id)}
                  onChange={() => handleServiceToggle(service.id)}
                  className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                />
                {service.name}
              </label>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4">
            <button type="submit" className="bg-violet-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-violet-700">{isEditing ? 'Salvar Alterações' : 'Adicionar Profissional'}</button>
            {isEditing && <button type="button" onClick={cancelEdit} className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300">Cancelar Edição</button>}
        </div>
      </form>

      {/* Existing Professionals List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Profissionais Existentes</h3>
        <ul className="space-y-3">
          {professionals.map(prof => (
            <li key={prof.id} className="flex justify-between items-center p-4 bg-white rounded-lg border">
              <div className="flex items-center gap-4">
                <img src={prof.imageUrl} alt={prof.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                    <p className="font-bold">{prof.name}</p>
                    <p className="text-xs text-gray-500">{prof.services.map(sId => services.find(s => s.id === sId)?.name).join(', ')}</p>
                </div>
              </div>
              <div className="flex items-center">
                 <button onClick={() => startEdit(prof)} className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50">
                    <PencilIcon />
                </button>
                <button onClick={() => onDelete(prof.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50">
                    <TrashIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageProfessionals;