public interface IWeatherService
{
    Task<CurrentWeatherDto?> GetCurrentWeatherAsync(double lat, double lon);
    Task<ForecastResponseDto?> GetForecastAsync(string city);
    Task<List<CityDto>> SearchCitiesAsync(string query);
}