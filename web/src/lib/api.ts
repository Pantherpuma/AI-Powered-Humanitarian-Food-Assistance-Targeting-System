import axios from "axios";
import {
  CommunityReportList,
  DistributionRecommendation,
  VulnerabilityScore,
} from "../types";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  timeout: 10_000,
});

export const fetchVulnerability = async (region: string) => {
  const { data } = await client.get<VulnerabilityScore>(`/v1/vulnerability/${region}`);
  return data;
};

export const fetchReports = async () => {
  const { data } = await client.get<CommunityReportList>("/v1/reports");
  return data;
};

export const fetchDistributionPlan = async (regions: string[]) => {
  const params = new URLSearchParams();
  regions.forEach((r) => params.append("regions", r));
  const { data } = await client.get<DistributionRecommendation>("/v1/analytics/distribution-plan", {
    params,
  });
  return data;
};

