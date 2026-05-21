using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobHunter.Service.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddGoogleIdToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "google_id",
                table: "users",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "users_google_id_key",
                table: "users",
                column: "google_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "users_google_id_key",
                table: "users");

            migrationBuilder.DropColumn(
                name: "google_id",
                table: "users");
        }
    }
}
