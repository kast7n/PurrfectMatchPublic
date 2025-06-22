using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PurrfectMatch.Application.Interfaces;
using PurrfectMatch.Shared.DTOs.Donations;
using Stripe;

namespace PurrfectMatch.Infrastructure.Services;

public class StripeService : IStripeService
{
    private readonly ILogger<StripeService> _logger;
    private readonly PaymentIntentService _paymentIntentService;
    private readonly CustomerService _customerService;
    private readonly PaymentMethodService _paymentMethodService;

    public StripeService(IConfiguration configuration, ILogger<StripeService> logger)
    {
        _logger = logger;
        StripeConfiguration.ApiKey = configuration["Stripe:SecretKey"];
        
        _paymentIntentService = new PaymentIntentService();
        _customerService = new CustomerService();
        _paymentMethodService = new PaymentMethodService();
    }

    public async Task<PaymentIntentResponseDto> CreatePaymentIntentAsync(CreatePaymentIntentDto request)
    {
        try
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(request.Amount * 100), // Convert dollars to cents
                Currency = request.Currency.ToLower(),
                Description = request.Description,
                Metadata = new Dictionary<string, string>
                {
                    { "user_id", request.UserId ?? "anonymous" },
                    { "is_anonymous", request.IsAnonymous.ToString() }
                }
            };

            if (request.AutomaticPaymentMethods)
            {
                options.AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = true,
                };
            }

            if (!string.IsNullOrEmpty(request.PaymentMethodId))
            {
                options.PaymentMethod = request.PaymentMethodId;
            }

            var paymentIntent = await _paymentIntentService.CreateAsync(options);

            _logger.LogInformation("Payment intent created: {PaymentIntentId} for amount: {Amount}", 
                paymentIntent.Id, request.Amount);

            return new PaymentIntentResponseDto
            {
                ClientSecret = paymentIntent.ClientSecret,
                PaymentIntentId = paymentIntent.Id,
                Amount = request.Amount,
                Currency = request.Currency,
                Status = paymentIntent.Status
            };
        }
        catch (StripeException ex)
        {
            _logger.LogError(ex, "Stripe error creating payment intent: {Error}", ex.Message);
            throw new ApplicationException($"Payment processing error: {ex.Message}", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error creating payment intent");
            throw new ApplicationException("An unexpected error occurred while processing payment", ex);
        }
    }

    public async Task<PaymentIntent> ConfirmPaymentIntentAsync(string paymentIntentId, string? paymentMethodId = null)
    {
        try
        {
            var options = new PaymentIntentConfirmOptions();
            
            if (!string.IsNullOrEmpty(paymentMethodId))
            {
                options.PaymentMethod = paymentMethodId;
            }

            var paymentIntent = await _paymentIntentService.ConfirmAsync(paymentIntentId, options);
            
            _logger.LogInformation("Payment intent confirmed: {PaymentIntentId} with status: {Status}", 
                paymentIntentId, paymentIntent.Status);

            return paymentIntent;
        }
        catch (StripeException ex)
        {
            _logger.LogError(ex, "Stripe error confirming payment intent {PaymentIntentId}: {Error}", 
                paymentIntentId, ex.Message);
            throw new ApplicationException($"Payment confirmation error: {ex.Message}", ex);
        }
    }

    public async Task<PaymentIntent> GetPaymentIntentAsync(string paymentIntentId)
    {
        try
        {
            return await _paymentIntentService.GetAsync(paymentIntentId);
        }
        catch (StripeException ex)
        {
            _logger.LogError(ex, "Stripe error retrieving payment intent {PaymentIntentId}: {Error}", 
                paymentIntentId, ex.Message);
            throw new ApplicationException($"Error retrieving payment: {ex.Message}", ex);
        }
    }

    public async Task<PaymentIntent> CancelPaymentIntentAsync(string paymentIntentId)
    {
        try
        {
            var paymentIntent = await _paymentIntentService.CancelAsync(paymentIntentId);
            
            _logger.LogInformation("Payment intent canceled: {PaymentIntentId}", paymentIntentId);
            
            return paymentIntent;
        }
        catch (StripeException ex)
        {
            _logger.LogError(ex, "Stripe error canceling payment intent {PaymentIntentId}: {Error}", 
                paymentIntentId, ex.Message);
            throw new ApplicationException($"Error canceling payment: {ex.Message}", ex);
        }
    }

    public async Task<Customer?> CreateOrGetCustomerAsync(string email, string? userId = null)
    {
        try
        {
            // First, try to find existing customer by email
            var customers = await _customerService.ListAsync(new CustomerListOptions
            {
                Email = email,
                Limit = 1
            });

            if (customers.Data.Any())
            {
                return customers.Data.First();
            }

            // Create new customer if not found
            var customerOptions = new CustomerCreateOptions
            {
                Email = email,
                Metadata = new Dictionary<string, string>()
            };

            if (!string.IsNullOrEmpty(userId))
            {
                customerOptions.Metadata.Add("user_id", userId);
            }

            var customer = await _customerService.CreateAsync(customerOptions);
            
            _logger.LogInformation("New Stripe customer created: {CustomerId} for email: {Email}", 
                customer.Id, email);

            return customer;
        }
        catch (StripeException ex)
        {
            _logger.LogError(ex, "Stripe error creating/getting customer for email {Email}: {Error}", 
                email, ex.Message);
            throw new ApplicationException($"Customer management error: {ex.Message}", ex);
        }
    }

    public async Task<IEnumerable<PaymentMethod>> GetCustomerPaymentMethodsAsync(string customerId)
    {
        try
        {
            var paymentMethods = await _paymentMethodService.ListAsync(new PaymentMethodListOptions
            {
                Customer = customerId,
                Type = "card"
            });

            return paymentMethods.Data;
        }
        catch (StripeException ex)
        {
            _logger.LogError(ex, "Stripe error retrieving payment methods for customer {CustomerId}: {Error}", 
                customerId, ex.Message);
            throw new ApplicationException($"Error retrieving payment methods: {ex.Message}", ex);
        }
    }
}
