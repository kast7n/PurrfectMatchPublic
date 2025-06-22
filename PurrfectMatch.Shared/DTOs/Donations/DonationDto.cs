public class DonationDto
{
    public int DonationId { get; set; }
    public string? UserId { get; set; }
    public decimal Amount { get; set; }
    public string? Description { get; set; }
    public bool IsAnonymous { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? StripePaymentIntentId { get; set; }
    public string? StripeChargeId { get; set; }
    public string PaymentStatus { get; set; } = "pending";
    public string? StripeCustomerId { get; set; }
    public string? PaymentMethodId { get; set; }
}