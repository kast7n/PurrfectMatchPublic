import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { 
  DonationDto, 
  CreateDonationDto, 
  CreatePaymentIntentDto, 
  PaymentIntentResponseDto, 
  ConfirmPaymentDto,
  LegacyDonationDto 
} from "../../app/models/Donation";

export const donationApi = createApi({
  reducerPath: "donationApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Donations"],
  endpoints: (builder) => ({
    fetchDonations: builder.query<DonationDto[], void>({
      query: () => "donations",
      providesTags: ["Donations"],
    }),
    fetchDonation: builder.query<DonationDto, number>({
      query: (id) => `donations/${id}`,
      providesTags: (_result, _error, arg) => [{ type: "Donations", id: arg }],
    }),
    addDonation: builder.mutation<DonationDto, CreateDonationDto>({
      query: (body) => ({
        url: "donations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Donations"],
    }),
    // Stripe Payment Endpoints
    createPaymentIntent: builder.mutation<PaymentIntentResponseDto, CreatePaymentIntentDto>({
      query: (body) => ({
        url: "donations/create-payment-intent",
        method: "POST",
        body,
      }),
    }),
    confirmPayment: builder.mutation<DonationDto, ConfirmPaymentDto>({
      query: (body) => ({
        url: "donations/confirm-payment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Donations"],
    }),
    getDonationByPaymentIntent: builder.query<DonationDto, string>({
      query: (paymentIntentId) => `donations/payment-intent/${paymentIntentId}`,
      providesTags: (_result, _error, arg) => [{ type: "Donations", id: arg }],
    }),
    // Legacy endpoint for backward compatibility
    addLegacyDonation: builder.mutation<LegacyDonationDto, Partial<LegacyDonationDto>>({
      query: (body) => ({
        url: "donations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Donations"],
    }),
  }),
});

export const {
  useFetchDonationsQuery,
  useFetchDonationQuery,
  useAddDonationMutation,
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
  useGetDonationByPaymentIntentQuery,
  useAddLegacyDonationMutation,
} = donationApi;
