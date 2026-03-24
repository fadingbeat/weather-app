public class SearchHistory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string City { get; set; } = "";
    public string WeatherCondition { get; set; } = "";
    public double TemperatureC { get; set; }
    public DateTime SearchedAt { get; set; } = DateTime.UtcNow;
}