public interface ISearchService
{
    Task SaveSearchAsync(Guid userId, string city, string condition, double temperature);
    Task<List<SearchHistory>> GetHistoryAsync(Guid userId);
}