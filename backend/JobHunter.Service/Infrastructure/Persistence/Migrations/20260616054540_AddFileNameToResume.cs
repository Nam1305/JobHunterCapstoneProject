using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobHunter.Service.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddFileNameToResume : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "file_name",
                table: "resumes",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "file_name",
                table: "resumes");
        }
    }
}
