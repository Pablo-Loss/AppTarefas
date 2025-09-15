using Microsoft.EntityFrameworkCore;
using app_tarefas.Models;

namespace app_tarefas.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Tarefa> Tarefas { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    }
}
