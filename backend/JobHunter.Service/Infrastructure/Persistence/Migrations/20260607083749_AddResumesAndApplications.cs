using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Pgvector;

#nullable disable

namespace JobHunter.Service.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddResumesAndApplications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:vector", ",,");

            migrationBuilder.CreateTable(
                name: "resumes",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    file_url = table.Column<string>(type: "text", nullable: true),
                    is_public = table.Column<bool>(type: "boolean", nullable: false),
                    resume_embedding = table.Column<Vector>(type: "vector", nullable: true),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP"),
                    created_by = table.Column<string>(type: "text", nullable: true),
                    updated_by = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("resumes_pkey", x => x.id);
                    table.ForeignKey(
                        name: "resumes_user_id_fkey",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "applications",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    resume_id = table.Column<Guid>(type: "uuid", nullable: true),
                    job_id = table.Column<Guid>(type: "uuid", nullable: false),
                    cover_letter = table.Column<string>(type: "text", nullable: true),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    match_score = table.Column<decimal>(type: "numeric", nullable: true),
                    ai_suggestion = table.Column<string>(type: "text", nullable: true),
                    applied_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP"),
                    created_by = table.Column<string>(type: "text", nullable: true),
                    updated_by = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("applications_pkey", x => x.id);
                    table.ForeignKey(
                        name: "applications_job_id_fkey",
                        column: x => x.job_id,
                        principalTable: "jobs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "applications_resume_id_fkey",
                        column: x => x.resume_id,
                        principalTable: "resumes",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_applications_job_id",
                table: "applications",
                column: "job_id");

            migrationBuilder.CreateIndex(
                name: "IX_applications_resume_id",
                table: "applications",
                column: "resume_id");

            migrationBuilder.CreateIndex(
                name: "IX_resumes_user_id",
                table: "resumes",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "applications");

            migrationBuilder.DropTable(
                name: "resumes");

            migrationBuilder.AlterDatabase()
                .OldAnnotation("Npgsql:PostgresExtension:vector", ",,");
        }
    }
}
