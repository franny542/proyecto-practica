public class LogConexion
{
    public int Id { get; set; }
    public string CorreoUsuario { get; set; } 
    public DateTime FechaHora { get; set; } = DateTime.UtcNow; 
    public string Estado { get; set; } 
    public string DireccionIP { get; set; } 
}