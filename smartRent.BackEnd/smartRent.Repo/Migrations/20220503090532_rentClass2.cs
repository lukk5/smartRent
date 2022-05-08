using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace smartRent.Repo.Migrations
{
    public partial class rentClass2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LandLordId",
                table: "RentObjects");

            migrationBuilder.RenameColumn(
                name: "TenantId",
                table: "RentObjects",
                newName: "RentId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RentId",
                table: "RentObjects",
                newName: "TenantId");

            migrationBuilder.AddColumn<Guid>(
                name: "LandLordId",
                table: "RentObjects",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }
    }
}
