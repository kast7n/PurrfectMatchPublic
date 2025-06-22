

using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities
{
    public partial class Log
    {
        [Key]
        public int LogId { get; set; }

        public string EntityType { get; set; } = null!;

        public string EntityId { get; set; } = null!;

        public string Action { get; set; } = null!;

        public string ChangedByUserId { get; set; } = null!;

        public DateTime ChangeDate { get; set; }

        public string? OldValues { get; set; }

        public string? NewValues { get; set; }

        public string? Details { get; set; }
    }
}


