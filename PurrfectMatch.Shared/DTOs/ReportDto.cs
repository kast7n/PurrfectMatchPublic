namespace PurrfectMatch.Shared.DTOs
{
    public class ReportDto
    {
        public string Title { get; set; } = string.Empty;
        public DateTime GeneratedOn { get; set; }
        public string GeneratedBy { get; set; } = string.Empty;
        public List<Dictionary<string, object>> Data { get; set; } = new List<Dictionary<string, object>>();
    }
}