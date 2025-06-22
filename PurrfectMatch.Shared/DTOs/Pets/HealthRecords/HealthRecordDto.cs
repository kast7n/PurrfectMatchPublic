namespace PurrfectMatch.Shared.DTOs.Pets.HealthRecords
{
    public class HealthRecordDto
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public int PetId { get; set; }
    }
}