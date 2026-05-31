using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobHunter.Service.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeedJobCategoriesAndSubcategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                INSERT INTO job_categories (name, slug, created_by, updated_by)
                VALUES
                    ('IT', 'it', 'migration', 'migration'),
                    ('Business, Finance', 'business-finance', 'migration', 'migration'),
                    ('Management', 'management', 'migration', 'migration'),
                    ('Manufacturing & Engineering', 'manufacturing-engineering', 'migration', 'migration'),
                    ('Service', 'service', 'migration', 'migration'),
                    ('Design, Creativity', 'design-creativity', 'migration', 'migration')
                ON CONFLICT (slug) DO UPDATE
                SET name = EXCLUDED.name,
                    updated_at = CURRENT_TIMESTAMP,
                    updated_by = EXCLUDED.updated_by;
                """);

            migrationBuilder.Sql("""
                WITH seed(category_slug, name, slug) AS (
                    VALUES
                        ('it', 'Software Developer', 'software-developer'),
                        ('it', 'Machine Learning / AI Engineer', 'machine-learning-ai-engineer'),
                        ('it', 'Augmented Reality (AR) Developer', 'augmented-reality-ar-developer'),
                        ('it', 'Internet of Things (IoT) Developer', 'internet-of-things-iot-developer'),
                        ('it', 'Blockchain Developer', 'blockchain-developer'),
                        ('it', 'DevOps Engineer', 'devops-engineer'),
                        ('it', 'Data Engineer / Scientist / Analyst', 'data-engineer-scientist-analyst'),
                        ('it', 'Network Engineer / Cyber Security Expert', 'network-engineer-cyber-security-expert'),
                        ('it', 'QA / Tester', 'qa-tester'),
                        ('it', 'Product Manager / Business Analyst', 'product-manager-business-analyst'),
                        ('it', 'IT Support Specialist', 'it-support-specialist'),
                        ('business-finance', 'Retail / Store', 'retail-store'),
                        ('business-finance', 'Sales / Business Development', 'sales-business-development'),
                        ('business-finance', 'Customer Service', 'customer-service'),
                        ('business-finance', 'Ecommerce', 'ecommerce'),
                        ('business-finance', 'Marketing / PR / Communication / Event', 'marketing-pr-communication-event'),
                        ('business-finance', 'Online Marketing', 'online-marketing'),
                        ('business-finance', 'Business Intelligence', 'business-intelligence'),
                        ('business-finance', 'Banking', 'banking'),
                        ('business-finance', 'Finance / Investment', 'finance-investment'),
                        ('business-finance', 'Securities', 'securities'),
                        ('business-finance', 'Accounting / Auditing / Tax', 'accounting-auditing-tax'),
                        ('business-finance', 'Insurance', 'insurance'),
                        ('management', 'Human Resources', 'human-resources'),
                        ('management', 'Administrative / Clerk', 'administrative-clerk'),
                        ('management', 'Interpreter / Translator', 'interpreter-translator'),
                        ('management', 'Consulting', 'consulting'),
                        ('management', 'Management', 'management'),
                        ('manufacturing-engineering', 'Printing / Publishing', 'printing-publishing'),
                        ('manufacturing-engineering', 'Purchasing / Merchandising', 'purchasing-merchandising'),
                        ('manufacturing-engineering', 'Import / Export', 'import-export'),
                        ('manufacturing-engineering', 'Manufacturing / Process', 'manufacturing-process'),
                        ('manufacturing-engineering', 'Quality Control (QA/QC)', 'quality-control-qa-qc'),
                        ('manufacturing-engineering', 'Textiles / Garments / Fashion', 'textiles-garments-fashion'),
                        ('manufacturing-engineering', 'Mechanical / Auto / Automotive', 'mechanical-auto-automotive'),
                        ('manufacturing-engineering', 'Energy & Environmental Engineer', 'energy-environmental-engineer'),
                        ('manufacturing-engineering', 'Chemical Engineer', 'chemical-engineer'),
                        ('manufacturing-engineering', 'Mineral', 'mineral'),
                        ('manufacturing-engineering', 'Electrical / Electronics Engineer', 'electrical-electronics-engineer'),
                        ('manufacturing-engineering', 'Telecommunications', 'telecommunications'),
                        ('manufacturing-engineering', 'Food Tech / Nutritionist', 'food-tech-nutritionist'),
                        ('manufacturing-engineering', 'Agriculture / Forestry / Fishery', 'agriculture-forestry-fishery'),
                        ('service', 'Pharmacy / Doctor / Nurse', 'pharmacy-doctor-nurse'),
                        ('service', 'Medical Services / Healthcare Service', 'medical-services-healthcare-service'),
                        ('service', 'Tourism', 'tourism'),
                        ('service', 'Beauty / Cosmetics', 'beauty-cosmetics'),
                        ('service', 'Personal Care / Coach', 'personal-care-coach'),
                        ('service', 'Restaurant / FnB', 'restaurant-fnb'),
                        ('service', 'Hotel', 'hotel'),
                        ('service', 'Education / Training', 'education-training'),
                        ('service', 'Library', 'library'),
                        ('service', 'Law / Legal Agent', 'law-legal-agent'),
                        ('design-creativity', 'Interior / Exterior', 'interior-exterior'),
                        ('design-creativity', 'Architect', 'architect'),
                        ('design-creativity', 'Entertainment', 'entertainment'),
                        ('design-creativity', 'Arts / Creative Design', 'arts-creative-design'),
                        ('design-creativity', 'Photographer / Video Editor', 'photographer-video-editor')
                )
                INSERT INTO job_subcategories (category_id, name, slug, created_by, updated_by)
                SELECT c.id, seed.name, seed.slug, 'migration', 'migration'
                FROM seed
                INNER JOIN job_categories c ON c.slug = seed.category_slug
                ON CONFLICT (slug) DO UPDATE
                SET category_id = EXCLUDED.category_id,
                    name = EXCLUDED.name,
                    updated_at = CURRENT_TIMESTAMP,
                    updated_by = EXCLUDED.updated_by;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DELETE FROM job_subcategories
                WHERE slug IN (
                    'software-developer',
                    'machine-learning-ai-engineer',
                    'augmented-reality-ar-developer',
                    'internet-of-things-iot-developer',
                    'blockchain-developer',
                    'devops-engineer',
                    'data-engineer-scientist-analyst',
                    'network-engineer-cyber-security-expert',
                    'qa-tester',
                    'product-manager-business-analyst',
                    'it-support-specialist',
                    'retail-store',
                    'sales-business-development',
                    'customer-service',
                    'ecommerce',
                    'marketing-pr-communication-event',
                    'online-marketing',
                    'business-intelligence',
                    'banking',
                    'finance-investment',
                    'securities',
                    'accounting-auditing-tax',
                    'insurance',
                    'human-resources',
                    'administrative-clerk',
                    'interpreter-translator',
                    'consulting',
                    'management',
                    'printing-publishing',
                    'purchasing-merchandising',
                    'import-export',
                    'manufacturing-process',
                    'quality-control-qa-qc',
                    'textiles-garments-fashion',
                    'mechanical-auto-automotive',
                    'energy-environmental-engineer',
                    'chemical-engineer',
                    'mineral',
                    'electrical-electronics-engineer',
                    'telecommunications',
                    'food-tech-nutritionist',
                    'agriculture-forestry-fishery',
                    'pharmacy-doctor-nurse',
                    'medical-services-healthcare-service',
                    'tourism',
                    'beauty-cosmetics',
                    'personal-care-coach',
                    'restaurant-fnb',
                    'hotel',
                    'education-training',
                    'library',
                    'law-legal-agent',
                    'interior-exterior',
                    'architect',
                    'entertainment',
                    'arts-creative-design',
                    'photographer-video-editor'
                );
                """);

            migrationBuilder.Sql("""
                DELETE FROM job_categories
                WHERE slug IN (
                    'it',
                    'business-finance',
                    'management',
                    'manufacturing-engineering',
                    'service',
                    'design-creativity'
                );
                """);
        }
    }
}
