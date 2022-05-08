using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace smartRent.Repo.Migrations
{
    public partial class rentClass4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bills_RentObjects_RentObjectId",
                table: "Bills");

            migrationBuilder.DropForeignKey(
                name: "FK_Records_RentObjects_RentObjectId",
                table: "Records");

            migrationBuilder.DropIndex(
                name: "IX_Records_RentObjectId",
                table: "Records");

            migrationBuilder.DropColumn(
                name: "RentObjectId",
                table: "Records");

            migrationBuilder.RenameColumn(
                name: "RentObjectId",
                table: "Bills",
                newName: "RentId");

            migrationBuilder.RenameIndex(
                name: "IX_Bills_RentObjectId",
                table: "Bills",
                newName: "IX_Bills_RentId");

            migrationBuilder.CreateIndex(
                name: "IX_Records_RentId",
                table: "Records",
                column: "RentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bills_Rents_RentId",
                table: "Bills",
                column: "RentId",
                principalTable: "Rents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Records_Rents_RentId",
                table: "Records",
                column: "RentId",
                principalTable: "Rents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bills_Rents_RentId",
                table: "Bills");

            migrationBuilder.DropForeignKey(
                name: "FK_Records_Rents_RentId",
                table: "Records");

            migrationBuilder.DropIndex(
                name: "IX_Records_RentId",
                table: "Records");

            migrationBuilder.RenameColumn(
                name: "RentId",
                table: "Bills",
                newName: "RentObjectId");

            migrationBuilder.RenameIndex(
                name: "IX_Bills_RentId",
                table: "Bills",
                newName: "IX_Bills_RentObjectId");

            migrationBuilder.AddColumn<Guid>(
                name: "RentObjectId",
                table: "Records",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Records_RentObjectId",
                table: "Records",
                column: "RentObjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bills_RentObjects_RentObjectId",
                table: "Bills",
                column: "RentObjectId",
                principalTable: "RentObjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Records_RentObjects_RentObjectId",
                table: "Records",
                column: "RentObjectId",
                principalTable: "RentObjects",
                principalColumn: "Id");
        }
    }
}
