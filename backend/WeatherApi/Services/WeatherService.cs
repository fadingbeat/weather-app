using System.Text.Json;
using Microsoft.Extensions.Caching.Memory;

public class WeatherService(HttpClient http, IConfiguration config, IMemoryCache cache) : IWeatherService
{
    private readonly string _apiKey = config["OpenWeather:ApiKey"]!;
    private readonly string _baseUrl = config["OpenWeather:BaseUrl"]!;
    private const string CitiesCacheKey = "croatian_cities";

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
        if (!cache.TryGetValue(CitiesCacheKey, out List<CityDto>? allCities))
        {
            var url = "http://bulk.openweathermap.org/sample/city.list.json.gz";
            var response = await http.GetAsync(url);
            if (!response.IsSuccessStatusCode) return [];

            using var stream = await response.Content.ReadAsStreamAsync();
            using var gzip = new System.IO.Compression.GZipStream(stream, System.IO.Compression.CompressionMode.Decompress);
            using var reader = new System.IO.StreamReader(gzip);
            var json = await reader.ReadToEndAsync();

            var doc = JsonDocument.Parse(json);
            allCities = doc.RootElement.EnumerateArray()
                .Where(item => item.GetProperty("country").GetString() == "HR")
                .Select(item => new CityDto
                {
                    Name = item.GetProperty("name").GetString() ?? "",
                    Country = item.GetProperty("country").GetString() ?? "",
                    Lat = item.GetProperty("coord").GetProperty("lat").GetDouble(),
                    Lon = item.GetProperty("coord").GetProperty("lon").GetDouble()
                }).ToList();

            cache.Set(CitiesCacheKey, allCities, new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(30)
            });
        }

        return allCities!
            .Where(c => c.Name.StartsWith(query, StringComparison.OrdinalIgnoreCase))
            .Take(10)
            .ToList();
    }


}