using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace smartRent.Repo.Migrations
{
    public partial class rentClass : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bills_Tenants_TenantId",
                table: "Bills");

            migrationBuilder.DropForeignKey(
                name: "FK_RentObjects_LandLords_LandLordId",
                table: "RentObjects");

            migrationBuilder.DropForeignKey(
                name: "FK_RentObjects_Tenants_TenantId",
                table: "RentObjects");

            migrationBuilder.DropIndex(
                name: "IX_RentObjects_LandLordId",
                table: "RentObjects");

            migrationBuilder.DropIndex(
                name: "IX_RentObjects_TenantId",
                table: "RentObjects");

            migrationBuilder.DropIndex(
                name: "IX_Bills_TenantId",
                table: "Bills");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "Bills");

            migrationBuilder.CreateTable(
                name: "Rents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LandLordId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RentObjectsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Rents_LandLords_LandLordId",
                        column: x => x.LandLordId,
                        principalTable: "LandLords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Rents_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Rents_RentObjects_RentObjectsId",
                        column: x => x.RentObjectsId,
                        principalTable: "RentObjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Rents_LandLordId",
                table: "Rents",
                column: "LandLordId");

            migrationBuilder.CreateIndex(
                name: "IX_Rents_TenantId",
                table: "Rents",
                column: "TenantId");
            
            migrationBuilder.CreateIndex(
                name: "IX_Rents_RentObjectsId",
                table: "Rents",
                column: "RentObjectsId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Rents");

            migrationBuilder.AddColumn<Guid>(
                name: "TenantId",
                table: "Bills",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_RentObjects_LandLordId",
                table: "RentObjects",
                column: "LandLordId");

            migrationBuilder.CreateIndex(
                name: "IX_RentObjects_TenantId",
                table: "RentObjects",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_Bills_TenantId",
                table: "Bills",
                column: "TenantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bills_Tenants_TenantId",
                table: "Bills",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RentObjects_LandLords_LandLordId",
                table: "RentObjects",
                column: "LandLordId",
                principalTable: "LandLords",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RentObjects_Tenants_TenantId",
                table: "RentObjects",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
