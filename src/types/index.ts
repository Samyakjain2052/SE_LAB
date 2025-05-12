export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  url: string;
  source: 'amazon' | 'flipkart' | 'other';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface GroupBuy {
  id: string;
  product: Product;
  creator: User;
  participants: GroupParticipant[];
  maxParticipants: number;
  status: 'active' | 'collecting' | 'complete' | 'cancelled';
  createdAt: string;
  expiresAt: string;
  totalAmount: number;
  amountPerPerson: number;
  inviteLink: string;
}

export interface GroupParticipant {
  user: User;
  status: 'invited' | 'joined' | 'paid' | 'confirmed';
  paymentId?: string;
  joinedAt: string;
  paidAt?: string;
}

export interface PaymentInfo {
  id: string;
  userId: string;
  groupId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}