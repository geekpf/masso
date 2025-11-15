
import { Service, Professional, Availability, Booking, Product } from './types';

export const SERVICES: Service[] = [
  {
    id: '1',
    name: 'Massagem Relaxante',
    description: 'Uma massagem suave para aliviar o estresse e a tensão muscular.',
    duration: 60,
    price: 150.00,
    pixKey: 'pix.clinica@massoterapia.com',
    imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800&h=600&fit=crop',
  },
  {
    id: '2',
    name: 'Drenagem Linfática',
    description: 'Técnica que estimula o sistema linfático para reduzir o inchaço e eliminar toxinas.',
    duration: 50,
    price: 180.00,
    pixKey: 'pix.clinica@massoterapia.com',
    imageUrl: 'https://images.unsplash.com/photo-1604311753448-0c7b4f2c52a4?q=80&w=800&h=600&fit=crop',
  },
  {
    id: '3',
    name: 'Massagem Terapêutica',
    description: 'Focada em aliviar dores crônicas e pontos de gatilho.',
    duration: 75,
    price: 220.00,
    pixKey: 'pix.clinica@massoterapia.com',
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&h=600&fit=crop',
  },
   {
    id: '4',
    name: 'Massagem Desportiva',
    description: 'Ideal para atletas, ajuda na recuperação muscular e previne lesões.',
    duration: 60,
    price: 200.00,
    pixKey: 'pix.clinica@massoterapia.com',
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd402907?q=80&w=800&h=600&fit=crop',
  },
  {
    id: '5',
    name: 'Masso Relaxa - Plano Mensal',
    description: '4 sessões de Massagem Relaxante com valor especial. Ideal para manter o bem-estar em dia. O valor exibido é por sessão dentro do plano.',
    duration: 60,
    price: 120.00,
    pixKey: 'pix.clinica@massoterapia.com',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&h=600&fit=crop',
  },
];

export const PROFESSIONALS: Professional[] = [
  {
    id: 'p1',
    name: 'Juliana Alves',
    imageUrl: 'https://images.unsplash.com/photo-1558730234-d8b2281b0d2d?q=80&w=256&h=256&fit=crop',
    services: ['1', '2', '5'],
  },
  {
    id: 'p2',
    name: 'Carlos Rocha',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da60710?q=80&w=256&h=256&fit=crop',
    services: ['1', '3', '4', '5'],
  },
  {
    id: 'p3',
    name: 'Beatriz Costa',
    imageUrl: 'https://images.unsplash.com/photo-1614283233556-f35b7c82a1ba?q=80&w=256&h=256&fit=crop',
    services: ['2', '3'],
  },
];

export const AVAILABILITY: Availability = {
  1: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'], // Segunda
  2: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'], // Terça
  3: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'], // Quarta
  4: ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'], // Quinta
  5: ['09:00', '10:00', '11:00', '14:00', '15:00'], // Sexta
};

export const AVAILABLE_WEEKDAYS: number[] = [1, 2, 3, 4, 5]; // Mon to Fri

// Initial bookings can be empty or have some sample data
export const INITIAL_BOOKINGS: Booking[] = [
    {
        id: 'b1',
        service: SERVICES[1],
        professional: PROFESSIONALS[2],
        date: new Date(new Date().setDate(new Date().getDate() + 3)),
        time: '14:00',
        client: { name: 'Ana Silva', email: 'ana.silva@example.com', phone: '(11) 98765-4321' },
        status: 'confirmed',
    },
    {
        id: 'b2',
        service: SERVICES[0],
        professional: PROFESSIONALS[0],
        date: new Date(new Date().setDate(new Date().getDate() + 2)),
        time: '10:00',
        client: { name: 'Roberto Lima', email: 'roberto.lima@example.com', phone: '(21) 91234-5678' },
        status: 'pending',
    }
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod1',
    name: 'Óleo Essencial de Lavanda',
    description: 'Relaxe profundamente com nosso óleo essencial de lavanda pura. Perfeito para aromaterapia e para acalmar a mente.',
    price: 45.00,
    imageUrl: 'https://images.unsplash.com/photo-1620241422171-a88a8d11b3e0?q=80&w=800&h=600&fit=crop',
  },
  {
    id: 'prod2',
    name: 'Creme Hidratante Pós-Massagem',
    description: 'Prolongue a sensação de bem-estar com nosso creme de hidratação profunda, com manteiga de karité e aloe vera.',
    price: 60.00,
    imageUrl: 'https://images.unsplash.com/photo-1580219194998-c25f4908c691?q=80&w=800&h=600&fit=crop',
  },
  {
    id: 'prod3',
    name: 'Rolo de Liberação Miofascial',
    description: 'Alivie a tensão muscular em casa. Ideal para atletas e para quem passa muito tempo sentado. Melhora a circulação.',
    price: 95.00,
    imageUrl: 'https://images.unsplash.com/photo-1590556444823-3d4994522d4c?q=80&w=800&h=600&fit=crop',
  },
  {
    id: 'prod4',
    name: 'Vela Aromática Zen',
    description: 'Crie um ambiente de spa em sua casa. Com notas de sândalo e camomila para um relaxamento completo.',
    price: 55.00,
    imageUrl: 'https://images.unsplash.com/photo-1614036751019-ec9c5a1762c7?q=80&w=800&h=600&fit=crop',
  }
];