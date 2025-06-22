using PurrfectMatch.Shared.DTOs.Donations;
using Stripe;

namespace PurrfectMatch.Application.Interfaces;

public interface IStripeService
{
    Task<PaymentIntentResponseDto> CreatePaymentIntentAsync(CreatePaymentIntentDto request);
    Task<PaymentIntent> ConfirmPaymentIntentAsync(string paymentIntentId, string? paymentMethodId = null);
    Task<PaymentIntent> GetPaymentIntentAsync(string paymentIntentId);
    Task<PaymentIntent> CancelPaymentIntentAsync(string paymentIntentId);
    Task<Customer?> CreateOrGetCustomerAsync(string email, string? userId = null);
    Task<IEnumerable<PaymentMethod>> GetCustomerPaymentMethodsAsync(string customerId);
}
