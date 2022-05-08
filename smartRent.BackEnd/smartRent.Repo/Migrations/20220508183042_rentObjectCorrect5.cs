using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace smartRent.Repo.Migrations
{
    public partial class rentObjectCorrect5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Rents_RentObjectId",
                table: "Rents");

            migrationBuilder.CreateIndex(
                name: "IX_Rents_RentObjectId",
                table: "Rents",
                column: "RentObjectId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Rents_RentObjectId",
                table: "Rents");

            migrationBuilder.CreateIndex(
                name: "IX_Rents_RentObjectId",
                table: "Rents",
                column: "RentObjectId",
                unique: true);
        }
    }
}
