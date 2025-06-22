namespace PurrfectMatch.Shared.DTOs
{
    public class PetImageDto
    {
        public string FileName { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; }
    }
}