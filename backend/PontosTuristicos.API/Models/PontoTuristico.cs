using System;
using System.ComponentModel.DataAnnotations;

namespace PontosTuristicos.API.Models
{
    public class PontoTuristico
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Nome { get; set; }

        [MaxLength(100)]
        public string Descricao { get; set; }

        [Required]
        public string Localizacao { get; set; }

        [Required]
        [MaxLength(100)]
        public string Cidade { get; set; }

        [Required]
        [MaxLength(2)]
        public string Estado { get; set; }

        public DateTime DataInclusao { get; set; } = DateTime.UtcNow;
    }
}
