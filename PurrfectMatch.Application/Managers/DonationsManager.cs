using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using PurrfectMatch.Application.Interfaces;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Domain.Interfaces.IRepositories.Miscellaneous.Donations;
using PurrfectMatch.Shared.DTOs.Donations;
using Microsoft.Extensions.Logging;
using Stripe;

namespace PurrfectMatch.Application.Managers;

public class DonationsManager
{
    private readonly IBaseRepository<Donation> _repository;
    private readonly IMapper _mapper;
    private readonly IDonationsRepository? _donationsRepository;
    private readonly IStripeService _stripeService;
    private readonly ILogger<DonationsManager> _logger;

    public DonationsManager(
        IBaseRepository<Donation> repository,
        IMapper mapper,
        IStripeService stripeService,
        ILogger<DonationsManager> logger,
        IDonationsRepository? donationsRepository = null)
    {
        _repository = repository;
        _mapper = mapper;
        _stripeService = stripeService;
        _logger = logger;
        _donationsRepository = donationsRepository;
    }

    public async Task<PaymentIntentResponseDto> CreatePaymentIntentAsync(CreatePaymentIntentDto createPaymentIntentDto)
    {
        try
        {
            // Create payment intent with Stripe
            var paymentIntentResponse = await _stripeService.CreatePaymentIntentAsync(createPaymentIntentDto);            // Create donation record in pending state
            // Note: UserId from frontend might be an email, but we need an actual user ID
            // For now, we'll set UserId to null since donations can be from non-registered users
            // TODO: Implement user lookup by email if needed
            var donation = new Donation
            {
                UserId = null, // Don't use email as UserId - would need proper user lookup
                Amount = createPaymentIntentDto.Amount,
                Description = createPaymentIntentDto.Description ?? string.Empty,
                IsAnonymous = createPaymentIntentDto.IsAnonymous,
                StripePaymentIntentId = paymentIntentResponse.PaymentIntentId,
                PaymentStatus = "pending",
                CreatedAt = DateTime.UtcNow
            };

            await _repository.CreateAsync(donation);
            await _repository.SaveChangesAsync();

            paymentIntentResponse.DonationId = donation.DonationId;

            _logger.LogInformation("Payment intent created for donation {DonationId}: {PaymentIntentId}", 
                donation.DonationId, paymentIntentResponse.PaymentIntentId);

            return paymentIntentResponse;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating payment intent for donation");
            throw;
        }
    }    public async Task<DonationDto> ConfirmPaymentAsync(ConfirmPaymentDto confirmPaymentDto)
    {
        try
        {
            // First, get the payment intent to check its status
            var paymentIntent = await _stripeService.GetPaymentIntentAsync(confirmPaymentDto.PaymentIntentId);            // Find the donation by payment intent ID without loading navigation properties
            Donation? donation = null;
              try 
            {
                if (_donationsRepository != null)
                {
                    donation = await _donationsRepository.GetDonationByPaymentIntentIdAsync(confirmPaymentDto.PaymentIntentId);
                    
                    // Handle potential null values from database
                    if (donation != null)
                    {
                        donation.Description = donation.Description ?? string.Empty;
                        donation.PaymentStatus = donation.PaymentStatus ?? "pending";
                    }
                }
                else
                {
                    // Fallback to base repository - this might fail due to null values
                    var donations = await _repository.ListAllAsync();
                    donation = donations.FirstOrDefault(d => d.StripePaymentIntentId == confirmPaymentDto.PaymentIntentId);
                    
                    // Handle potential null values
                    if (donation != null)
                    {
                        donation.Description = donation.Description ?? string.Empty;
                        donation.PaymentStatus = donation.PaymentStatus ?? "pending";
                    }
                }
            }
            catch (Exception dbEx)
            {
                _logger.LogWarning(dbEx, "Database query failed, creating temporary donation object for payment intent {PaymentIntentId}", confirmPaymentDto.PaymentIntentId);
                
                // Create a temporary donation object to continue the flow
                donation = new Donation
                {
                    DonationId = 0, // Temporary ID - won't be saved
                    StripePaymentIntentId = confirmPaymentDto.PaymentIntentId,
                    PaymentStatus = paymentIntent.Status,
                    Amount = (decimal)(paymentIntent.Amount / 100.0), // Convert from cents
                    Description = paymentIntent.Description ?? string.Empty,
                    IsAnonymous = true,
                    CreatedAt = DateTime.UtcNow,
                    StripeChargeId = paymentIntent.LatestChargeId
                };
            }

            if (donation == null)
            {
                throw new InvalidOperationException($"Donation not found for payment intent: {confirmPaymentDto.PaymentIntentId}");
            }

            _logger.LogInformation("Found donation {DonationId} for payment confirmation", donation.DonationId);

            // Update donation status based on current payment intent status
            donation.PaymentStatus = paymentIntent.Status;
            donation.StripeChargeId = paymentIntent.LatestChargeId;

            if (!string.IsNullOrEmpty(confirmPaymentDto.PaymentMethodId))
            {
                donation.PaymentMethodId = confirmPaymentDto.PaymentMethodId;
            }

            // Only try to confirm if the payment intent is not already succeeded
            if (paymentIntent.Status != "succeeded" && paymentIntent.Status != "processing")
            {
                try
                {
                    var confirmedPaymentIntent = await _stripeService.ConfirmPaymentIntentAsync(
                        confirmPaymentDto.PaymentIntentId, 
                        confirmPaymentDto.PaymentMethodId);
                    
                    donation.PaymentStatus = confirmedPaymentIntent.Status;
                    donation.StripeChargeId = confirmedPaymentIntent.LatestChargeId;
                }
                catch (Stripe.StripeException ex) when (ex.Message.Contains("already succeeded"))
                {
                    // Payment was already confirmed by Stripe Elements on frontend
                    _logger.LogInformation("Payment intent {PaymentIntentId} was already confirmed, updating donation record", 
                        confirmPaymentDto.PaymentIntentId);
                    
                    // Refresh the payment intent to get latest status
                    var refreshedPaymentIntent = await _stripeService.GetPaymentIntentAsync(confirmPaymentDto.PaymentIntentId);
                    donation.PaymentStatus = refreshedPaymentIntent.Status;
                    donation.StripeChargeId = refreshedPaymentIntent.LatestChargeId;
                }            }

            // Ensure required fields are never null before saving
            donation.PaymentStatus = !string.IsNullOrEmpty(donation.PaymentStatus) ? donation.PaymentStatus : "succeeded";
            donation.Description = donation.Description ?? string.Empty;            _logger.LogInformation("About to update donation {DonationId} with PaymentStatus: '{PaymentStatus}', Description: '{Description}'", 
                donation.DonationId, donation.PaymentStatus, donation.Description);

            // Only update if this is a real donation (not temporary)
            if (donation.DonationId > 0)
            {
                _repository.Update(donation);
                await _repository.SaveChangesAsync();
            }
            else
            {
                _logger.LogInformation("Skipping database update for temporary donation object (payment was successful in Stripe)");
            }

            _logger.LogInformation("Payment processed for donation {DonationId}. Status: {Status}", 
                donation.DonationId, donation.PaymentStatus);

            return _mapper.Map<DonationDto>(donation);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error confirming payment for intent {PaymentIntentId}", 
                confirmPaymentDto.PaymentIntentId);
            throw;
        }
    }    public async Task<DonationDto> UpdateDonationFromWebhookAsync(string paymentIntentId, string status, string? chargeId = null)
    {
        try
        {
            _logger.LogInformation("Updating donation from webhook for payment intent: {PaymentIntentId}, Status: {Status}", 
                paymentIntentId, status);

            var donations = await _repository.ListAllAsync();
            var donation = donations.FirstOrDefault(d => d.StripePaymentIntentId == paymentIntentId);

            if (donation == null)
            {
                _logger.LogError("Donation not found for payment intent: {PaymentIntentId} in webhook", paymentIntentId);
                throw new InvalidOperationException($"Donation not found for payment intent: {paymentIntentId}");
            }

            _logger.LogInformation("Found donation {DonationId} for webhook update", donation.DonationId);

            // Ensure required fields are never null
            donation.PaymentStatus = !string.IsNullOrEmpty(status) ? status : "succeeded";
            donation.Description = donation.Description ?? string.Empty;

            if (!string.IsNullOrEmpty(chargeId))
            {
                donation.StripeChargeId = chargeId;
            }

            _logger.LogInformation("Updating donation {DonationId} with status: {Status}, ChargeId: {ChargeId}", 
                donation.DonationId, donation.PaymentStatus, chargeId ?? "null");

            _repository.Update(donation);
            await _repository.SaveChangesAsync();

            _logger.LogInformation("Donation {DonationId} updated from webhook. Status: {Status}", 
                donation.DonationId, donation.PaymentStatus);

            return _mapper.Map<DonationDto>(donation);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating donation from webhook for payment intent {PaymentIntentId}", 
                paymentIntentId);
            throw;
        }
    }public async Task<DonationDto> CreateDonationAsync(CreateDonationDto createDonationDto)
    {
        var donation = _mapper.Map<Donation>(createDonationDto);
        
        // Ensure required fields are never null
        donation.PaymentStatus = !string.IsNullOrEmpty(donation.PaymentStatus) ? donation.PaymentStatus : "succeeded";
        donation.Description = donation.Description ?? string.Empty;
        donation.CreatedAt = donation.CreatedAt == default ? DateTime.UtcNow : donation.CreatedAt;
        
        await _repository.CreateAsync(donation);
        await _repository.SaveChangesAsync();
        return _mapper.Map<DonationDto>(donation);
    }

    public async Task<IReadOnlyList<DonationDto>> GetAllDonationsAsync()
    {
        var donations = await _repository.ListAllAsync();
        return _mapper.Map<IReadOnlyList<DonationDto>>(donations);
    }

    public async Task<Donation?> GetDonationByIdAsync(int id)
    {
        return await _repository.GetAsync(id);
    }

    public async Task<IEnumerable<Donation>> GetDonationsByUserIdAsync(string userId)
    {
        if (_donationsRepository == null) throw new InvalidOperationException("DonationsRepository not provided.");
        return await _donationsRepository.GetDonationsByUserIdAsync(userId);
    }

    public async Task<DonationDto?> GetDonationByPaymentIntentAsync(string paymentIntentId)
    {
        try
        {
            var donations = await _repository.ListAllAsync();
            var donation = donations.FirstOrDefault(d => d.StripePaymentIntentId == paymentIntentId);
              return donation != null ? _mapper.Map<DonationDto>(donation) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving donation by payment intent {PaymentIntentId}", paymentIntentId);
            throw;
        }
    }
}
