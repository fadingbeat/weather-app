using Microsoft.EntityFrameworkCore;

public class SearchService(AppDbContext db) : ISearchService
{
    public async Task SaveSearchAsync(Guid userId, string city, string condition, double temperature)
    {
        var record = new SearchHistory
        {
            UserId = userId,
            City = city,
            WeatherCondition = condition,
            TemperatureC = temperature
        };
        db.SearchHistories.Add(record);
        await db.SaveChangesAsync();
    }

    public async Task<List<SearchHistory>> GetHistoryAsync(Guid userId)
    {
        return await db.SearchHistories
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.SearchedAt)
            .ToListAsync();
    }
}