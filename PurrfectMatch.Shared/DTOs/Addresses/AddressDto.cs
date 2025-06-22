using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Shared.DTOs.Addresses;

public class AddressDto
{
    public int? Id { get; set; }

    [MaxLength(255, ErrorMessage = "Street address cannot exceed 255 characters.")]
    public string? Street { get; set; }

    [MaxLength(100, ErrorMessage = "City cannot exceed 100 characters.")]
    public string? City { get; set; }

    [MaxLength(100, ErrorMessage = "State/Province cannot exceed 100 characters.")]
    public string? State { get; set; }

    [MaxLength(20, ErrorMessage = "Postal code cannot exceed 20 characters.")]
    public string? PostalCode { get; set; }

    [MaxLength(100, ErrorMessage = "Country cannot exceed 100 characters.")]
    public string? Country { get; set; }

    public string? GoogleMapLink { get; set; }
}