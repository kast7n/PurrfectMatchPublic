﻿


using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities
{
    public partial class Review
    {
        [Key]
        public int ReviewId { get; set; }

        public string UserId { get; set; } = null!;

        public int ShelterId { get; set; }

        public int Rating { get; set; }

        public string? Comment { get; set; }

        public DateTime CreatedAt { get; set; }

        public virtual User User { get; set; } = null!;

        public virtual Shelter Shelter { get; set; } = null!;

        
    }
}


