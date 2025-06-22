export interface DonationDto {
  donationId: number;
  userId?: string;
  amount: number;
  description?: string;
  isAnonymous: boolean;
  createdAt: string;
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  paymentStatus: string;
  stripeCustomerId?: string;
  paymentMethodId?: string;
}

export interface CreateDonationDto {
  userId?: string;
  amount: number;
  description?: string;
  isAnonymous: boolean;
}

export interface CreatePaymentIntentDto {
  amount: number;
  currency: string;
  description?: string;
  isAnonymous: boolean;
  userId?: string;
  paymentMethodId?: string;
  automaticPaymentMethods: boolean;
}

export interface PaymentIntentResponseDto {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
  donationId?: number;
}

export interface ConfirmPaymentDto {
  paymentIntentId: string;
  paymentMethodId?: string;
}

// Legacy interface for backward compatibility
export interface LegacyDonationDto {
  id: number;
  donorId?: string;
  donorName?: string;
  amount: number;
  donationDate: string;
  shelterId?: number;
  petId?: number;
  isAnonymous: boolean;
  message?: string;
}
