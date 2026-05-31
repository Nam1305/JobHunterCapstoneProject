using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobHunter.Service.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeedJobLevels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                INSERT INTO job_levels (title, slug, created_by, updated_by)
                VALUES
                    ('Director', 'director', 'migration', 'migration'),
                    ('Vice Director', 'vice-director', 'migration', 'migration'),
                    ('Intern', 'intern', 'migration', 'migration'),
                    ('Fresher', 'fresher', 'migration', 'migration'),
                    ('Junior', 'junior', 'migration', 'migration'),
                    ('Middle', 'middle', 'migration', 'migration'),
                    ('Senior', 'senior', 'migration', 'migration'),
                    ('Trưởng Nhóm', 'truong-nhom', 'migration', 'migration'),
                    ('Trưởng phòng', 'truong-phong', 'migration', 'migration')
                ON CONFLICT (slug) DO UPDATE
                SET title = EXCLUDED.title,
                    updated_at = CURRENT_TIMESTAMP,
                    updated_by = EXCLUDED.updated_by;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DELETE FROM job_levels
                WHERE slug IN (
                    'director',
                    'vice-director',
                    'intern',
                    'fresher',
                    'junior',
                    'middle',
                    'senior',
                    'truong-nhom',
                    'truong-phong'
                );
                """);
        }
    }
}
