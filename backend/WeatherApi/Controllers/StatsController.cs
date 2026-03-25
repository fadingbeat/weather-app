using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/stats")]
[Authorize]
public class StatsController(IStatsService statsService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetStats()
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var stats = await statsService.GetStatsAsync(userId);
        return Ok(stats);
    }
}