using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using CookieApi.Data;
using CookieApi.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace CookieApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var usuarioExiste = await _context.Usuarios.AnyAsync(u => u.Correo == dto.Correo);
            if (usuarioExiste)
            {
                return BadRequest(new { message = "El correo electrónico ya está registrado." });
            }

            var nuevoUsuario = new Usuario
            {
                Correo = dto.Correo,
                PasswordHash = PasswordHasher.HashPassword(dto.Password),
                Rol = dto.Rol.ToLower()
            };

            _context.Usuarios.Add(nuevoUsuario);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Usuario registrado con éxito de forma real." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Correo == dto.Correo);
            
            if (usuario == null)
            {
                var logFallidoCorreo = new LogConexion
                {
                    CorreoUsuario = dto.Correo ?? "Desconocido",
                    Estado = "Fallido",
                    FechaHora = DateTime.UtcNow,
                    DireccionIP = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1"
                };
                _context.LogsConexiones.Add(logFallidoCorreo);
                await _context.SaveChangesAsync();

                return Unauthorized(new { message = "Credenciales incorrectas (Correo no encontrado)." });
            }

            var passwordValido = PasswordHasher.VerifyPassword(dto.Password, usuario.PasswordHash);
            
            if (!passwordValido)
            {
                var logFallidoPass = new LogConexion
                {
                    CorreoUsuario = dto.Correo,
                    Estado = "Fallido",
                    FechaHora = DateTime.UtcNow,
                    DireccionIP = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1"
                };
                _context.LogsConexiones.Add(logFallidoPass);
                await _context.SaveChangesAsync();

                return Unauthorized(new { message = "Credenciales incorrectas (Contraseña inválida)." });
            }

            var logExitoso = new LogConexion
            {
                CorreoUsuario = usuario.Correo,
                Estado = "Exitoso",
                FechaHora = DateTime.UtcNow,
                DireccionIP = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1"
            };
            _context.LogsConexiones.Add(logExitoso);
            await _context.SaveChangesAsync();

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, usuario.Correo),
                    new Claim(ClaimTypes.Role, usuario.Rol) 
                }),
                Expires = DateTime.UtcNow.AddHours(2), // el token expira en 2 horas
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new 
            { 
                token = tokenString, 
                message = "¡Inicio de sesión exitoso!" 
            });
        }

        [HttpGet("ultimas-conexiones")]
        [Authorize(Roles = "usuario")]
        public async Task<IActionResult> GetUltimasConexiones()
        {
            try
            {
                var logs = await _context.LogsConexiones
                                        .OrderByDescending(l => l.Id)
                                        .Take(50)
                                        .ToListAsync();

                return Ok(logs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno al consultar la base de datos: {ex.Message}");
            }
        }

        [HttpGet("usuarios")]
        [Authorize(Roles = "admin")] 
        public async Task<IActionResult> GetUsuarios()
        {
            try
            {
                var lista = await _context.Usuarios
                    .Select(u => new 
                    {
                        id = u.Id,
                        correo = u.Correo,
                        rol = u.Rol
                    })
                    .ToListAsync();

                return Ok(lista);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error en el servidor al listar usuarios: {ex.Message}" });
            }
        }

        [HttpPut("cambiar-rol")]
        [Authorize(Roles = "admin")] 
        public async Task<IActionResult> CambiarRol([FromBody] CambiarRolDto dto)
        {
            try
            {
                var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Id == dto.UsuarioId);
                
                if (usuario == null)
                {
                    return NotFound(new { message = "El usuario especificado no existe." });
                }

                usuario.Rol = dto.Rol.ToLower().Trim();
                
                _context.Usuarios.Update(usuario);
                await _context.SaveChangesAsync();

                return Ok(new { message = $"Rol actualizado con éxito a {usuario.Rol}." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error al actualizar el rol en la base de datos: {ex.Message}" });
            }
        }
    }
}