using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace smartRent.Repo.Migrations
{
    public partial class rentCorrect : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Active",
                table: "Rents",
                type: "bit",
                nullable: false,
                defaultValue: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Active",
                table: "Rents");
        }
    }
}
