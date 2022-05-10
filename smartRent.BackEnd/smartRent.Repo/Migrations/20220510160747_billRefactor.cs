using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace smartRent.Repo.Migrations
{
    public partial class billRefactor : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Content",
                table: "Bills");

            migrationBuilder.AddColumn<string>(
                name: "UniqueFileName",
                table: "Bills",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UniqueFileName",
                table: "Bills");

            migrationBuilder.AddColumn<byte[]>(
                name: "Content",
                table: "Bills",
                type: "varbinary(max)",
                nullable: true);
        }
    }
}
