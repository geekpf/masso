import React, { useState, useEffect } from 'react';
import { Service } from '../../types';
import TrashIcon from '../icons/TrashIcon';
import PencilIcon from '../icons/PencilIcon';

interface ManageServicesProps {
  services: Service[];
  onAdd: (service: Omit<Service, 'id'>) => void;
  onUpdate: (service: Service) => void;
  onDelete: (id: string) => void;
}

const emptyServiceState = {
    name: '',
    description: '',
    duration: 60,
    price: 150,
    pixKey: '',
    imageUrl: '',
};

const ManageServices: React.FC<ManageServicesProps> = ({ services, onAdd, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState(emptyServiceState);

  useEffect(() => {
    if(isEditing) {
        const serviceToEdit = services.find(s => s.id === isEditing);
        if (serviceToEdit) {
            setServiceForm({
                name: serviceToEdit.name,
                description: serviceToEdit.description,
                duration: serviceToEdit.duration,
                price: serviceToEdit.price,
                pixKey: serviceToEdit.pixKey || '',
                imageUrl: serviceToEdit.imageUrl || '',
            });
        }
    } else {
        setServiceForm(emptyServiceState);
    }
  }, [isEditing, services]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setServiceForm(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (serviceForm.name && serviceForm.description && serviceForm.duration > 0 && serviceForm.price > 0) {
      if(isEditing) {
        onUpdate({ id: isEditing, ...serviceForm });
      } else {
        onAdd(serviceForm);
      }
      cancelEdit();
    } else {
        alert("Por favor, preencha todos os campos obrigatórios (*).");
    }
  };
  
  const startEdit = (service: Service) => {
    setIsEditing(service.id);
  };
  
  const cancelEdit = () => {
    setIsEditing(null);
    setServiceForm(emptyServiceState);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gerenciar Serviços</h2>

      {/* Add/Edit Service Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg border">
        <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Editar Serviço' : 'Adicionar Novo Serviço'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Nome do Serviço*" value={serviceForm.name} onChange={handleInputChange} required className="p-2 border rounded" />
          <input type="text" name="imageUrl" placeholder="URL da Imagem (opcional)" value={serviceForm.imageUrl} onChange={handleInputChange} className="p-2 border rounded" />
          <textarea name="description" placeholder="Descrição*" value={serviceForm.description} onChange={handleInputChange} required className="p-2 border rounded md:col-span-2" />
          <input type="number" name="duration" placeholder="Duração (min)*" value={serviceForm.duration} onChange={handleInputChange} required className="p-2 border rounded" />
          <input type="number" name="price" placeholder="Preço (R$)*" value={serviceForm.price} onChange={handleInputChange} required className="p-2 border rounded" />
          <input type="text" name="pixKey" placeholder="Chave PIX (obrigatório para pagamento)" value={serviceForm.pixKey} onChange={handleInputChange} className="p-2 border rounded md:col-span-2" />
        </div>
        <div className="flex items-center gap-4 mt-4">
            <button type="submit" className="bg-violet-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-violet-700">{isEditing ? 'Salvar Alterações' : 'Adicionar Serviço'}</button>
            {isEditing && <button type="button" onClick={cancelEdit} className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300">Cancelar Edição</button>}
        </div>
      </form>

      {/* Existing Services List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Serviços Existentes</h3>
        <ul className="space-y-3">
          {services.map(service => (
            <li key={service.id} className="flex justify-between items-start p-4 bg-white rounded-lg border">
              <div className="flex items-start gap-4">
                {service.imageUrl && <img src={service.imageUrl} alt={service.name} className="w-16 h-16 rounded object-cover" />}
                <div className="flex-grow">
                  <p className="font-bold">{service.name}</p>
                  <p className="text-sm text-gray-600">{service.duration} min - R$ {service.price.toFixed(2)}</p>
                  {service.pixKey && <p className="text-xs text-gray-500 mt-1">PIX: {service.pixKey}</p>}
                </div>
              </div>
              <div className="flex items-center flex-shrink-0 ml-4">
                <button onClick={() => startEdit(service)} className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50">
                    <PencilIcon />
                </button>
                <button onClick={() => onDelete(service.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50">
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

export default ManageServices;