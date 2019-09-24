using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using QxA.Api.Models;
using QxA.Api.Services;

namespace QxA.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly IConfiguration _config;
        private readonly UserManager<User> _userManager;
        private readonly IAuthService _authService;
        private readonly IMapper _mapper;

        public AuthController(IConfiguration config, UserManager<User> userManager, IAuthService authService, IMapper mapper)
        {
            _config = config;
            _userManager = userManager;
            _authService = authService;
            _mapper =  mapper;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody]RegisterDTO register)
        {
            User user = new User
            {
                UserName = register.UserName,
                Email = register.Email,
                FirstName = register.FirstName,
                LastName = register.LastName
            };

            var result = await _userManager.CreateAsync(user, register.Password);

            if (result.Succeeded)
                return Ok(new { success = $"The user {user.UserName} was created." });
            else
                return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody]LoginDTO login)
        {
            var user = await _userManager.FindByNameAsync(login.UserName);

            if (user == null)
                return NotFound(new { error = $"User {login.UserName} not found."});

            if(await _userManager.CheckPasswordAsync(user, login.Password))
                return Ok(new
                {
                    username = user.UserName,
                    token = new JwtSecurityTokenHandler().WriteToken(GenerateJwtToken(user))
                }); 
            else
                return BadRequest(new { error = "The password is wrong." });
            
        }

        [HttpGet("{username}")]
        public async Task<ActionResult> GetUser(string username)
        {
            var user = await _userManager.FindByNameAsync(username);

            if(user == null)
                return NotFound(new { error = $"User {username} not found." });

            return Ok(_mapper.Map<UserDTO>(user));
        }

        [Authorize]
        [HttpDelete("{username}")]
        public async Task<ActionResult> Delete(string username)
        {
            if (!_authService.AuthorizeUsernameWithToken(Request.Headers["Authorization"][0], username))
                return Unauthorized(new { error = "Not authorized to delete this user." });

            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
                return NotFound(new { error = $"User {username} not found." });

            var result = await _userManager.DeleteAsync(user);

            if (result.Succeeded)
                return Ok(new { success = $"The user {user.UserName} was deleted."});
            else
                return BadRequest(result.Errors);
            
        }

        private JwtSecurityToken GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N")),
                new Claim(JwtRegisteredClaimNames.NameId, user.UserName),
                new Claim(JwtRegisteredClaimNames.Email, user.Email)
            };

            var credentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:SecretKey"])),
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMonths(3),
                signingCredentials: credentials);

            return token;
        }

    }
}