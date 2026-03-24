using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/weather")]
[Authorize]
public class WeatherController(IWeatherService weatherService, ISearchService searchService) : ControllerBase
{
    [HttpGet("current")]
    public async Task<IActionResult> GetCurrent([FromQuery] double lat, [FromQuery] double lon)
    {
        var result = await weatherService.GetCurrentWeatherAsync(lat, lon);
        if (result == null) return BadRequest("Could not fetch weather data.");
        return Ok(result);
    }

    [HttpGet("forecast")]
    public async Task<IActionResult> GetForecast([FromQuery] string city)
    {
        if (string.IsNullOrWhiteSpace(city)) return BadRequest("City is required.");
        var result = await weatherService.GetForecastAsync(city);
        if (result == null) return BadRequest("City not found.");

        var userId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var firstItem = result.Items.FirstOrDefault();
        if (firstItem != null)
            await searchService.SaveSearchAsync(userId, result.City, firstItem.Condition, firstItem.Temperature);

        return Ok(result);
    }

    [HttpGet("cities")]
    public async Task<IActionResult> SearchCities([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query) || query.Length < 2) return Ok(new List<CityDto>());
        var result = await weatherService.SearchCitiesAsync(query);
        return Ok(result);
    }
}