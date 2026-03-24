public class CurrentWeatherDto
{
    public string City { get; set; } = "";
    public string Country { get; set; } = "";
    public double Temperature { get; set; }
    public string Condition { get; set; } = "";
    public string Icon { get; set; } = "";
    public int Humidity { get; set; }
    public double WindSpeed { get; set; }
}