using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobHunter.Service.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeedMockResumesAndApplications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DO $$
                DECLARE
                    v_user_id uuid;
                    v_job_id uuid;
                    v_resume_id uuid := gen_random_uuid();
                BEGIN
                    SELECT id INTO v_user_id FROM users LIMIT 1;
                    SELECT id INTO v_job_id FROM jobs LIMIT 1;

                    IF v_user_id IS NOT NULL THEN
                        INSERT INTO resumes (id, user_id, file_url, is_public, created_by, updated_by)
                        VALUES (v_resume_id, v_user_id, 'https://example.com/resume.pdf', true, 'seed', 'seed');

                        IF v_job_id IS NOT NULL THEN
                            INSERT INTO applications (id, resume_id, job_id, cover_letter, status, match_score, applied_at, created_by, updated_by)
                            VALUES (gen_random_uuid(), v_resume_id, v_job_id, 'I am very interested in this position.', 'Pending', 85.5, CURRENT_TIMESTAMP, 'seed', 'seed');
                        END IF;
                    END IF;
                END $$;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM applications WHERE created_by = 'seed';");
            migrationBuilder.Sql("DELETE FROM resumes WHERE created_by = 'seed';");
        }
    }
}
