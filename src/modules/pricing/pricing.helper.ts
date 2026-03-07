import { CablePlan, DataPlan } from '../plans/plans.dto';

export class PricingHelper {
  static fromDataPlanFirestore(plan: DataPlan, price: number): DataPlan {
    return {
      ...plan,
      price,
    };
  }

  static fromCablePlanFirestore(plan: CablePlan, price: number): CablePlan {
    return {
      ...plan,
      price,
    };
  }
}
