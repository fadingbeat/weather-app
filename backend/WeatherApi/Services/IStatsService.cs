public interface IStatsService
{
    Task<StatsDto> GetStatsAsync(Guid userId);
}