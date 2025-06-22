import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { AddressDto } from "../../app/models/Address";

export const addressApi = createApi({
  reducerPath: "addressApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Addresses"],
  endpoints: (builder) => ({
    fetchAddresses: builder.query<AddressDto[], void>({
      query: () => "addresses",
      providesTags: ["Addresses"],
    }),
    fetchAddress: builder.query<AddressDto, number>({
      query: (id) => `addresses/${id}`,
      providesTags: (_result, _error, arg) => [{ type: "Addresses", id: arg }],
    }),
    addAddress: builder.mutation<AddressDto, Partial<AddressDto>>({
      query: (body) => ({
        url: "addresses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Addresses"],
    }),
    updateAddress: builder.mutation<AddressDto, Partial<AddressDto>>({
      query: (data) => ({
        url: `addresses/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Addresses", id: arg.id }],
    }),
    deleteAddress: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Addresses", id: arg }],
    }),
  }),
});

export const {
  useFetchAddressesQuery,
  useFetchAddressQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
