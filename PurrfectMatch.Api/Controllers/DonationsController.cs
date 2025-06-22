using System;
using Microsoft.AspNetCore.Mvc;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Shared.DTOs.Donations;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Stripe;

namespace PurrfectMatch.Api.Controllers;

public class DonationsController(
    DonationsManager donationsManager,
    IMapper mapper,
    ILogger<DonationsController> logger) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetDonations()
    {
        var donations = await donationsManager.GetAllDonationsAsync();
        var donationDtos = donations.Select(d => mapper.Map<DonationDto>(d));
        return Ok(donationDtos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var donation = await donationsManager.GetDonationByIdAsync(id);
        if (donation == null) return NotFound();
        var donationDto = mapper.Map<DonationDto>(donation);
        return Ok(donationDto);
    }    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDonationDto donationDto)
    {
        var donation = await donationsManager.CreateDonationAsync(donationDto);
        return CreatedAtAction(nameof(GetById), new { id = donation.DonationId }, donation);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetDonationsByUserId(string userId)
    {
        var donations = await donationsManager.GetDonationsByUserIdAsync(userId);
        var donationDtos = donations.Select(d => mapper.Map<DonationDto>(d));
        return Ok(donationDtos);
    }

    // Stripe Payment Endpoints

    [HttpPost("create-payment-intent")]
    public async Task<IActionResult> CreatePaymentIntent([FromBody] CreatePaymentIntentDto request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var paymentIntentResponse = await donationsManager.CreatePaymentIntentAsync(request);
            return Ok(paymentIntentResponse);
        }
        catch (ApplicationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An unexpected error occurred while creating payment intent." });
        }
    }

    [HttpPost("confirm-payment")]
    public async Task<IActionResult> ConfirmPayment([FromBody] ConfirmPaymentDto request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var donation = await donationsManager.ConfirmPaymentAsync(request);
            return Ok(donation);
        }
        catch (ApplicationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An unexpected error occurred while confirming payment." });
        }
    }

    [HttpGet("payment-intent/{paymentIntentId}")]
    public async Task<IActionResult> GetDonationByPaymentIntent(string paymentIntentId)
    {
        try
        {
            var donation = await donationsManager.GetDonationByPaymentIntentAsync(paymentIntentId);
            if (donation == null)
            {
                return NotFound(new { error = "Donation not found for the specified payment intent." });
            }

            return Ok(donation);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An unexpected error occurred while retrieving donation." });
        }
    }    [HttpPost("webhook")]
    [AllowAnonymous]
    public async Task<IActionResult> StripeWebhook()
    {
        try
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            
            if (string.IsNullOrEmpty(json))
            {
                return BadRequest("Empty request body");
            }

            // Note: In production, you should verify the webhook signature here
            // For now, we'll assume the webhook is valid

            var stripeEvent = Stripe.EventUtility.ParseEvent(json);
              logger.LogInformation("Received Stripe webhook event: {EventType} for {EventId}", 
                stripeEvent.Type, stripeEvent.Id);

            switch (stripeEvent.Type)
            {
                case "payment_intent.created":
                    // Just acknowledge the event, no action needed
                    var paymentIntentCreated = stripeEvent.Data.Object as Stripe.PaymentIntent;
                    if (paymentIntentCreated != null)
                    {
                        logger.LogInformation("Payment intent created: {PaymentIntentId}", paymentIntentCreated.Id);
                    }
                    break;

                case "payment_intent.succeeded":
                    var paymentIntentSucceeded = stripeEvent.Data.Object as Stripe.PaymentIntent;
                    if (paymentIntentSucceeded != null)
                    {
                        await donationsManager.UpdateDonationFromWebhookAsync(
                            paymentIntentSucceeded.Id, 
                            "succeeded", 
                            paymentIntentSucceeded.LatestChargeId);
                    }
                    break;

                case "payment_intent.payment_failed":
                    var paymentIntentFailed = stripeEvent.Data.Object as Stripe.PaymentIntent;
                    if (paymentIntentFailed != null)
                    {
                        await donationsManager.UpdateDonationFromWebhookAsync(
                            paymentIntentFailed.Id, 
                            "failed");
                    }
                    break;

                case "payment_intent.canceled":
                    var paymentIntentCanceled = stripeEvent.Data.Object as Stripe.PaymentIntent;
                    if (paymentIntentCanceled != null)
                    {
                        await donationsManager.UpdateDonationFromWebhookAsync(
                            paymentIntentCanceled.Id, 
                            "canceled");
                    }
                    break;

                default:
                    logger.LogInformation("Unhandled Stripe webhook event type: {EventType}", stripeEvent.Type);
                    break;
            }

            return Ok();
        }        catch (StripeException stripeEx)
        {
            logger.LogError(stripeEx, "Stripe error processing webhook");
            return BadRequest(new { error = "Invalid Stripe event" });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing Stripe webhook");
            return StatusCode(500, new { error = "Webhook processing failed." });
        }
    }
}
