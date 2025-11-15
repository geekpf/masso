export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  pixKey?: string;
  imageUrl?: string;
}

export interface Professional {
  id: string;
  name:string;
  imageUrl: string;
  services: string[]; // array of service ids
}

export interface Client {
  name: string;
  email: string;
  phone: string;
}

export interface Booking {
  id?: string;
  service: Service | null;
  professional: Professional | null;
  date: Date | null;
  time: string | null;
  client: Client;
  status: 'pending' | 'confirmed';
}

export type Availability = {
  [key: number]: string[]; // key is weekday (0-6), value is array of times
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}
