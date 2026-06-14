using System;
using System.ComponentModel.DataAnnotations;

namespace CookieApi.Models
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public string Correo { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public string Rol { get; set; } = "usuario"; // 'admin' o 'usuario'

        public DateTime? UltimaConexion { get; set; }
    }

    public class LoginDto
    {
        public string Correo { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}