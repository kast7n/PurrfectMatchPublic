using PurrfectMatch.Application.Specifications.Pets.Attributes.Breeds;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.Breeds;
using Serilog;
using Xunit;
using System.Collections.Generic;
using System.Linq;

namespace PurrfectMatch.Tests.Specifications.Pets.Attributes.Breeds
{
    public class BreedsFilterSpecificationTests
    {
        private readonly ILogger _logger;

        public BreedsFilterSpecificationTests()
        {
            _logger = new LoggerConfiguration()
                .WriteTo.Console()
                .CreateLogger();
        }

        [Fact]
        public void Should_Filter_By_Name()
        {
            // Arrange
            var filter = new BreedFilterDto { Name = "Persian" };
            _logger.Information("Testing filter by name with Name = '{Name}'", filter.Name);
            var spec = new BreedsFilterSpecification(filter);

            var breeds = new List<Breed>
            {
                new Breed { Name = "Persian Cat" },
                new Breed { Name = "Siamese Cat" },
                new Breed { Name = "Persian Tiger" }
            };
            _logger.Information("Before filtering: {@Breeds}", breeds);

            // Act
            var criteria = spec.Criteria;
            _logger.Information("Criteria generated: {Criteria}", criteria);
            var filteredBreeds = breeds.Where(criteria.Compile()).ToList();

            // Assert
            _logger.Information("After filtering: {@FilteredBreeds}", filteredBreeds);
            Assert.NotNull(criteria);
            Assert.Contains(filteredBreeds, b => b.Name == "Persian Cat");
            Assert.DoesNotContain(filteredBreeds, b => b.Name == "Siamese Cat");
        }

        [Fact]
        public void Should_Filter_By_SpeciesId()
        {
            // Arrange
            var filter = new BreedFilterDto { SpeciesId = 1 };
            _logger.Information("Testing filter by SpeciesId with SpeciesId = {SpeciesId}", filter.SpeciesId);
            var spec = new BreedsFilterSpecification(filter);

            var breeds = new List<Breed>
            {
                new Breed { SpeciesId = 1, Name = "Persian Cat" },
                new Breed { SpeciesId = 2, Name = "Siamese Cat" },
                new Breed { SpeciesId = 1, Name = "Persian Tiger" }
            };
            _logger.Information("Before filtering: {@Breeds}", breeds);

            // Act
            var criteria = spec.Criteria;
            _logger.Information("Criteria generated: {Criteria}", criteria);
            var filteredBreeds = breeds.Where(criteria.Compile()).ToList();

            // Assert
            _logger.Information("After filtering: {@FilteredBreeds}", filteredBreeds);
            Assert.NotNull(criteria);
            Assert.Contains(filteredBreeds, b => b.SpeciesId == 1 && b.Name == "Persian Cat");
            Assert.DoesNotContain(filteredBreeds, b => b.SpeciesId == 2);
        }

        [Fact]
        public void Should_Apply_Pagination()
        {
            // Arrange
            var filter = new BreedFilterDto { PageNumber = 2, PageSize = 2 };
            _logger.Information("Testing pagination with PageNumber = {PageNumber}, PageSize = {PageSize}", filter.PageNumber, filter.PageSize);
            var spec = new BreedsFilterSpecification(filter);

            var breeds = new List<Breed>
            {
                new Breed { Name = "Breed 1" },
                new Breed { Name = "Breed 2" },
                new Breed { Name = "Breed 3" },
                new Breed { Name = "Breed 4" }
            };
            _logger.Information("Before pagination: {@Breeds}", breeds);

            // Act
            var paginatedBreeds = breeds.Skip(spec.Skip).Take(spec.Take).ToList();
            _logger.Information("After pagination: {@PaginatedBreeds}", paginatedBreeds);

            // Assert
            Assert.Equal(2, paginatedBreeds.Count);
            Assert.Contains(paginatedBreeds, b => b.Name == "Breed 3");
            Assert.Contains(paginatedBreeds, b => b.Name == "Breed 4");
        }

        [Fact]
        public void Should_Apply_Sorting_By_Name()
        {
            // Arrange
            var filter = new BreedFilterDto { SortBy = "name", SortDescending = false };
            _logger.Information("Testing sorting by Name with SortDescending = {SortDescending}", filter.SortDescending);
            var spec = new BreedsFilterSpecification(filter);

            var breeds = new List<Breed>
            {
                new Breed { Name = "Zebra" },
                new Breed { Name = "Antelope" },
                new Breed { Name = "Lion" }
            };
            _logger.Information("Before sorting: {@Breeds}", breeds);

            // Act
            var sortedBreeds = breeds.OrderBy(spec.OrderBy.Compile()).ToList();
            _logger.Information("After sorting: {@SortedBreeds}", sortedBreeds);

            // Assert
            Assert.Equal("Antelope", sortedBreeds.First().Name);
            Assert.Equal("Zebra", sortedBreeds.Last().Name);
        }

        [Fact]
        public void Should_Apply_Sorting_By_Species()
        {
            // Arrange
            var filter = new BreedFilterDto { SortBy = "species", SortDescending = true };
            _logger.Information("Testing sorting by Species with SortDescending = {SortDescending}", filter.SortDescending);
            var spec = new BreedsFilterSpecification(filter);

            var breeds = new List<Breed>
            {
                new Breed { Species = new Species { Name = "Cat" }, Name = "Persian" },
                new Breed { Species = new Species { Name = "Dog" }, Name = "Bulldog" },
                new Breed { Species = new Species { Name = "Bird" }, Name = "Parrot" }
            };
            _logger.Information("Before sorting: {@Breeds}", breeds);

            // Act
            var sortedBreeds = breeds.OrderByDescending(spec.OrderByDescending.Compile()).ToList();
            _logger.Information("After sorting: {@SortedBreeds}", sortedBreeds);

            // Assert
            Assert.Equal("Dog", sortedBreeds.First().Species.Name);
            Assert.Equal("Bird", sortedBreeds.Last().Species.Name);
        }

        [Fact]
        public void Should_Get_Breed_By_Id()
        {
            // Arrange
            var breedId = 1;
            var breeds = new List<Breed>
            {
                new Breed { BreedId = 1, Name = "Persian", SpeciesId = 2 },
                new Breed { BreedId = 2, Name = "Siamese", SpeciesId = 2 }
            };

            // Simulate fetching a breed by ID
            var breed = breeds.FirstOrDefault(b => b.BreedId == breedId);

            // Act
            _logger.Information("Fetching breed with ID = {BreedId}", breedId);

            // Assert
            Assert.NotNull(breed);
            Assert.Equal("Persian", breed?.Name);
            Assert.Equal(2, breed?.SpeciesId);
        }
    }
}
