import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { Pet, PetFilterDto, CreatePetDto, UpdatePetDto, PetImageDto, PaginatedPetsResponse } from "../../app/models/pet"; // Added PetImageDto

export const petApi = createApi({
  reducerPath: "petApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Pet"],
  endpoints: (builder) => ({    fetchFilteredPets: builder.query<PaginatedPetsResponse, PetFilterDto | undefined>({
      query: (filter) => ({
        url: "pets",
        params: filter || undefined, // Pass undefined if no filter is provided
      }),
      providesTags: ["Pet"],
    }),    fetchPetById: builder.query<Pet, number>({
      query: (id) => ({ url: `pets/${id}` }),
      providesTags: (_, __, id) => [{ type: "Pet", id }],
    }),
    addPet: builder.mutation<Pet, CreatePetDto>({
      query: (newPet) => ({
        url: "pets",
        method: "POST",
        body: newPet,
      }),
      invalidatesTags: ["Pet"],
    }),    updatePet: builder.mutation<Pet, { id: number; updatedPet: UpdatePetDto }>({
      query: ({ id, updatedPet }) => ({
        url: `pets/${id}`,
        method: "PUT",
        body: updatedPet,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Pet", id }],
    }),
    deletePet: builder.mutation<void, number>({
      query: (id) => ({
        url: `pets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Pet", id }],
    }),
    softDeletePet: builder.mutation<void, number>({
      query: (id) => ({
        url: `pets/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Pet", id }],
    }),
    markPetAsAdopted: builder.mutation<Pet, { id: number; isAdopted: boolean }>({
      query: ({ id, isAdopted }) => ({
        url: `pets/${id}`,
        method: "PUT",
        body: { isAdopted },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Pet", id }],
    }),
    importPets: builder.mutation<{ message: string; petIds: number[] }, { file: File; shelterId: number }>({
      query: ({ file, shelterId }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `pets/import?shelterId=${shelterId}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Pet"],
    }),
    uploadPetImage: builder.mutation<PetImageDto, { petId: number; file: File }>({
      query: ({ petId, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `pets/${petId}/images`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { petId }) => [{ type: "Pet", id: petId }],
    }),
    fetchPetImage: builder.query<Blob, { petId: number; photoId: number }>({
      query: ({ petId, photoId }) => ({
        url: `pets/${petId}/images/${photoId}`,
        responseHandler: (response) => response.blob(),
      }),
      providesTags: (_result, _error, { petId }) => [{ type: "Pet", id: petId }],
    }),
    deletePetImage: builder.mutation<void, { petId: number; photoId: number }>({
      query: ({ petId, photoId }) => ({
        url: `pets/${petId}/images/${photoId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { petId }) => [{ type: "Pet", id: petId }],
    }),
  }),
});

export const {
  useFetchFilteredPetsQuery,
  useFetchPetByIdQuery,
  useAddPetMutation,
  useUpdatePetMutation,
  useDeletePetMutation,
  useSoftDeletePetMutation,
  useMarkPetAsAdoptedMutation,
  useImportPetsMutation,
  useUploadPetImageMutation,
  useFetchPetImageQuery,
  useDeletePetImageMutation,
} = petApi;