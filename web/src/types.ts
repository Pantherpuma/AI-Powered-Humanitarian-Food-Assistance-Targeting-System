export type IndicatorMap = Record<string, number>;

export interface FeatureContribution {
  name: string;
  weight: number;
}

export interface VulnerabilityScore {
  region_id: string;
  risk_score: number;
  risk_level: string;
  updated_at: string;
  indicators: IndicatorMap;
  feature_contributions: FeatureContribution[];
}

export interface CommunityReport {
  id: string;
  reporter_name: string;
  reporter_role: string;
  county: string;
  payam: string;
  incident_type: string;
  households_impacted: number;
  narrative: string;
  severity: string;
  created_at: string;
}

export interface CommunityReportList {
  items: CommunityReport[];
  total: number;
}

export interface DistributionPlan {
  region_id: string;
  households_targeted: number;
  tonnage_required_mt: number;
  recommended_route: string[];
}

export interface DistributionRecommendation {
  generated_at: string;
  methodology: string;
  plans: DistributionPlan[];
}

