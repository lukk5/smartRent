using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace smartRent.Repo.Migrations
{
    public partial class rentClass3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Records_RentObjects_RentObjectId",
                table: "Records");

            migrationBuilder.RenameColumn(
                name: "LandLordId",
                table: "Records",
                newName: "RentId");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndingDate",
                table: "Rents",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "StartingDate",
                table: "Rents",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<Guid>(
                name: "RentObjectId",
                table: "Records",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddForeignKey(
                name: "FK_Records_RentObjects_RentObjectId",
                table: "Records",
                column: "RentObjectId",
                principalTable: "RentObjects",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Records_RentObjects_RentObjectId",
                table: "Records");

            migrationBuilder.DropColumn(
                name: "EndingDate",
                table: "Rents");

            migrationBuilder.DropColumn(
                name: "StartingDate",
                table: "Rents");

            migrationBuilder.RenameColumn(
                name: "RentId",
                table: "Records",
                newName: "LandLordId");

            migrationBuilder.AlterColumn<Guid>(
                name: "RentObjectId",
                table: "Records",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Records_RentObjects_RentObjectId",
                table: "Records",
                column: "RentObjectId",
                principalTable: "RentObjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
