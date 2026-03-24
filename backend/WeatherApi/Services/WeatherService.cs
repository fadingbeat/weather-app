using System.Text.Json;

public class WeatherService(HttpClient http, IConfiguration config) : IWeatherService
{
    private readonly string _apiKey = config["OpenWeather:ApiKey"]!;
    private readonly string _baseUrl = config["OpenWeather:BaseUrl"]!;

    public async Task<CurrentWeatherDto?> GetCurrentWeatherAsync(double lat, double lon)
    {
        var url = $"{_baseUrl}/weather?lat={lat}&lon={lon}&units=metric&appid={_apiKey}";
        var response = await http.GetAsync(url);
        if (!response.IsSuccessStatusCode) return null;

        var json = await response.Content.ReadAsStringAsync();
        var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        return new CurrentWeatherDto
        {
            City = root.GetProperty("name").GetString() ?? "",
            Country = root.GetProperty("sys").GetProperty("country").GetString() ?? "",
            Temperature = root.GetProperty("main").GetProperty("temp").GetDouble(),
            Condition = root.GetProperty("weather")[0].GetProperty("main").GetString() ?? "",
            Icon = root.GetProperty("weather")[0].GetProperty("icon").GetString() ?? "",
            Humidity = root.GetProperty("main").GetProperty("humidity").GetInt32(),
            WindSpeed = root.GetProperty("wind").GetProperty("speed").GetDouble()
        };
    }

    public async Task<ForecastResponseDto?> GetForecastAsync(string city)
    {
        var url = $"{_baseUrl}/forecast?q={city}&units=metric&appid={_apiKey}";
        var response = await http.GetAsync(url);
        if (!response.IsSuccessStatusCode) return null;

        var json = await response.Content.ReadAsStringAsync();
        var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        var items = root.GetProperty("list").EnumerateArray().Select(item => new ForecastItemDto
        {
            DateTime = DateTimeOffset.FromUnixTimeSeconds(item.GetProperty("dt").GetInt64()).UtcDateTime,
            Temperature = item.GetProperty("main").GetProperty("temp").GetDouble(),
            Condition = item.GetProperty("weather")[0].GetProperty("main").GetString() ?? "",
            Icon = item.GetProperty("weather")[0].GetProperty("icon").GetString() ?? "",
            Humidity = item.GetProperty("main").GetProperty("humidity").GetInt32(),
            WindSpeed = item.GetProperty("wind").GetProperty("speed").GetDouble()
        }).ToList();

        return new ForecastResponseDto
        {
            City = root.GetProperty("city").GetProperty("name").GetString() ?? "",
            Country = root.GetProperty("city").GetProperty("country").GetString() ?? "",
            Items = items
        };
    }

    public async Task<List<CityDto>> SearchCitiesAsync(string query)
    {
        var url = $"https://api.openweathermap.org/geo/1.0/direct?q={query}&limit=5&appid={_apiKey}";
        var response = await http.GetAsync(url);
        if (!response.IsSuccessStatusCode) return [];

        var json = await response.Content.ReadAsStringAsync();
        var doc = JsonDocument.Parse(json);

        return doc.RootElement.EnumerateArray().Select(item => new CityDto
        {
            Name = item.GetProperty("name").GetString() ?? "",
            Country = item.GetProperty("country").GetString() ?? "",
            State = item.TryGetProperty("state", out var state) ? state.GetString() ?? "" : "",
            Lat = item.GetProperty("lat").GetDouble(),
            Lon = item.GetProperty("lon").GetDouble()
        }).ToList();
    }


}