

export interface EquipmentItem {
  id: string;
  category: 'Maquinaria' | 'Accesorios';
  muscleGroup?: 'Pecho' | 'Espalda' | 'Pierna' | 'Brazo' | 'Hombro' | 'Cardio' | 'Abdomen' | 'Peso Libre' | 'Funcional' | 'General' | 'Barras' | 'Discos' | 'Mancuernas' | 'Bancos' | 'Agarres' | 'Soportes';
  availabilityStatus: 'in-stock' | 'made-to-order';
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  features: string[];
  specifications: { [key: string]: string };
  availableColors?: string[];
  availableWeights?: string[];
  isPromotion?: boolean;
  promotionalPrice?: number;
}

export interface GymPackage {
  id: string;
  name: string;
  items: CartItem[];
  createdAt: string;
  itemsCount?: number; // Helper for display
}

export type OrderStatus = 'Pendiente de Aprobación' | 'Recibido' | 'En Desarrollo' | 'Despachado' | 'En Envío' | 'Entregado';
export type DeliveryStatus = 'pending' | 'shipped' | 'delivered';

export interface OrderStatusHistory {
  status: OrderStatus;
  note?: string;
  date: string;
  updatedBy?: string;
}

export interface OrderItem {
  equipment: EquipmentItem;
  quantity: number;
  price_at_purchase: number | null;
  selectedColor?: string;
  selectedWeight?: string;
  structureColor?: string;
  upholsteryColor?: string;
  deliveryStatus?: DeliveryStatus;
}

export interface CartItem {
  equipment: EquipmentItem;
  quantity: number;
  selectedColor?: string;
  selectedWeight?: string;
  structureColor?: string;
  upholsteryColor?: string;
  cartItemId?: string;
}

export type PaymentMethod = 'standard' | 'production' | 'mixed';

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  statusHistory?: OrderStatusHistory[];
  paymentMethod: PaymentMethod;
  createdAt: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    city: string;
    department: string;
    country: string;
    message?: string;
    mapsLink?: string;
    address?: string;
  };
  productionDetails?: {
    structureColor: string;
    upholsteryColor: string;
  };
  paymentProofUrl?: string;
  financials: {
    totalOrderValue: number;
    amountPaid: number;
    amountPending: number;
  };
  assignedTransporterId?: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'transporter';
  phone?: string;
  address?: string;
  city?: string;
  department?: string;
  country?: string;
  locationUrl?: string;
  password?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string;
}

export interface HeroSlide {
  id: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  imageUrl: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  holderName: string;
  holderId?: string;
}

export type Theme = 'light' | 'dark' | 'auto';
export type SortOrder = 'default' | 'price-asc' | 'price-desc';
export type CategoryFilter = 'Maquinaria' | 'Accesorios';
export type MuscleFilter = 'Todos' | 'Pecho' | 'Espalda' | 'Pierna' | 'Brazo' | 'Hombro' | 'Cardio' | 'Abdomen' | 'Peso Libre' | 'Funcional' | 'Barras' | 'Discos' | 'Mancuernas' | 'Bancos' | 'Agarres' | 'Soportes';

export interface SiteConfig {
  id: string;
  seal_url: string;
  whatsapp_number: string;
  hero_slides: HeroSlide[];
}