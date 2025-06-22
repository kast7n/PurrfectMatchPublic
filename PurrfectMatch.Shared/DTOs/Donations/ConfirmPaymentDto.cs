using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Shared.DTOs.Donations;

public class ConfirmPaymentDto
{
    [Required]
    public string PaymentIntentId { get; set; } = string.Empty;
    
    public string? PaymentMethodId { get; set; }
}
