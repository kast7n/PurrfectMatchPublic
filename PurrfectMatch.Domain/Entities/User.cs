using Microsoft.AspNetCore.Identity;

namespace PurrfectMatch.Domain.Entities;

public class User : IdentityUser
{
    public virtual UserProfile? UserProfile { get; set; }
    public virtual ICollection<AdoptionApplication> AdoptionApplications { get; set; } = new List<AdoptionApplication>();
    public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    public virtual ICollection<Donation> Donations { get; set; } = new List<Donation>();
    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
    public virtual ICollection<ShelterCreationRequest> ShelterCreationRequests { get; set; } = new List<ShelterCreationRequest>();
    public virtual ICollection<ShelterFollower> ShelterFollowers { get; set; } = new List<ShelterFollower>();
    public virtual ICollection<ShelterManager> ShelterManagers { get; set; } = new List<ShelterManager>();
}