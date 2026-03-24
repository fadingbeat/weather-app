using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/searches")]
[Authorize]
public class SearchesController(ISearchService searchService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetHistory()
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var history = await searchService.GetHistoryAsync(userId);
        return Ok(history);
    }
}