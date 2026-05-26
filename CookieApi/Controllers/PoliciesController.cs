using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CookieApi.Data;
using CookieApi.Models;
using Microsoft.AspNetCore.Cors;

namespace CookieApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowAngular")]
    public class PoliciesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PoliciesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Policy>>> GetPolicies()
        {
            return await _context.Policies.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Policy>> CreatePolicy(Policy policy)
        {
            _context.Policies.Add(policy);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPolicies), new { id = policy.Id }, policy);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePolicy(int id)
        {
            var policy = await _context.Policies.FindAsync(id);

            if (policy == null)
            {
                return NotFound();
            }

            _context.Policies.Remove(policy);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePolicy(int id, Policy updatedPolicy)
        {
            if (id != updatedPolicy.Id)
            {
                return BadRequest();
            }

            var policy = await _context.Policies.FindAsync(id);

            if (policy == null)
            {
                return NotFound();
            }

            policy.Title = updatedPolicy.Title;
            policy.Description = updatedPolicy.Description;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}