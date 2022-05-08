using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace smartRent.Repo.Migrations
{
    public partial class rentObjectCorrect3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "LandLordId",
                table: "RentObjects",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_RentObjects_LandLordId",
                table: "RentObjects",
                column: "LandLordId");

            migrationBuilder.AddForeignKey(
                name: "FK_RentObjects_LandLords_LandLordId",
                table: "RentObjects",
                column: "LandLordId",
                principalTable: "LandLords",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RentObjects_LandLords_LandLordId",
                table: "RentObjects");

            migrationBuilder.DropIndex(
                name: "IX_RentObjects_LandLordId",
                table: "RentObjects");

            migrationBuilder.DropColumn(
                name: "LandLordId",
                table: "RentObjects");
        }
    }
}
