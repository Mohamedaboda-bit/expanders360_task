import { DataSource } from 'typeorm';
import { MongoClient } from 'mongodb';

export class DocumentsSeeder {
  private mongoClient: MongoClient;

  constructor(private dataSource: DataSource) {
    this.mongoClient = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/expander360');
  }

  async run(): Promise<void> {
    try {
      await this.mongoClient.connect();
      const db = this.mongoClient.db();
      const documentsCollection = db.collection('documententities');

      const projects = await this.dataSource.query('SELECT id, country_code FROM projects LIMIT 5');
      
      if (projects.length === 0) {
        console.log('⚠️  No projects found in MySQL. Please run projects seeder first.');
        return;
      }

      const documents = [
        {
          title: 'Market Research Report - Germany',
          content: 'Comprehensive analysis of the German market for software development services. Key findings include high demand for cloud solutions and strong preference for local vendors.',
          tags: ['market-research', 'germany', 'software-development'],
          projectId: Number(projects[0]?.id) || 1,
          metadata: {
            reportType: 'market-analysis',
            pages: 45,
            author: 'Research Team',
            lastUpdated: new Date()
          },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Legal Requirements - France',
          content: 'Legal framework and compliance requirements for operating in France. Includes tax obligations, employment laws, and business registration procedures.',
          tags: ['legal', 'france', 'compliance'],
          projectId: Number(projects[1]?.id) || 2,
          metadata: {
            documentType: 'legal-guide',
            jurisdiction: 'France',
            validUntil: '2025-12-31'
          },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Vendor Assessment - UK',
          content: 'Detailed evaluation of potential vendors in the UK market. Includes pricing analysis, service quality metrics, and client testimonials.',
          tags: ['vendor-assessment', 'uk', 'evaluation'],
          projectId: Number(projects[2]?.id) || 3,
          metadata: {
            assessmentType: 'vendor-evaluation',
            evaluatedVendors: 12,
            criteria: ['pricing', 'quality', 'reliability']
          },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Technical Specifications - Netherlands',
          content: 'Technical requirements and specifications for the Netherlands expansion project. Includes infrastructure needs, security requirements, and integration points.',
          tags: ['technical', 'netherlands', 'specifications'],
          projectId: Number(projects[3]?.id) || 4,
          metadata: {
            specType: 'technical-requirements',
            complexity: 'high',
            estimatedDuration: '6 months'
          },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Financial Projections - Spain',
          content: 'Financial analysis and projections for the Spanish market entry. Includes cost estimates, revenue projections, and ROI calculations.',
          tags: ['financial', 'spain', 'projections'],
          projectId: Number(projects[4]?.id) || 5,
          metadata: {
            analysisType: 'financial-projection',
            currency: 'EUR',
            projectionPeriod: '3 years'
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      await documentsCollection.deleteMany({});

      const result = await documentsCollection.insertMany(documents);

      console.log(`✅ Seeded ${result.insertedCount} documents in MongoDB`);
      console.log(`📄 Documents linked to projects: ${projects.map(p => p.id).join(', ')}`);

    } catch (error) {
      console.error('❌ Error seeding documents:', error);
    } finally {
      await this.mongoClient.close();
    }
  }
}
