using Microsoft.EntityFrameworkCore;
using PontosTuristicos.API.Models;

namespace PontosTuristicos.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<PontoTuristico> PontosTuristicos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PontoTuristico>().ToTable("pontos_turisticos");
        }
    }
}
