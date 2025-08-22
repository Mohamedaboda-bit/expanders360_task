import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from '../../entities/vendor.entity';
import { Match } from '../../entities/match.entity';
import { Project } from '../../entities/project.entity';
import { TopVendorResult } from '../../types/analytics.types';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorsRepository: Repository<Vendor>,
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async getTopVendorsByCountry(): Promise<TopVendorResult[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const query = `
      SELECT 
        v.id,
        v.name,
        v.rating,
        v.response_sla_hours,
        vc.country_code,
        AVG(m.score) as avg_match_score,
        COUNT(m.id) as total_matches
      FROM vendors v
      INNER JOIN vendor_countries vc ON v.id = vc.vendor_id
      LEFT JOIN matches m ON v.id = m.vendor_id 
        AND m.created_at >= ?
      GROUP BY v.id, vc.country_code
      HAVING avg_match_score > 0
      ORDER BY vc.country_code, avg_match_score DESC
    `;

    const vendors = await this.vendorsRepository.query(query, [thirtyDaysAgo]);

    const result: TopVendorResult[] = [];
    const countryGroups: { [key: string]: any[] } = {};

    for (const vendor of vendors) {
      if (!countryGroups[vendor.country_code]) {
        countryGroups[vendor.country_code] = [];
      }
      countryGroups[vendor.country_code].push(vendor);
    }

    for (const [countryCode, countryVendors] of Object.entries(countryGroups)) {
      const top3 = countryVendors.slice(0, 3);
      
      const expansionProjectsCount = await this.projectsRepository.count({
        where: { 
          country_code: countryCode,
          status: 'active'
        }
      });

      result.push({
        country_code: countryCode,
        top_vendors: top3.map(v => ({
          id: v.id,
          name: v.name,
          rating: v.rating,
          response_sla_hours: v.response_sla_hours,
          avg_match_score: parseFloat(v.avg_match_score),
          total_matches: parseInt(v.total_matches)
        })),
        expansion_projects_count: expansionProjectsCount
      });
    }

    return result;
  }
}
