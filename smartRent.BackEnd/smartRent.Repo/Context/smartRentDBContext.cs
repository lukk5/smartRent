using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using smartRent.Repo.Entities;

namespace smartRent.Repo.Context
{
    public partial class SmartRentDbContext : DbContext
    {
        public DbSet<Tenant> Tenants { get; init; }
        public DbSet<LandLord> LandLords { get; init; }
        public DbSet<Bills> Bills { get; init; }
        public DbSet<Document> Documents { get; init; }
        public DbSet<RentObject> RentObjects { get; init; }
        public DbSet<Record> Records { get; init; }
        public DbSet<Credentials> Credentials { get; init; }

        public SmartRentDbContext()
        {
        }

        public SmartRentDbContext(DbContextOptions<SmartRentDbContext> options)
            : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(
                    "Server=localhost\\SQLEXPRESS;Database=smartRentDB;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            OnModelCreatingPartial(modelBuilder);
        }

        public override async Task<int>
            SaveChangesAsync(CancellationToken cancellationToken = default) // settina auditable ir base propercius
        {
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is Auditable && e.State is EntityState.Added or EntityState.Modified);

            foreach (var entityEntry in entries)
            {
                if (entityEntry.State == EntityState.Added)
                {
                    ((Auditable) entityEntry.Entity).CreatedAt = DateTime.UtcNow;
                    ((Auditable) entityEntry.Entity).CreatedBy = "system";
                    //(AuditableEntity)entityEntry.Entity).Id = Guid.NewGuid();
                }
                else
                {
                    Entry((Auditable) entityEntry.Entity).Property(p => p.UpdatedAt).IsModified = false;
                    Entry((Auditable) entityEntry.Entity).Property(p => p.UpdatedBy).IsModified = false;
                }

                ((Auditable) entityEntry.Entity).UpdatedAt = DateTime.UtcNow;
                ((Auditable) entityEntry.Entity).UpdatedBy = "system";
            }

            return await base.SaveChangesAsync(cancellationToken);
        }


        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}