// interfaces/plan.interface.ts
export interface DataPlan {
  id: number;
  dataplan_id: string;
  network_id: number;
  plan_type: string;
  name: string; // "2.0GB"
  validity_value: number;
  validity_unit: 'day' | 'week' | 'month';

  vendor_meta?: string;
  price?: number;
}

export interface CablePlan {
  id: number;
  cableplan_id: string;
  cable: string;
  package: string;
  price?: number;
}

export interface Exam {
  exam_id: number;
  exam_name: string;
  price: number;
}

export interface Electricity {
  disco_id: number;
  disco_name: string;
}

export interface Network {
  network_id: number;
  network_name: string;
}
