export interface HealthRecordDto {
  id: number;
  petId: number;
  recordDate: string; // ISO date string
  description: string;
  documentUrl?: string; // Added: For any associated documents/images
  notes?: string;

  // From C# HealthRecordDto in PurrfectMatch.Shared/DTOs/Pets/HealthRecords/
  // these fields were more specific in the previous version, let's keep them if they exist in C#
  veterinarianName?: string;
  vaccinations?: string; // Consider a more structured type if C# DTO is complex
  medications?: string;  // Consider a more structured type if C# DTO is complex
}

// If you have CreateHealthRecordDto or UpdateHealthRecordDto in C#, define them too:
// export interface CreateHealthRecordDto {
//   petId: number;
//   recordDate: string;
//   description: string;
//   documentUrl?: string;
//   notes?: string;
//   veterinarianName?: string;
//   vaccinations?: string;
//   medications?: string;
// }
