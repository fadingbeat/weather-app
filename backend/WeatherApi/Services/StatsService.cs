using Microsoft.EntityFrameworkCore;

public class StatsService(AppDbContext db) : IStatsService
{
    public async Task<StatsDto> GetStatsAsync(Guid userId)
    {
        var searches = db.SearchHistories.Where(s => s.UserId == userId);

        var topCities = await searches
            .GroupBy(s => s.City)
            .OrderByDescending(g => g.Count())
            .Take(3)
            .Select(g => new CityCountDto { City = g.Key, Count = g.Count() })
            .ToListAsync();

        var recentSearches = await searches
            .OrderByDescending(s => s.SearchedAt)
            .Take(3)
            .ToListAsync();

        var conditionDistribution = await searches
            .GroupBy(s => s.WeatherCondition)
            .Select(g => new ConditionCountDto { Condition = g.Key, Count = g.Count() })
            .OrderByDescending(g => g.Count)
            .ToListAsync();

        return new StatsDto
        {
            TopCities = topCities,
            RecentSearches = recentSearches,
            ConditionDistribution = conditionDistribution
        };
    }
}