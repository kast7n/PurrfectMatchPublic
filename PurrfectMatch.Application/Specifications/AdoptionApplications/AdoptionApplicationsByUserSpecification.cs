using System;
using System.Linq.Expressions;
using PurrfectMatch.Domain.Specifications;
using PurrfectMatch.Domain.Entities;

namespace PurrfectMatch.Application.Specifications.AdoptionApplications;

public class AdoptionApplicationsByUserSpecification : BaseSpecification<AdoptionApplication>
{
    public AdoptionApplicationsByUserSpecification(string userId) : base(application => application.UserId == userId)
    {
    }
}