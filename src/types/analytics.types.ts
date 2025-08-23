export interface TopVendorResult {
  country_code: string;
  top_vendors: Array<{
    id: number;
    name: string;
    rating: number;
    response_sla_hours: number;
    avg_match_score: number;
    total_matches: number;
  }>;
  document_count: number;
}
