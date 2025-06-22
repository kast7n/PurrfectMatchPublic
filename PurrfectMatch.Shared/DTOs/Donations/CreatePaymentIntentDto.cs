using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Shared.DTOs.Donations;

public class CreatePaymentIntentDto
{
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
    public decimal Amount { get; set; }
    
    [Required]
    [StringLength(3, MinimumLength = 3, ErrorMessage = "Currency must be 3 characters")]
    public string Currency { get; set; } = "usd";
    
    public string? Description { get; set; }
    
    public bool IsAnonymous { get; set; }
    
    public string? UserId { get; set; }
    
    public string? PaymentMethodId { get; set; }
    
    public bool AutomaticPaymentMethods { get; set; } = true;
}
