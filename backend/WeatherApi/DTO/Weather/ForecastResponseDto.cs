public class ForecastResponseDto
{
    public string City { get; set; } = "";
    public string Country { get; set; } = "";
    public List<ForecastItemDto> Items { get; set; } = [];
}