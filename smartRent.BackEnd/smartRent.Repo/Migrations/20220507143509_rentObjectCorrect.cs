using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace smartRent.Repo.Migrations
{
    public partial class rentObjectCorrect : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rents_LandLords_LandLordId",
                table: "Rents");

            migrationBuilder.DropIndex(
                name: "IX_Rents_LandLordId",
                table: "Rents");

            migrationBuilder.DropColumn(
                name: "LandLordId",
                table: "Rents");

            migrationBuilder.DropColumn(
                name: "RentId",
                table: "RentObjects");

            migrationBuilder.RenameColumn(
                name: "RentObjectsId",
                table: "Rents",
                newName: "RentObjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Rents_RentObjectId",
                table: "Rents",
                column: "RentObjectId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Rents_RentObjects_RentObjectId",
                table: "Rents",
                column: "RentObjectId",
                principalTable: "RentObjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rents_RentObjects_RentObjectId",
                table: "Rents");

            migrationBuilder.DropIndex(
                name: "IX_Rents_RentObjectId",
                table: "Rents");

            migrationBuilder.RenameColumn(
                name: "RentObjectId",
                table: "Rents",
                newName: "RentObjectsId");

            migrationBuilder.AddColumn<Guid>(
                name: "LandLordId",
                table: "Rents",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "RentId",
                table: "RentObjects",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Rents_LandLordId",
                table: "Rents",
                column: "LandLordId");

            migrationBuilder.AddForeignKey(
                name: "FK_Rents_LandLords_LandLordId",
                table: "Rents",
                column: "LandLordId",
                principalTable: "LandLords",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
