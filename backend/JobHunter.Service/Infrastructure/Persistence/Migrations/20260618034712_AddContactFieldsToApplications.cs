using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobHunter.Service.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddContactFieldsToApplications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "email",
                table: "applications",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "name",
                table: "applications",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "phone",
                table: "applications",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE applications AS a
                SET
                    email = LEFT(COALESCE(u.email, ''), 255),
                    name = LEFT(COALESCE(u.name, ''), 255),
                    phone = LEFT(COALESCE(u.phone, ''), 20)
                FROM resumes AS r
                INNER JOIN users AS u ON u.id = r.user_id
                WHERE a.resume_id = r.id;
                """);

            migrationBuilder.Sql("""
                UPDATE applications
                SET
                    email = COALESCE(email, ''),
                    name = COALESCE(name, ''),
                    phone = COALESCE(phone, '');
                """);

            migrationBuilder.AlterColumn<string>(
                name: "email",
                table: "applications",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "applications",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "phone",
                table: "applications",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20,
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "email",
                table: "applications");

            migrationBuilder.DropColumn(
                name: "name",
                table: "applications");

            migrationBuilder.DropColumn(
                name: "phone",
                table: "applications");
        }
    }
}
