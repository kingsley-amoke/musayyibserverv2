export interface AnalyticsTransaction {
  type: 'inflow' | 'outflow';
  amount: number;
  profit: number;
  date: string;
  day: string;
}

export interface AnalyticsSummary {
  date: string;
  totalInflow: number;
  totalOutflow: number;
  totalProfit: number;
}
