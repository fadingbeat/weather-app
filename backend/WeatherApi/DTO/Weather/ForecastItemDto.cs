public class ForecastItemDto
{
    public DateTime DateTime { get; set; }
    public double Temperature { get; set; }
    public string Condition { get; set; } = "";
    public string Icon { get; set; } = "";
    public int Humidity { get; set; }
    public double WindSpeed { get; set; }
}