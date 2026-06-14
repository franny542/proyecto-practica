namespace CookieApi.Models // Ajusta el namespace si tu carpeta se llama CookieApi.Dtos
{
    public class CambiarRolDto
    {
        public int UsuarioId { get; set; }
        public string Rol { get; set; } = string.Empty;
    }
}