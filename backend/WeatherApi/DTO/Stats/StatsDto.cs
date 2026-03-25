public class StatsDto
{
    public List<CityCountDto> TopCities { get; set; } = [];
    public List<SearchHistory> RecentSearches { get; set; } = [];
    public List<ConditionCountDto> ConditionDistribution { get; set; } = [];
}

public class CityCountDto
{
    public string City { get; set; } = "";
    public int Count { get; set; }
}

public class ConditionCountDto
{
    public string Condition { get; set; } = "";
    public int Count { get; set; }
}