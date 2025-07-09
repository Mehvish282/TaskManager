using Microsoft.AspNetCore.Mvc;
using TaskManager.API.DTOs;
using TaskManager.API.Services;

namespace TaskManager.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.RegisterAsync(registerDto);

            if (result == null)
            {
                return BadRequest(new { message = "Registration failed. User may already exist." });
            }

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.LoginAsync(loginDto);

            if (result == null)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            return Ok(result);
        }
        [HttpPost("forgot-password")]
public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotDto)
{
    if (string.IsNullOrWhiteSpace(forgotDto.Email))
        return BadRequest(new { message = "Email is required." });

    var (success, message) = await _authService.ForgotPasswordAsync(forgotDto.Email);

    if (!success)
        return NotFound(new { message });

    return Ok(new { message });
}
private readonly EmailService _emailService;

public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, EmailService emailService)
{
    _userManager = userManager;
    _signInManager = signInManager;
    _emailService = emailService;
}



    }
}