using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Domain.Entities
{
    public partial class Donation
    {
        [Key]
        public int DonationId { get; set; }

        public string? UserId { get; set; }

        public decimal Amount { get; set; }        private string? _description;
        public string? Description 
        { 
            get => _description ?? string.Empty; 
            set => _description = value; 
        }

        public bool IsAnonymous { get; set; }

        public DateTime CreatedAt { get; set; }

        // Stripe-related properties
        public string? StripePaymentIntentId { get; set; }
        
        public string? StripeChargeId { get; set; }
          // PaymentStatus - NOT NULL in database, should always have a value
        public string PaymentStatus { get; set; } = "pending";
        
        public string? StripeCustomerId { get; set; }
        
        public string? PaymentMethodId { get; set; }

        public virtual User? User { get; set; }
    }
}


